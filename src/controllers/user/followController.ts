import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../../Models/userModel';
import { HttpStatusCode } from '../../constants/constants';
// Import your User model

// Follow a user
export const followUser = async (req: Request, res: Response): Promise<any> => {
 
    const { userId, followId } = req.params;

    // Convert followId and userId to ObjectId using new keyword or directly
    const followObjectId = new mongoose.Types.ObjectId(followId);  // Use 'new' with ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the current user and the user to be followed
    const user = await User.findById(userObjectId);
    const userToFollow = await User.findById(followObjectId);

    if (!user || !userToFollow) {
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }

    // Check if the current user is already following the target user
    if (user.following.includes(followObjectId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: 'You are already following this user' });
    }

    // Add the target user to the current user's following list
    user.following.push(followObjectId);
    // Add the current user to the target user's followers list
    userToFollow.followers.push(userObjectId);

    // Save both users
    await user.save();
    await userToFollow.save();

    return res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK , message: 'User followed successfully', user });
 
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response): Promise<any> => {
 
    const { userId, followId } = req.params;

    // Convert followId and userId to ObjectId using new keyword or directly
    const followObjectId = new mongoose.Types.ObjectId(followId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the current user and the user to be unfollowed
    const user = await User.findById(userObjectId);
    const userToUnfollow = await User.findById(followObjectId);

    if (!user || !userToUnfollow) {
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }

    // Check if the current user is not following the target user
    if (!user.following.includes(followObjectId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: 'You are not following this user' });
    }

    // Remove the target user from the current user's following list
    user.following = user.following.filter(following => following.toString() !== followObjectId.toString());
    // Remove the current user from the target user's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userObjectId.toString());

    // Save both users
    await user.save();
    await userToUnfollow.save();

    return res.status(HttpStatusCode.OK).json({success:true, status:HttpStatusCode.OK, message: 'User unfollowed successfully', user });
  
};
