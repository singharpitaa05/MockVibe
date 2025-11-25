// AUTHENTICATION ROUTES

// Authentication routes for register, login, logout, and user info
import express from 'express';
import {
    getMe,
    login,
    logout,
    register
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;