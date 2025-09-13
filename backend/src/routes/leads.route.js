import express from "express"
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/lead.controller.js';
import auth from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/', auth, createLead);
router.get('/', auth, getLeads);
router.get('/:id', auth, getLeadById);
router.put('/:id', auth, updateLead);
router.delete('/:id', auth, deleteLead);

export default router;
