"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tournamentController_1 = require("../controllers/user/tournamentController");
const router = express_1.default.Router();
// Use the userToken middleware globally for these routes
// router.use(userToken);
router.get('/tournaments', tournamentController_1.getTournament);
router.get('/tournaments/:id', tournamentController_1.getTournamentById);
router.post('/createtournament/:id', tournamentController_1.createTournament);
exports.default = router;
