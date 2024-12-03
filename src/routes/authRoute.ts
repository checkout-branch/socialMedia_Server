import express from "express";
import { register, verifyOtp } from "../controllers/user/authController";

const router = express.Router()

router.post('/register',register)
router.post('/otpverification',verifyOtp)


export default router