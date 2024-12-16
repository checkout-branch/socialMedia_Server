import express from 'express';
import { createTournament, getTournament, getTournamentById } from '../controllers/user/tournamentController';
import { userToken } from '../middleware/authMiddleware';

const router = express.Router();

// Use the userToken middleware globally for these routes
// router.use(userToken);

router.get('/tournaments', getTournament);
router.get('/tournaments/:id', getTournamentById);
router.post('/createtournament/:id',createTournament)

export default router;
