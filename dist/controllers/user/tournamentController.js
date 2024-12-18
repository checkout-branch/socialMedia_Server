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
exports.createTournament = exports.getTournamentById = exports.getTournament = void 0;
const tournamentModel_1 = __importDefault(require("../../Models/tournamentModel"));
const constants_1 = require("../../constants/constants");
const userModel_1 = require("../../Models/userModel");
const getTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tournament = yield tournamentModel_1.default.find();
    if (!tournament) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'Tournament not found', status: constants_1.HttpStatusCode.NOT_FOUND });
    }
    res.status(constants_1.HttpStatusCode.OK).json({ success: true, message: 'Get tournament lists', status: constants_1.HttpStatusCode.OK, data: tournament });
});
exports.getTournament = getTournament;
const getTournamentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tournament = yield tournamentModel_1.default.findById(id);
    console.log(tournament);
    if (!tournament) {
        return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ success: false, message: 'Tournament not found', status: constants_1.HttpStatusCode.NOT_FOUND });
    }
    res.status(constants_1.HttpStatusCode.OK).json({ success: true, messsage: 'Get the touurnament', status: constants_1.HttpStatusCode.OK, data: tournament });
});
exports.getTournamentById = getTournamentById;
const createTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the userId from request params
    try {
        // Fetch user details from the database
        const user = yield userModel_1.User.findById(id);
        if (!user) {
            return res.status(constants_1.HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
        }
        // Extract userName and profileImage from the user document
        const { userName, profileImage } = user;
        // Tournament data from the request body
        const { tournamentName, game, entryFee, firstPrize, secondPrize, thirdPrize, format, slots, description, } = req.body;
        // Get the image URL from the middleware
        const image = req.cloudinaryImageUrl;
        // Create a new tournament document
        const newTournament = new tournamentModel_1.default({
            tournamentName,
            game,
            userName, // Dynamically set from the user document
            profileImage, // Dynamically set from the user document
            entryFee,
            firstPrize,
            secondPrize,
            thirdPrize,
            format,
            slots,
            description,
            image // Add the Cloudinary URL
        });
        // Save the tournament to the database
        yield newTournament.save();
        // Add the tournament to the user's list of created tournaments
        user.tournamentCreate.push(newTournament._id);
        yield user.save();
        res.status(constants_1.HttpStatusCode.CREATED).json({
            message: "Tournament created successfully",
            tournament: newTournament,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(constants_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: "Failed to create tournament" });
    }
});
exports.createTournament = createTournament;
