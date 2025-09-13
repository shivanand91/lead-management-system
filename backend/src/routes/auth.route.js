import express from 'express'
import { register, login, logout, currentUser } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, currentUser);

export default router;
