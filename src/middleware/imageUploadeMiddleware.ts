import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_KEY,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Configure Multer with memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 3000000 } // Limit file size to 2MB
});

// Image upload middleware
export const uploadImage = (req: any, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            // Handle multer error
            console.error('Multer Error:', err);
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (req.file) {
            try {
                // Upload the file buffer to Cloudinary
                const result = await cloudinary.v2.uploader.upload_stream(
                    { folder: 'uploads' },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Error:', error);
                            return res.status(500).json({ message: 'Cloudinary upload failed', error: error.message });
                        }

                        if (result) {
                            req.cloudinaryImageUrl = result.secure_url;
                            next();
                        }
                    }
                );

                // Write the file buffer to the Cloudinary stream
                if (req.file.buffer) result.end(req.file.buffer);
            } catch (error) {
                console.error('Unexpected Error:', error);
                return res.status(500).json({ message: 'Unexpected error occurred during file upload' });
            }
        } else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    });
};
