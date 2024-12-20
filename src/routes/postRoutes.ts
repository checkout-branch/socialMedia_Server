import express  from "express";
import tryCatchMiddleware from "../middleware/tryCatchMiddleware";
import { createPost, getLikeStatus, getPost, getPostById, toggle_like } from "../controllers/user/postController";
import { uploadImage } from "../middleware/imageUploadeMiddleware";

const router = express.Router()


router.post('/createpost/:id',uploadImage,tryCatchMiddleware(createPost))
router.get('/posts',tryCatchMiddleware(getPost))
router.get('/posts/:id',tryCatchMiddleware(getPostById))
router.post('/posts/like/',tryCatchMiddleware(toggle_like))
router.get('/posts/:postId/user/:userId/likestatus',tryCatchMiddleware(getLikeStatus))

export default router