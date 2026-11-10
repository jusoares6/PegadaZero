import { Router } from 'express';
import { listTips } from '../controllers/tipController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router(); router.use(requireAuth); router.get('/', listTips); export default router;
