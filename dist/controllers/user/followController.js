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
exports.getUserFollowing = exports.getUserFollowers = exports.unfollowUser = exports.followUser = void 0;
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
