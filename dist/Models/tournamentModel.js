"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Tournament Schema Definition
const tournamentSchema = new mongoose_1.default.Schema({
    tournamentName: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    image: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    slots: {
        type: Number,
        required: true
    },
    entryFee: {
        type: Number,
        required: true
    },
    firstPrize: {
        type: Number,
        required: true
    },
    secondPrize: {
        type: Number,
        required: true
    },
    thirdPrize: {
        type: Number,
        required: true
    }
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});
const Tournament = mongoose_1.default.model('Tournament', tournamentSchema);
exports.default = Tournament;
