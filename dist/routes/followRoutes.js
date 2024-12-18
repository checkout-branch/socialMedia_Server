"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatchMiddleware_1 = __importDefault(require("../middleware/tryCatchMiddleware"));
const followController_1 = require("../controllers/user/followController");
const router = express_1.default.Router();
router.post('/users/:userId/follow/:followId', (0, tryCatchMiddleware_1.default)(followController_1.followUser));
router.delete('/users/:userId/unfollow/:followId', (0, tryCatchMiddleware_1.default)(followController_1.unfollowUser));
exports.default = router;
