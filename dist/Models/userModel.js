"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    // name:{
    //     type:String,
    //     required:true
    // },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
    },
    gender: {
        type: String,
    },
    day: {
        type: Number,
    },
    month: {
        type: String,
    },
    year: {
        type: Number,
    },
    otp: {
        type: Number,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpire: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    followers: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        }],
    following: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        }],
    tournamentCreate: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tournament'
        }],
    posts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Post'
        }],
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
