import express from 'express'
import tryCatchMiddleware from '../middleware/tryCatchMiddleware'
import { followUser, unfollowUser } from '../controllers/user/followController'

const router = express.Router()

router.post('/users/:userId/follow/:followId',tryCatchMiddleware(followUser))
router.delete('/users/:userId/unfollow/:followId',tryCatchMiddleware(unfollowUser))


export default router