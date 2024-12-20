"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowStatus = exports.toggleFollow = exports.getUserFollowing = exports.getUserFollowers = exports.unfollowUser = exports.followUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("../../Models/userModel");
const constants_1 = require("../../constants/constants");
const follower_1 = __importDefault(require("../../Models/follower"));
// Import your User model
// Follow a user
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followId } = req.params;
    const followObjectId = new mongoose_1.default.Types.ObjectId(followId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    if (followObjectId.equals(userObjectId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({
            status: constants_1.HttpStatusCode.BAD_REQUEST,
            message: "You can't follow yourself",
        });
    }
    console.log(followObjectId, userObjectId);
    const user = yield userModel_1.User.findById(userObjectId);
    const userToFollow = yield userModel_1.User.findById(followObjectId);
    if (!user || !userToFollow) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    if (user.following.includes(followObjectId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({ status: constants_1.HttpStatusCode.BAD_REQUEST, message: 'You are already following this user' });
    }
    user.following.push(followObjectId);
    userToFollow.followers.push(userObjectId);
    // Save both users
    yield user.save();
    yield userToFollow.save();
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, message: 'User followed successfully', followed: followObjectId, follower: userToFollow });
});
exports.followUser = followUser;
// Unfollow a user
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followId } = req.params;
    const followObjectId = new mongoose_1.default.Types.ObjectId(followId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const user = yield userModel_1.User.findById(userObjectId);
    const userToUnfollow = yield userModel_1.User.findById(followObjectId);
    if (!user || !userToUnfollow) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    if (!user.following.includes(followObjectId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({ status: constants_1.HttpStatusCode.BAD_REQUEST, message: 'You are not following this user' });
    }
    user.following = user.following.filter(following => following.toString() !== followObjectId.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userObjectId.toString());
    // Save both users
    yield user.save();
    yield userToUnfollow.save();
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, message: 'User unfollowed successfully', unFollowed: userObjectId, unFollower: followObjectId });
});
exports.unfollowUser = unfollowUser;
// Get followers of a specific user
const getUserFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: "user not found" });
    }
    const followers = yield follower_1.default.find({ followed: userId }).populate('follower', 'userName profileImageUrl');
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, followers });
});
exports.getUserFollowers = getUserFollowers;
// Get users that a specific user is following
const getUserFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'user not found' });
    }
    const following = yield follower_1.default.find({ follower: userId }).populate('followed', 'userName profileImageUrl');
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, following });
});
exports.getUserFollowing = getUserFollowing;
//followUnfollow toggle
const toggleFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followId } = req.body;
    // Validate the format of the IDs
    if (!mongoose_1.default.isValidObjectId(userId) || !mongoose_1.default.isValidObjectId(followId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({
            status: constants_1.HttpStatusCode.BAD_REQUEST,
            message: "Invalid ID format.",
        });
    }
    // Start a transaction to ensure atomic updates
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the user and the user to follow/unfollow within the session
        const user = yield userModel_1.User.findById(userId).session(session);
        const userToFollow = yield userModel_1.User.findById(followId).session(session);
        // If the user or the user to follow doesn't exist, abort the transaction
        if (!user || !userToFollow) {
            yield session.abortTransaction();
            return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({
                status: constants_1.HttpStatusCode.NOT_FOUND,
                message: "User or User to follow not found.",
            });
        }
        // Ensure the user is not following themselves
        if (userId === followId) {
            yield session.abortTransaction();
            return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({
                status: constants_1.HttpStatusCode.BAD_REQUEST,
                message: "You can't follow yourself.",
            });
        }
        // Check if the user is already following the other user
        const existingFollow = yield follower_1.default.findOne({ follower: userId, followed: followId }).session(session);
        if (existingFollow) {
            // User is already following, so unfollow
            yield follower_1.default.deleteOne({ follower: userId, followed: followId }).session(session);
            // Remove followId from user's following and userId from userToFollow's followers
            user.following = user.following.filter((id) => !id.equals(followId));
            userToFollow.followers = userToFollow.followers.filter((id) => !id.equals(userId));
            // Save both users
            yield user.save({ session });
            yield userToFollow.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constants_1.HttpStatusCode.OK).json({
                status: constants_1.HttpStatusCode.OK,
                message: "User unfollowed successfully.",
            });
        }
        else {
            // User is not following, so follow
            const newFollow = new follower_1.default({
                follower: userId,
                followed: followId,
            });
            // Save the new follow record
            yield newFollow.save({ session });
            // Add followId to user's following and userId to userToFollow's followers
            user.following.push(followId);
            userToFollow.followers.push(userId);
            // Save both users
            yield user.save({ session });
            yield userToFollow.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constants_1.HttpStatusCode.OK).json({
                status: constants_1.HttpStatusCode.OK,
                message: "User followed successfully.",
            });
        }
    }
    catch (error) {
        // If any error occurs, abort the transaction
        yield session.abortTransaction();
        console.error("Error during follow/unfollow operation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
    finally {
        // End the session
        session.endSession();
    }
});
exports.toggleFollow = toggleFollow;
const getFollowStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, currentUserId } = req.params;
    try {
        const currentUserObjectId = new mongoose_1.default.Types.ObjectId(currentUserId);
        const targetUser = yield userModel_1.User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }
        // Check if the current user is following the target user
        const isFollowing = targetUser.followers.some((follower) => follower.equals(currentUserObjectId));
        res.json({ isFollowing, followerCount: targetUser.followers.length });
    }
    catch (error) {
        console.error('Error fetching follow status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getFollowStatus = getFollowStatus;
