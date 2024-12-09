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
exports.googleVerify = void 0;
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleVerify = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Google Client ID:", process.env.CLIENT_ID);
    console.log("Received ID Token:", idToken);
    const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
    try {
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        if (!ticket) {
            throw new Error("Failed to verify ID Token. Ticket is undefined.");
        }
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error("Invalid ID Token: Payload is undefined.");
        }
        const { email, email_verified, name, picture, sub } = payload;
        if (!email_verified) {
            console.error("Email is not verified:", email);
            throw new Error("Email not verified by Google.");
        }
        console.log("Google Verification Successful. User Info:", {
            email,
            name,
            picture,
            sub,
        });
        return { email, name, picture, sub };
    }
    catch (error) {
        console.error("Error during Google verification:", error);
        throw new Error("Google verification failed.");
    }
});
exports.googleVerify = googleVerify;
