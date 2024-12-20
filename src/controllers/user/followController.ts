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


//followUnfollow toggle

export const toggleFollow = async (req: Request, res: Response): Promise<any> => {
  const { userId, followId } = req.body;

  // Validate the format of the IDs
  if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(followId)) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      status: HttpStatusCode.BAD_REQUEST,
      message: "Invalid ID format.",
    });
  }

  // Start a transaction to ensure atomic updates
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the user and the user to follow/unfollow within the session
    const user = await User.findById(userId).session(session);
    const userToFollow = await User.findById(followId).session(session);

    // If the user or the user to follow doesn't exist, abort the transaction
    if (!user || !userToFollow) {
      await session.abortTransaction();
      return res.status(HttpStatusCode.NOT_FOUND).json({
        status: HttpStatusCode.NOT_FOUND,
        message: "User or User to follow not found.",
      });
    }

    // Ensure the user is not following themselves
    if (userId === followId) {
      await session.abortTransaction();
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: HttpStatusCode.BAD_REQUEST,
        message: "You can't follow yourself.",
      });
    }

    // Check if the user is already following the other user
    const existingFollow = await Follower.findOne({ follower: userId, followed: followId }).session(session);

    if (existingFollow) {
      // User is already following, so unfollow
      await Follower.deleteOne({ follower: userId, followed: followId }).session(session);
      // Remove followId from user's following and userId from userToFollow's followers
      user.following = user.following.filter((id) => !id.equals(followId));
      userToFollow.followers = userToFollow.followers.filter((id) => !id.equals(userId));
      
      // Save both users
      await user.save({ session });
      await userToFollow.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      return res.status(HttpStatusCode.OK).json({
        status: HttpStatusCode.OK,
        message: "User unfollowed successfully.",
      });
    } else {
      // User is not following, so follow
      const newFollow = new Follower({
        follower: userId,
        followed: followId,
      });

      // Save the new follow record
      await newFollow.save({ session });

      // Add followId to user's following and userId to userToFollow's followers
      user.following.push(followId);
      userToFollow.followers.push(userId);

      // Save both users
      await user.save({ session });
      await userToFollow.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      return res.status(HttpStatusCode.OK).json({
        status: HttpStatusCode.OK,
        message: "User followed successfully.",
      });
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    console.error("Error during follow/unfollow operation:", error);
    return res.status(500).json({ message: "Internal server error." });
  } finally {
    // End the session
    session.endSession();
  }
};



export const getFollowStatus = async (req: Request, res: Response): Promise<any> => {
  const { userId, currentUserId } = req.params;

  try {
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Check if the current user is following the target user
    const isFollowing = targetUser.followers.some((follower) => follower.equals(currentUserObjectId));

    res.json({ isFollowing, followerCount: targetUser.followers.length });
  } catch (error) {
    console.error('Error fetching follow status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};










