import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/authRoute';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/user', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
