"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tournamentController_1 = require("../controllers/user/tournamentController");
const imageUploadeMiddleware_1 = require("../middleware/imageUploadeMiddleware");
const tryCatchMiddleware_1 = __importDefault(require("../middleware/tryCatchMiddleware"));
const router = express_1.default.Router();
// Use the userToken middleware globally for these routes
// router.use(userToken);
router.get('/tournaments', (0, tryCatchMiddleware_1.default)(tournamentController_1.getTournament));
router.get('/tournaments/:id', (0, tryCatchMiddleware_1.default)(tournamentController_1.getTournamentById));
router.post('/createtournament/:id', imageUploadeMiddleware_1.uploadImage, (0, tryCatchMiddleware_1.default)(tournamentController_1.createTournament));
exports.default = router;
