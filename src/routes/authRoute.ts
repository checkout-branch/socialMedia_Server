import express from "express";
import { googleAuth, login, register, resendOtp, verifyOtp } from "../controllers/user/authController";

const router = express.Router()

router.post('/register',register)
router.post('/resentotp',resendOtp)
router.post('/otpverification',verifyOtp)
router.post('/login',login)
router.post('/googleauth',googleAuth)


export default router