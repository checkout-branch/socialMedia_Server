import { Request, Response } from "express";
import { HttpStatusCode } from "../../constants/constants";
import { User } from "../../Models/userModel";
import Post from "../../Models/postModel"; // Assuming your Post model is in this file
import { Types } from "mongoose";


//create post
export const createPost = async (req: Request | any, res: Response): Promise<any> => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(HttpStatusCode.NOT_FOUND).json({
      status: HttpStatusCode.NOT_FOUND,
      message: 'User not found',
    });
  }

  const { userName, profileImage } = user;

  const { description } = req.body;
  
  const image = req.cloudinaryImageUrl;
  
  if (!description) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: HttpStatusCode.BAD_REQUEST,
      message: 'Description is required',
    });
  }

  try {
    // Create a new post
    const newPost = new Post({
      image,
      description,
      like: [], 
      share: 0, 
      comment: [],
      userName,
      profileImage,
    });

    const savedPost = await newPost.save();

    const postId = savedPost._id as Types.ObjectId;

    user.posts.push(postId); 
    
    await user.save();

   
    return res.status(HttpStatusCode.CREATED).json({
      status: HttpStatusCode.CREATED,
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'Error creating post',
      error: error, 
    });
  }
};

//get post
export const getPost = async (req:Request, res:Response):Promise<any> =>{
    const post = await Post.find()
    if(!post){
        return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message:'Post not found'})
    }
    return res.status(HttpStatusCode.OK).json({success:true, status:HttpStatusCode.OK, data:post})
}
