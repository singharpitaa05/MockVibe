// NOTIFICATION ROUTES

import express from 'express';
import {
    clearReadNotifications,
    createNotification,
    deleteNotification,
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark all as read
router.put('/mark-all-read', markAllAsRead);

// Clear all read notifications
router.delete('/clear-read', clearReadNotifications);

// Get all notifications and create new
router.route('/')
  .get(getNotifications)
  .post(createNotification);

// Mark specific notification as read
router.put('/:id/read', markAsRead);

// Delete specific notification
router.delete('/:id', deleteNotification);

export default router;