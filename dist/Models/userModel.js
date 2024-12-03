"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
