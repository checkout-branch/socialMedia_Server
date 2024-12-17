import express from "express";
import { getCoinById, getCoin } from "../controllers/user/coinController";
import { userToken } from "../middleware/authMiddleware";
import { get } from "mongoose";
import tryCatchMiddleware from "../middleware/tryCatchMiddleware";

const router = express.Router()

// router.use(userToken)


router.get('/purchasecoin',tryCatchMiddleware(getCoin) )
router.get('/purchasecoin/:id',tryCatchMiddleware(getCoinById))

export default router