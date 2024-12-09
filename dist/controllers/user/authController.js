"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.login = exports.verifyOtp = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../../Models/userModel");
const authJoi_1 = __importDefault(require("../../validation/authJoi"));
const otpService_1 = __importDefault(require("../../utils/otpService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const googleService_1 = require("../../utils/googleService");
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, error } = authJoi_1.default.validate(req.body);
    if (error) {
        console.log(error, "error from validation");
        return res.status(400).json({ message: "Found validation error", error });
    }
    console.log("registration initiated");
    const { userName, email, password } = value;
    const userExist = yield userModel_1.User.findOne({ email });
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
        yield userExist.save();
    }
    else {
        // For new users, hash the password and save all user details
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new userModel_1.User({
            userName,
            email,
            password: hashedPassword,
            otp,
            otpExpire,
        });
        yield newUser.save();
    }
    // Send OTP email
    try {
        yield (0, otpService_1.default)({
            email,
            subject: "OTP for Email Verification",
            html: `<h3>Your OTP is: ${otp}</h3>
                   <h3>OTP will expire within 2 minutes</h3>`,
        });
    }
    catch (error) {
        // Delete the user entry if it's a new registration and sending OTP fails
        if (!userExist) {
            yield userModel_1.User.findOneAndDelete({ email });
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
});
exports.register = register;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield userModel_1.User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp) {
        return res.status(404).json({ message: 'invalid otp' });
    }
    if (user.otpExpire && user.otpExpire < Date.now()) {
        return res.status(404).json({ message: 'otp time expire' });
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    yield user.save();
    res.status(201).json({ message: 'OTP verification successfull' });
});
exports.verifyOtp = verifyOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExist = yield userModel_1.User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "User does not exist" });
        }
        if (userExist.isBlocked) {
            return res.status(403).json({ message: "User is blocked by the admin" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, userExist.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        // Generate token for a valid user
        const token = jsonwebtoken_1.default.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        // Exclude password from user data before sending response
        const _a = userExist.toObject(), { password: hashedPassword } = _a, data = __rest(_a, ["password"]);
        // Set cookie with token
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
        res
            .cookie("Access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json({ message: "Login successful", user: data, token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});
exports.login = login;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    const { email, picture, sub, name } = yield (0, googleService_1.googleVerify)(idToken);
    console.log({ "id token is": idToken });
    const hashedPassword = bcrypt_1.default.hash(sub, 10);
    let user = userModel_1.User.findOne({ email });
    if (!user) {
        const newUser = yield userModel_1.User.create({ userName: name, email: email, password: hashedPassword, isVerified: true, profileImage: picture });
        const token = jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        return res.status(201).json({ message: 'login successfull', user: newUser, token });
    }
    res.status(200).json({ message: 'Login successfully' });
});
exports.googleAuth = googleAuth;
