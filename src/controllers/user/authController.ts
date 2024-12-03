import { Request, Response,} from "express";
import bcrypt from 'bcrypt'
import { User ,UserI} from "../../Models/userModel";
import userAuthJoi from "../../validation/authJoi";
import sendOtpToEMail from "../../utils/otpService";


export const register = async (req: Request, res: Response): Promise<any> => {
    const { value, error } = userAuthJoi.validate(req.body);

    if (error) {
        console.log(error, "error from validation");
        return res.status(400).json({ message: "Found validation error", error });
    }

    console.log("registration initiated");

    const { userName, email, password } = value;

    const userExist = await User.findOne({ email });

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    const otpExpire = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

    if (userExist) {
        // If the user already exists and is verified, return an error
        if (userExist.isVerified) {
            return res.status(400).json({ message: "User already exists and verified" });
        }

        // Update only the OTP and its expiration for unverified users
        userExist.otp = otp;
        userExist.otpExpire = otpExpire;
        await userExist.save();
    } else {
        // For new users, hash the password and save all user details
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
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
        if (!userExist) {
            await User.findOneAndDelete({ email });
        }
        return res.status(500).json({ message: "Error sending OTP to email" });
    }

    res.status(201).json({
        message: "OTP sent to email",
        user: {
            id: userExist ? userExist._id : null,
            userName: userExist ? userExist.userName : userName,
            email: userExist ? userExist.email : email,
        },
    });
};



export const verifyOtp = async (req:Request,res:Response):Promise<any>=>{
    
    const {email, otp} = req.body
    
    const user =await User.findOne({email })

    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    if(user.otp !== otp){
        return res.status(404).json({message:'invalid otp'})
    }
    if(user.otpExpire&&user.otpExpire<Date.now()){
        return res.status(404).json({message:'otp time expire'})
    }
    user.otp = undefined
    user.otpExpire = undefined
    await user.save()

    res.status(201).json({message:'OTP verification successfull'})
}

export const login = async (req:Request, res:Response):Promise<any> =>{
    const {email,password} = req.body

}