import express from 'express'
import { getTournament } from '../controllers/user/tournamentController'


const router = express.Router()

router.get('/gettournaments',getTournament)

export default router