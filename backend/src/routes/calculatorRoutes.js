import { Router } from 'express';
import { calculate, history } from '../controllers/calculatorController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.post('/', calculate);
router.get('/history', history);
export default router;
