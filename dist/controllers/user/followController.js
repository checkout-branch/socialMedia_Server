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
exports.unfollowUser = exports.followUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("../../Models/userModel");
const constants_1 = require("../../constants/constants");
// Import your User model
// Follow a user
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followId } = req.params;
    // Convert followId and userId to ObjectId using new keyword or directly
    const followObjectId = new mongoose_1.default.Types.ObjectId(followId); // Use 'new' with ObjectId
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    // Find the current user and the user to be followed
    const user = yield userModel_1.User.findById(userObjectId);
    const userToFollow = yield userModel_1.User.findById(followObjectId);
    if (!user || !userToFollow) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    // Check if the current user is already following the target user
    if (user.following.includes(followObjectId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({ status: constants_1.HttpStatusCode.BAD_REQUEST, message: 'You are already following this user' });
    }
    // Add the target user to the current user's following list
    user.following.push(followObjectId);
    // Add the current user to the target user's followers list
    userToFollow.followers.push(userObjectId);
    // Save both users
    yield user.save();
    yield userToFollow.save();
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, message: 'User followed successfully', user });
});
exports.followUser = followUser;
// Unfollow a user
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followId } = req.params;
    // Convert followId and userId to ObjectId using new keyword or directly
    const followObjectId = new mongoose_1.default.Types.ObjectId(followId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    // Find the current user and the user to be unfollowed
    const user = yield userModel_1.User.findById(userObjectId);
    const userToUnfollow = yield userModel_1.User.findById(followObjectId);
    if (!user || !userToUnfollow) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'User not found' });
    }
    // Check if the current user is not following the target user
    if (!user.following.includes(followObjectId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({ status: constants_1.HttpStatusCode.BAD_REQUEST, message: 'You are not following this user' });
    }
    // Remove the target user from the current user's following list
    user.following = user.following.filter(following => following.toString() !== followObjectId.toString());
    // Remove the current user from the target user's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userObjectId.toString());
    // Save both users
    yield user.save();
    yield userToUnfollow.save();
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, message: 'User unfollowed successfully', user });
});
exports.unfollowUser = unfollowUser;
