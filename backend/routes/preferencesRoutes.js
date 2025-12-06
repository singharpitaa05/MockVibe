// PREFERENCES ROUTES

import express from 'express';
import {
    getPreferences,
    resetPreferences,
    updatePreferences,
} from '../controllers/preferencesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getPreferences)
  .put(updatePreferences);

router.post('/reset', resetPreferences);

export default router;