"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coinController_1 = require("../controllers/user/coinController");
const tryCatchMiddleware_1 = __importDefault(require("../middleware/tryCatchMiddleware"));
const router = express_1.default.Router();
// router.use(userToken)
router.get('/purchasecoin', (0, tryCatchMiddleware_1.default)(coinController_1.getCoin));
router.get('/purchasecoin/:id', (0, tryCatchMiddleware_1.default)(coinController_1.getCoinById));
exports.default = router;
