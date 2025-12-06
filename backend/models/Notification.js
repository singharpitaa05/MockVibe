// NOTIFICATION MODEL

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Reference to user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        'interview_reminder',
        'feedback_available',
        'weekly_progress',
        'new_feature',
        'achievement',
        'system',
      ],
      required: true,
    },

    // Notification title and content
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // Optional link/action
    link: {
      type: String,
    },
    actionText: {
      type: String,
    },

    // Related entities
    relatedInterview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // Expiry (for time-sensitive notifications)
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;