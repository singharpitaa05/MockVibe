// QUESTION ROUTES

// Question management routes
import express from 'express';
import {
    createQuestion,
    deleteQuestion,
    getQuestionById,
    getQuestions,
    getQuestionStats,
    getRandomQuestions,
    updateQuestion
} from '../controllers/questionController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

// Public/Protected routes
router.get('/', protect, getQuestions);
router.get('/random', protect, getRandomQuestions);
router.get('/stats', protect, authorize('admin', 'interviewer'), getQuestionStats);
router.get('/:id', protect, getQuestionById);

// Admin/Interviewer only routes
router.post('/', protect, authorize('admin', 'interviewer'), createQuestion);
router.put('/:id', protect, authorize('admin', 'interviewer'), updateQuestion);
router.delete('/:id', protect, authorize('admin', 'interviewer'), deleteQuestion);

export default router;