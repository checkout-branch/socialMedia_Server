import express from 'express'
import tryCatchMiddleware from '../middleware/tryCatchMiddleware'
import { getAllUser, getUserById } from '../controllers/user/profileController'

const router = express.Router()

router.get('/users',tryCatchMiddleware(getAllUser))
router.get('/users/:id',tryCatchMiddleware(getUserById))


export default router