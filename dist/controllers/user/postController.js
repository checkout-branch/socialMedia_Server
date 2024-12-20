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
exports.getLikeStatus = exports.toggle_like = exports.getPostById = exports.getPost = exports.createPost = void 0;
const constants_1 = require("../../constants/constants");
const userModel_1 = require("../../Models/userModel");
const postModel_1 = __importDefault(require("../../Models/postModel")); // Assuming your Post model is in this file
const mongoose_1 = __importDefault(require("mongoose"));
//create post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.User.findById(id);
    if (!user) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({
            status: constants_1.HttpStatusCode.NOT_FOUND,
            message: 'User not found',
        });
    }
    const { userName, profileImage, _id } = user;
    const { description } = req.body;
    const image = req.cloudinaryImageUrl;
    if (!description) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({
            status: constants_1.HttpStatusCode.BAD_REQUEST,
            message: 'Description is required',
        });
    }
    try {
        // Create a new post
        const newPost = new postModel_1.default({
            userId: _id,
            image,
            description,
            like: [],
            share: 0,
            comment: [],
            userName,
            profileImage,
        });
        const savedPost = yield newPost.save();
        const postId = savedPost._id;
        user.posts.push(postId);
        yield user.save();
        return res.status(constants_1.HttpStatusCode.CREATED).json({
            status: constants_1.HttpStatusCode.CREATED,
            message: 'Post created successfully',
            post: savedPost,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(constants_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            status: constants_1.HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Error creating post',
            error: error,
        });
    }
});
exports.createPost = createPost;
//get post
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield postModel_1.default.find();
    if (!post) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'Post not found' });
    }
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, data: post });
});
exports.getPost = getPost;
//getPostById
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode, message: 'user not found' });
    }
    const post = yield postModel_1.default.findById(id);
    if (!post) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: 'post not found' });
    }
    return res.status(constants_1.HttpStatusCode.OK).json({ success: true, status: constants_1.HttpStatusCode.OK, data: post });
});
exports.getPostById = getPostById;
const toggle_like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body; // userId and postId from the request body
    // Validate the format of the IDs
    if (!mongoose_1.default.isValidObjectId(userId) || !mongoose_1.default.isValidObjectId(postId)) {
        return res.status(constants_1.HttpStatusCode.BAD_REQUEST).json({ status: constants_1.HttpStatusCode.BAD_REQUEST, message: "Invalid ID format." });
    }
    // Start a transaction to ensure atomic updates
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the post and user within the session
        const post = yield postModel_1.default.findById(postId).session(session);
        const user = yield userModel_1.User.findById(userId).session(session);
        // If the post or user doesn't exist, abort the transaction
        if (!post || !user) {
            yield session.abortTransaction();
            return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ status: constants_1.HttpStatusCode.NOT_FOUND, message: "User or Post not found." });
        }
        // Initialize user.likedPosts if not already initialized
        user.likedPosts = user.likedPosts || [];
        // Check if the user has already liked the post
        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            // User has already liked the post, so unlike it
            post.likes = post.likes.filter((like) => like.toString() !== userId);
            user.likedPosts = user.likedPosts.filter((likedPostId) => likedPostId.toString() !== postId);
            // Save changes to post and user
            yield post.save({ session });
            yield user.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constants_1.HttpStatusCode.OK).json({ status: constants_1.HttpStatusCode.OK, message: "Post unliked successfully." });
        }
        else {
            // User has not liked the post, so like it
            post.likes.push(userId);
            user.likedPosts.push(postId);
            // Save changes to post and user
            yield post.save({ session });
            yield user.save({ session });
            // Commit the transaction
            yield session.commitTransaction();
            return res.status(constants_1.HttpStatusCode.OK).json({ status: constants_1.HttpStatusCode.OK, message: "Post liked successfully." });
        }
    }
    catch (error) {
        // If any error occurs, abort the transaction
        yield session.abortTransaction();
        console.error("Error during like/unlike operation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
    finally {
        // End the session
        session.endSession();
    }
});
exports.toggle_like = toggle_like;
const getLikeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId } = req.params;
    try {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const isLiked = post.likes.some((like) => like.equals(userObjectId));
        res.json({ isLiked, likeCount: post.likes.length });
    }
    catch (error) {
        console.error('Error fetching like status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getLikeStatus = getLikeStatus;
