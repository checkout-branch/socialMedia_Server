import express from 'express';
import { createTournament, getTournament, getTournamentById } from '../controllers/user/tournamentController';
import { userToken } from '../middleware/authMiddleware';
import { uploadImage } from '../middleware/imageUploadeMiddleware';
import tryCatchMiddleware from '../middleware/tryCatchMiddleware';

const router = express.Router();

// Use the userToken middleware globally for these routes
// router.use(userToken);

router.get('/tournaments', tryCatchMiddleware(getTournament));
router.get('/tournaments/:id', tryCatchMiddleware(getTournamentById));
router.post('/createtournament/:id',uploadImage,tryCatchMiddleware(createTournament))

export default router;
