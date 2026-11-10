import { Router } from 'express';
import { completeMission, listMissions } from '../controllers/missionController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.use(requireAuth); router.get('/', listMissions); router.post('/:id/complete', completeMission); export default router;
