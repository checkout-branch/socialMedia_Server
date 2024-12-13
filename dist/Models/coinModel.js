"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const coinSchema = new mongoose_1.default.Schema({
    coins: {
        type: Number,
    },
    prize: {
        type: Number
    }
});
exports.Coin = mongoose_1.default.model('Coin', coinSchema);
