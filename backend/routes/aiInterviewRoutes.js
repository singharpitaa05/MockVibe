// AI INTERVIEW ROUTES

import express from 'express';
import {
    completeInterviewWithAI,
    executeCodeSubmission,
    generateFollowUp,
    generateNextQuestion,
    submitAndEvaluateAnswer,
} from '../controllers/aiInterviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Generate next question for interview
router.post('/:sessionId/generate-question', generateNextQuestion);

// Submit answer and get AI evaluation
router.post('/:sessionId/submit-answer', submitAndEvaluateAnswer);

// Execute code for coding questions
router.post('/:sessionId/execute-code', executeCodeSubmission);

// Generate follow-up question
router.post('/:sessionId/follow-up', generateFollowUp);

// Complete interview with AI feedback
router.post('/:sessionId/complete', completeInterviewWithAI);

export default router;