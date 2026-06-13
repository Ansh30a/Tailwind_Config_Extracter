import {Router} from 'express';
import { extractTailwindConfig, getUserThemes, saveTailwindConfig, deleteTheme } from '../controller/extractController';
import { userAuthGuard } from '../middleware/authMiddleware';

const router = Router();

router.post('/extract', extractTailwindConfig);
router.post('/save', userAuthGuard, saveTailwindConfig);
router.get('/history', userAuthGuard, getUserThemes);
router.delete('/:id', userAuthGuard, deleteTheme);

export default router;