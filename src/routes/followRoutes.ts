import express from 'express'
import tryCatchMiddleware from '../middleware/tryCatchMiddleware'
import { followUser, getFollowStatus, getUserFollowers, getUserFollowing, toggleFollow, unfollowUser } from '../controllers/user/followController'

const router = express.Router()

router.post('/users/:userId/follow/:followId',tryCatchMiddleware(followUser))
router.delete('/users/:userId/unfollow/:followId',tryCatchMiddleware(unfollowUser))
router.get('/followers/:userId',tryCatchMiddleware(getUserFollowers))
router.get('/following/:userId',tryCatchMiddleware(getUserFollowing))
router.post('/follow',tryCatchMiddleware(toggleFollow))
router.get('/follow/:userId/:currentUserId/followstatus',tryCatchMiddleware(getFollowStatus))


export default router