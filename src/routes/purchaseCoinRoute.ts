import express from "express";
import { getCoinById, getCoin } from "../controllers/user/coinController";
import { userToken } from "../middleware/authMiddleware";
import { get } from "mongoose";

const router = express.Router()

// router.use(userToken)


router.get('/purchasecoin',getCoin)
router.get('/purchasecoin/:id',getCoinById)

export default router