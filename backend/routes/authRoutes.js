// AUTHENTICATION ROUTES

import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

export default router;