import { Router } from 'express';
import { heatmap } from '../controllers/heatmapController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.use(requireAuth); router.get('/', heatmap); export default router;