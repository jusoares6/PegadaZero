import { Router } from 'express';
import { summary } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.use(requireAuth); router.get('/', summary); export default router;
