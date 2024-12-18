"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatchMiddleware_1 = __importDefault(require("../middleware/tryCatchMiddleware"));
const profileController_1 = require("../controllers/user/profileController");
const router = express_1.default.Router();
router.get('/users', (0, tryCatchMiddleware_1.default)(profileController_1.getAllUser));
router.get('/users/:id', (0, tryCatchMiddleware_1.default)(profileController_1.getUserById));
exports.default = router;
