import { Router } from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favorite.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/toggle', authenticateToken, toggleFavorite);
router.get('/', authenticateToken, getFavorites);

export default router;
