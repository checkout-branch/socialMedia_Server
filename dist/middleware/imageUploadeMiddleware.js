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
exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_KEY,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
// Configure Multer with memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 3000000 } // Limit file size to 2MB
});
// Image upload middleware
const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // Handle multer error
            console.error('Multer Error:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }
        if (req.file) {
            try {
                // Upload the file buffer to Cloudinary
                const result = yield cloudinary_1.default.v2.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary Error:', error);
                        return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
                    }
                    if (result) {
                        req.cloudinaryImageUrl = result.secure_url;
                        next();
                    }
                });
                // Write the file buffer to the Cloudinary stream
                if (req.file.buffer)
                    result.end(req.file.buffer);
            }
            catch (error) {
                console.error('Unexpected Error:', error);
                return res.status(500).json({ message: 'Unexpected error occurred during file upload' });
            }
        }
        else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    }));
};
exports.uploadImage = uploadImage;
