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
exports.getPost = exports.createPost = void 0;
const constants_1 = require("../../constants/constants");
const userModel_1 = require("../../Models/userModel");
const postModel_1 = __importDefault(require("../../Models/postModel")); // Assuming your Post model is in this file
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
    const { userName, profileImage } = user;
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
