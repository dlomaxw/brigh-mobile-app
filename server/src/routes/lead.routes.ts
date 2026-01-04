import { Router } from 'express';
import { createLead, getLeads } from '../controllers/lead.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createLead); // Public
router.get('/', authenticateToken, getLeads); // Protected

export default router;
