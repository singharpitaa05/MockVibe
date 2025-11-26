// INTERVIEW ROUTES

// Interview scheduling and management routes
import express from 'express';
import {
    cancelInterview,
    createInterview,
    deleteInterview,
    getInterviewById,
    getInterviews,
    getInterviewStats,
    getUpcomingInterviews,
    submitFeedback,
    updateInterview
} from '../controllers/interviewController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all authenticated users
router.post('/', protect, createInterview);
router.get('/', protect, getInterviews);
router.get('/upcoming', protect, getUpcomingInterviews);
router.get('/stats', protect, getInterviewStats);
router.get('/:id', protect, getInterviewById);
router.put('/:id', protect, updateInterview);
router.put('/:id/cancel', protect, cancelInterview);

// Interviewer/Admin only routes
router.put('/:id/feedback', protect, authorize('interviewer', 'admin'), submitFeedback);
router.delete('/:id', protect, authorize('admin'), deleteInterview);

export default router;