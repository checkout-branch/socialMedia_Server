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
exports.userToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve token from cookies
        const token = req.cookies['Access_token'];
        if (!token) {
            // Send a response if token is not provided
            return res.status(404).json({ message: 'Token not provided' });
        }
        // Verify the token using async/await pattern instead of callback
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // Check if the decoded token contains the user ID
        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: 'Token is missing user identification.' });
        }
        // Attach user ID to the request object
        req.userId = decoded.id;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        // Send a response in case of any errors during token verification
        return res.status(500).json({ error: 'An error occurred while verifying the token.' });
    }
});
exports.userToken = userToken;
