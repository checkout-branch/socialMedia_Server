"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    userName: {
        type: String,
    },
    profileImage: {
        type: String
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    share: {
        type: Number,
        default: 0,
    },
    comment: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model("Post", postSchema);
exports.default = Post;
