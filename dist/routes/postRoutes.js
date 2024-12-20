"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatchMiddleware_1 = __importDefault(require("../middleware/tryCatchMiddleware"));
const postController_1 = require("../controllers/user/postController");
const imageUploadeMiddleware_1 = require("../middleware/imageUploadeMiddleware");
const router = express_1.default.Router();
router.post('/createpost/:id', imageUploadeMiddleware_1.uploadImage, (0, tryCatchMiddleware_1.default)(postController_1.createPost));
router.get('/posts', (0, tryCatchMiddleware_1.default)(postController_1.getPost));
router.get('/posts/:id', (0, tryCatchMiddleware_1.default)(postController_1.getPostById));
router.post('/posts/like/', (0, tryCatchMiddleware_1.default)(postController_1.toggle_like));
router.get('/posts/:postId/user/:userId/likestatus', (0, tryCatchMiddleware_1.default)(postController_1.getLikeStatus));
exports.default = router;
