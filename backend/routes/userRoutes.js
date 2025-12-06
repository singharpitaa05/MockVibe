// USER ROUTES

import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

export default router;