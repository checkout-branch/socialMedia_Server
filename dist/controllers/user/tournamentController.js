"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTournament = exports.getTournament = void 0;
const tournamentModel_1 = __importDefault(require("../../Models/tournamentModel"));
const constants_1 = require("../../constants/constants");
const getTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tournament = yield tournamentModel_1.default.find();
    if (!tournament) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'Tournament not found', status: constants_1.HttpStatusCode.NOT_FOUND });
    }
    res.status(constants_1.HttpStatusCode.OK).json({ success: true, message: 'Get tournament lists', status: constants_1.HttpStatusCode.OK, data: tournament });
});
exports.getTournament = getTournament;
const createTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user details from the request (assumes user is authenticated)
        const { name: userName, profileImage: userImage } = req.user;
        // Tournament data from the request body
        const { game, gameImage, description, totalSlots, entryFee, prizepool, } = req.body;
        // Create a new tournament document
        const newTournament = new tournamentModel_1.default({
            game,
            userName, // Set dynamically from the logged-in user
            userImage, // Set dynamically from the logged-in user
            gameImage,
            description,
            totalSlots,
            entryFee,
            prizepool,
        });
        // Save to the database
        yield newTournament.save();
        res.status(201).json({ message: 'Tournament created successfully', tournament: newTournament });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create tournament', });
    }
});
exports.createTournament = createTournament;
