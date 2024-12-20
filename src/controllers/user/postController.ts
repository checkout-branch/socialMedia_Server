import { Request, Response } from "express";
import { HttpStatusCode } from "../../constants/constants";
import { User } from "../../Models/userModel";
import Post from "../../Models/postModel"; // Assuming your Post model is in this file
import mongoose, { Types } from "mongoose";


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

  const { userName, profileImage,_id } = user;

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
      userId:_id,
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


//getPostById
export const getPostById = async (req:Request, res:Response):Promise<any> =>{
  const {id} = req.params
  if(!id){
    return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode,message:'user not found'})
  }

  const post = await Post.findById(id)
  if(!post){
    return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND,message:'post not found'})
  }
  return res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK, data:post})

}




export const toggle_like = async (req: Request,res: Response): Promise<any> => {
  const { userId, postId } = req.body; // userId and postId from the request body

  // Validate the format of the IDs
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(postId)) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: "Invalid ID format." });
  }

  // Start a transaction to ensure atomic updates
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the post and user within the session
    const post = await Post.findById(postId).session(session);
    const user = await User.findById(userId).session(session);

    // If the post or user doesn't exist, abort the transaction
    if (!post || !user) {
      await session.abortTransaction();
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: "User or Post not found." });
    }

    // Initialize user.likedPosts if not already initialized
    user.likedPosts = user.likedPosts || [];

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // User has already liked the post, so unlike it
      post.likes = post.likes.filter((like) => like.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(
        (likedPostId) => likedPostId.toString() !== postId
      );
      
      // Save changes to post and user
      await post.save({ session });
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK, message: "Post unliked successfully." });
    } else {
      // User has not liked the post, so like it
      post.likes.push(userId);
      user.likedPosts.push(postId);

      // Save changes to post and user
      await post.save({ session });
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      return res.status(HttpStatusCode.OK).json({status:HttpStatusCode.OK, message: "Post liked successfully." });
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Error during like/unlike operation:", error);
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    // End the session
    session.endSession();
  }
};



export const getLikeStatus = async (req: Request, res: Response):Promise<any> => {
  const { postId,userId } = req.params; 

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.some((like) => like.equals(userObjectId));

    res.json({ isLiked, likeCount: post.likes.length });
  } catch (error) {
    console.error('Error fetching like status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};











