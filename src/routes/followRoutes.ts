import express from 'express'
import tryCatchMiddleware from '../middleware/tryCatchMiddleware'
import { followUser, getUserFollowers, getUserFollowing, unfollowUser } from '../controllers/user/followController'

const router = express.Router()

router.post('/users/:userId/follow/:followId',tryCatchMiddleware(followUser))
router.delete('/users/:userId/unfollow/:followId',tryCatchMiddleware(unfollowUser))
router.get('/followers/:userId',tryCatchMiddleware(getUserFollowers))
router.get('/following/:userId',tryCatchMiddleware(getUserFollowing))


export default router