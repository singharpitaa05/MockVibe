// ADVANCE VIDEO ROUTES

import express from 'express';
import {
    getFullAnalysis,
    processAdvancedVideoAnswer,
} from '../controllers/advancedVideoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Process advanced video answer with visual analysis
router.post('/:sessionId/process-video', processAdvancedVideoAnswer);

// Get full analysis (speech + video + content)
router.get('/:sessionId/full-analysis', getFullAnalysis);

export default router;