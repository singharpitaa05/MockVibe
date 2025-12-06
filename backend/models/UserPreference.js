// USER PREFERENCE MODEL

import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema(
  {
    // Reference to user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Interview default settings
    defaultInterviewSettings: {
      jobRole: {
        type: String,
      },
      interviewType: {
        type: String,
        enum: ['Technical', 'Behavioral', 'HR', 'Mixed', 'System Design'],
      },
      interviewMode: {
        type: String,
        enum: ['Text', 'Voice', 'Video'],
        default: 'Text',
      },
      difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
      },
      interviewerStyle: {
        type: String,
        enum: ['Friendly', 'Neutral', 'Strict'],
        default: 'Neutral',
      },
      questionCount: {
        type: Number,
        default: 5,
        min: 3,
        max: 10,
      },
    },

    // UI preferences
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },

    // Notification preferences
    notifications: {
      email: {
        interviewReminders: {
          type: Boolean,
          default: true,
        },
        feedbackAvailable: {
          type: Boolean,
          default: true,
        },
        weeklyProgress: {
          type: Boolean,
          default: true,
        },
        newFeatures: {
          type: Boolean,
          default: true,
        },
      },
      inApp: {
        interviewReminders: {
          type: Boolean,
          default: true,
        },
        feedbackAvailable: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Practice preferences
    practiceMode: {
      autoShowAnswers: {
        type: Boolean,
        default: false,
      },
      timerEnabled: {
        type: Boolean,
        default: true,
      },
      defaultCategory: {
        type: String,
      },
      defaultDifficulty: {
        type: String,
      },
    },

    // Accessibility
    accessibility: {
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
      },
      highContrast: {
        type: Boolean,
        default: false,
      },
      reduceMotion: {
        type: Boolean,
        default: false,
      },
    },

    // Language preference
    language: {
      type: String,
      default: 'en',
    },

    // Timezone
    timezone: {
      type: String,
      default: 'UTC',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userPreferenceSchema.index({ user: 1 });

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;