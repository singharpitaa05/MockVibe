// QUESTION ROUTES

import express from 'express';
import {
    createQuestion,
    deleteQuestion,
    getQuestionById,
    getQuestions,
    getQuestionStats,
    getRandomQuestions,
    updateQuestion,
} from '../controllers/questionController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get question stats
router.get('/stats/overview', getQuestionStats);

// Get random questions for interview
router.post('/random', getRandomQuestions);

// Get all questions and create new (admin only for create)
router.route('/')
  .get(getQuestions)
  .post(admin, createQuestion);

// Get, update, delete specific question (admin only for update/delete)
router.route('/:id')
  .get(getQuestionById)
  .put(admin, updateQuestion)
  .delete(admin, deleteQuestion);

export default router;