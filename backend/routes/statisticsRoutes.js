// STATISTICS ROUTES

import express from 'express';
import { getDashboardStats, getDetailedAnalytics } from '../controllers/statisticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getDetailedAnalytics);

export default router;