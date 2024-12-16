import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extend the Request interface to include userId
interface RequestWithUserId extends Request {
  userId?: string;
}

export const userToken = async (req: RequestWithUserId, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Retrieve token from cookies
    const token = req.cookies['Access_token'];


    if (!token) {
      // Send a response if token is not provided
      return res.status(404).json({ message: 'Token not provided' });
    }

    // Verify the token using async/await pattern
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;

    // Check if the decoded token contains the user ID
    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: 'Token is missing user identification.' });
    }

    // Attach user ID to the request object
    req.user = decoded.id;

    console.log(req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    // Send a response in case of any errors during token verification
    return res.status(500).json({ error: 'An error occurred while verifying the token.' });
  }
};
