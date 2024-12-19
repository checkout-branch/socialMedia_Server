import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../../Models/userModel';
import { HttpStatusCode } from '../../constants/constants';
import Follower from '../../Models/follower';
// Import your User model

// Follow a user
export const followUser = async (req: Request, res: Response): Promise<any> => {
 
    const { userId, followId } = req.params;

    const followObjectId = new mongoose.Types.ObjectId(followId);  
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (followObjectId.equals(userObjectId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: HttpStatusCode.BAD_REQUEST,
        message: "You can't follow yourself",
      });
    }
    console.log(followObjectId,userObjectId);

    const user = await User.findById(userObjectId);
    const userToFollow = await User.findById(followObjectId);

    if (!user || !userToFollow) {
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }

    if (user.following.includes(followObjectId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: 'You are already following this user' });
    }

    user.following.push(followObjectId);
    userToFollow.followers.push(userObjectId);

    // Save both users
    await user.save();
    await userToFollow.save();

    return res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK , message: 'User followed successfully', followed:followObjectId, follower:userToFollow});
 
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response): Promise<any> => {
 
    const { userId, followId } = req.params;

    const followObjectId = new mongoose.Types.ObjectId(followId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userObjectId);
    const userToUnfollow = await User.findById(followObjectId);

    if (!user || !userToUnfollow) {
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }

    if (!user.following.includes(followObjectId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({status:HttpStatusCode.BAD_REQUEST, message: 'You are not following this user' });
    }

    user.following = user.following.filter(following => following.toString() !== followObjectId.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userObjectId.toString());

    // Save both users
    await user.save();
    await userToUnfollow.save();

    return res.status(HttpStatusCode.OK).json({success:true, status:HttpStatusCode.OK, message: 'User unfollowed successfully', unFollowed:userObjectId, unFollower:followObjectId});
  
};




// Get followers of a specific user
export const getUserFollowers = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params; 

    if(!userId){
      return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message:"user not found"})
    }

    const followers = await Follower.find({ followed: userId }).populate('follower', 'userName profileImageUrl');
    
    return res.status(HttpStatusCode.OK).json({success:true, status:HttpStatusCode.OK, followers });
  
};


// Get users that a specific user is following
export const getUserFollowing = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params; 

  if(!userId) {
    return res.status(HttpStatusCode.NOT_FOUND).json({status:HttpStatusCode.NOT_FOUND, message:'user not found'})
  }

    const following = await Follower.find({ follower: userId }).populate('followed', 'userName profileImageUrl');
    
    
    return res.status(HttpStatusCode.OK).json({success:true,status:HttpStatusCode.OK, following });
  
};










