import { Router } from 'express';
import { createProperty, getProperties, getPropertyById, deleteProperty, updateProperty } from '../controllers/property.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticateToken, createProperty);
router.put('/:id', authenticateToken, updateProperty);
router.delete('/:id', authenticateToken, deleteProperty);

export default router;
