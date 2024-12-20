import { Request, Response,} from "express";
import bcrypt from 'bcrypt'
import { User ,UserI} from "../../Models/userModel";
import userAuthJoi from "../../validation/authJoi";
import sendOtpToEMail from "../../utils/otpService";
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { googleVerify } from "../../utils/googleService";
import { HttpStatusCode } from "../../constants/constants";

env.config()


export const register = async (req: Request, res: Response): Promise<any> => {
    const { value, error } = userAuthJoi.validate(req.body);
    console.log(req.body)

    if (error) {
        console.log(error, "error from validation");
        return res.status(400).json({ message: "Found validation error", error });
    }

    console.log("registration initiated");

    const { userName, email, password, gender, day, month, year} = value;

    const userExistByEmail = await User.findOne({ email });
    const userExistByUserName = await User.findOne({ userName });

    if (userExistByEmail?.isVerified) {
        return res.status(400).json({ message: "User already exists and verified" });
    }

    if (userExistByUserName) {
        return res.status(400).json({ message: "UserName already exists" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const otpExpire = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

    if (userExistByEmail) {
        // If the user already exists and is verified, return an error

        // Update only the OTP and its expiration for unverified users
        userExistByEmail.otp = otp;
        userExistByEmail.otpExpire = otpExpire;
        await userExistByEmail.save();
    } else {
        // For new users, hash the password and save all user details
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            userName,
            email,
            password: hashedPassword,
            gender,
            day,
            month,
            year,
            otp,
            otpExpire,
        });

        await newUser.save();
    }

    
    // Send OTP email
    try {
        await sendOtpToEMail({
            email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>
                   <h3>OTP will expire within 2 minutes</h3>`,
        });
    } catch (error) {
        // Delete the user entry if it's a new registration and sending OTP fails
        if (!userExistByEmail) {
            await User.findOneAndDelete({ email });
        }
        return res.status(500).json({ message: "Error sending OTP to email" });
    }

    res.status(201).json({
        success:true,
        message: "OTP sent to email",
    });
};



export const resendOtp = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentTime = Date.now(); // Get the current time in milliseconds

        // Check if the user exists and if otpExpire exists
        if (userExist?.otpExpire && currentTime < userExist.otpExpire) {
            // Calculate the time remaining before OTP can be resent
            const timeRemaining = Math.ceil((userExist.otpExpire - currentTime) / 1000); // Convert to seconds
            return res.status(400).json({
                message: `OTP resend is allowed only after 1 minute. Please wait ${timeRemaining} seconds.`
            });
        }

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpire = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

        // Update the user's OTP and expiration time in the database
        userExist.otp = otp;
        userExist.otpExpire = otpExpire;
        await userExist.save();

        // Send OTP via email (assuming a sendOtpEmail function exists)
           // Send OTP email
    try {
        await sendOtpToEMail({
            email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>
                   <h3>OTP will expire within 2 minutes</h3>`,
        });
    } catch (error) {
        // Delete the user entry if it's a new registration and sending OTP fails
        if (!userExist) {
            await User.findOneAndDelete({ email });
        }
        return res.status(500).json({ message: "Error sending OTP to email" });
    }

        return res.status(201).json({
            succes:true,
            message: 'OTP resent successfully. It is valid for 2 minutes.',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const verifyOtp = async (req:Request,res:Response):Promise<any>=>{
    
    const {email, otp} = req.body
    
    const user = await User.findOne({email })
    console.log(user?.otp,otp);
    

    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }
    if(user.otp !== otp){
        return res.status(404).json({success:false,message:'invalid otp'})
    }
    if(user.otpExpire&&user.otpExpire<Date.now()){
        return res.status(404).json({success:false,message:'otp time expire'})
    }
    user.otp = undefined
    user.otpExpire = undefined
    user.isVerified=true
    await user.save()
    res.status(201).json({success:true,message:'OTP verification successfull'})
}


export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "User does not exist" });
        }

        if (userExist.isBlocked) {
            return res.status(403).json({ message: "User is blocked by the admin" });
        }

        const validPassword = await bcrypt.compare(password, userExist.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate token for a valid user
        const token = jwt.sign(
            { id: userExist._id },
            process.env.JWT_SECRET_KEY as string, 
            { expiresIn: "1h" } 
        );

        // Exclude password from user data before sending response
        // const { password: hashedPassword,...data} = userExist.toObject();
        
        // Set cookie with token
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
        res
            .cookie("Access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json({success:true, message: "Login successful", token ,status:HttpStatusCode.OK,
                user:{
                name:userExist.name,
                id:userExist._id,
                email:userExist.email,
                userName:userExist.userName,
                profileImage:userExist.profileImage,
                DOB:{month:userExist.month,day:userExist.day,year:userExist.year},
                gender:userExist.gender,
            }
            });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
};



export const googleAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idToken } = req.body;

    // Verify Google ID Token
    const { email, picture, sub, name } = await googleVerify(idToken);

    if (!email || !sub) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    console.log({ "ID token is": idToken });

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      const hashedPassword = await bcrypt.hash(sub, 10); // Use `await` to hash password correctly
      user = await User.create({
        userName: name,
        email: email,
        password: hashedPassword,
        isVerified: true,
        profileImage: picture,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("Error in Google Authentication:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during Google authentication" });
  }
};
