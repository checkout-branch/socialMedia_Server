"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Tournament Schema Definition
const tournamentSchema = new mongoose_1.default.Schema({
    game: {
        type: String,
        required: [true, 'Game name is required'],
        trim: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        default: '', // Optional
    },
    gameImage: {
        type: String,
        required: [true, 'Game image is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    totalSlots: {
        type: Number,
        required: [true, 'Total slots are required'],
        min: [1, 'Total slots must be at least 1'],
    },
    entryFee: {
        type: Number,
        required: [true, 'Entry fee is required'],
        min: [0, 'Entry fee must be at least 0'],
    },
    prizepool: {
        type: [Number],
        required: true,
        validate: {
            validator: function (value) {
                return value.every((prize) => prize >= 0);
            },
            message: 'Prizepool amounts must be non-negative',
        },
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});
const Tournament = mongoose_1.default.model('Tournament', tournamentSchema);
exports.default = Tournament;
