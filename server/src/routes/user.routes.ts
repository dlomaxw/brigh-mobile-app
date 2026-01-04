import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getPerformanceMetrics } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken); // Protect all user routes

router.get('/', getUsers);
router.post('/', createUser); // Should be restricted to Admin
router.put('/:id', updateUser); // Admin or self
router.delete('/:id', deleteUser); // Admin only
router.get('/metrics', getPerformanceMetrics);

export default router;
