// INTERVIEW ROUTES

import express from 'express';
import {
    completeInterviewSession,
    createInterviewSession,
    deleteInterviewSession,
    getInterviewSessionById,
    getInterviewSessions,
    updateInterviewSession,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create and get all interviews
router.route('/')
  .post(createInterviewSession)
  .get(getInterviewSessions);

// Complete interview
router.post('/:id/complete', completeInterviewSession);

// Get, update, delete specific interview
router.route('/:id')
  .get(getInterviewSessionById)
  .put(updateInterviewSession)
  .delete(deleteInterviewSession);

export default router;