import express  from "express";
import tryCatchMiddleware from "../middleware/tryCatchMiddleware";
import { createPost, getPost } from "../controllers/user/postController";
import { uploadImage } from "../middleware/imageUploadeMiddleware";

const router = express.Router()


router.post('/createpost/:id',uploadImage,tryCatchMiddleware(createPost))
router.get('/posts',tryCatchMiddleware(getPost))

export default router