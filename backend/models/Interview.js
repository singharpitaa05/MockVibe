// INTERVIEW MODEL

// Interview model for managing mock interview sessions
import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate is required']
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'Interview title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    type: {
      type: String,
      enum: ['coding', 'behavioral', 'system-design', 'technical', 'mixed'],
      required: [true, 'Interview type is required']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required']
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes']
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    // Interview room details
    meetingLink: {
      type: String
    },
    roomId: {
      type: String,
      unique: true,
      sparse: true
    },
    // Feedback and scoring
    feedback: {
      technicalSkills: {
        type: Number,
        min: 0,
        max: 10
      },
      problemSolving: {
        type: Number,
        min: 0,
        max: 10
      },
      communication: {
        type: Number,
        min: 0,
        max: 10
      },
      codeQuality: {
        type: Number,
        min: 0,
        max: 10
      },
      overallRating: {
        type: Number,
        min: 0,
        max: 10
      },
      strengths: [String],
      improvements: [String],
      comments: {
        type: String,
        maxlength: [2000, 'Comments cannot exceed 2000 characters']
      },
      recommendHire: {
        type: Boolean
      }
    },
    // Candidate performance data
    performance: {
      questionsAttempted: {
        type: Number,
        default: 0
      },
      questionsSolved: {
        type: Number,
        default: 0
      },
      totalTime: {
        type: Number, // in minutes
        default: 0
      },
      codeSubmissions: {
        type: Number,
        default: 0
      }
    },
    // Recording and notes
    recordingUrl: String,
    interviewerNotes: {
      type: String,
      maxlength: [5000, 'Notes cannot exceed 5000 characters']
    },
    candidateNotes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    },
    // Notification flags
    reminderSent: {
      type: Boolean,
      default: false
    },
    feedbackShared: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
interviewSchema.index({ candidate: 1, status: 1 });
interviewSchema.index({ interviewer: 1, status: 1 });
interviewSchema.index({ scheduledDate: 1 });
interviewSchema.index({ roomId: 1 });

// Generate unique room ID before saving
interviewSchema.pre('save', function(next) {
  if (!this.roomId && this.isNew) {
    this.roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;