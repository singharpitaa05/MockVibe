// INTERVIEW SESSION MODEL

import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    // Reference to user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Interview configuration
    jobRole: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'Behavioral', 'HR', 'Mixed', 'System Design'],
      required: true,
    },
    interviewMode: {
      type: String,
      enum: ['Text', 'Voice', 'Video'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true,
    },
    interviewerStyle: {
      type: String,
      enum: ['Friendly', 'Neutral', 'Strict'],
      default: 'Neutral',
    },
    
    // Interview content
    questions: [{
      question: String,
      answer: String,
      evaluation: {
        score: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
      },
      timestamp: Date,
    }],
    
    // Overall performance
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    
    // Detailed analysis
    analysis: {
      contentAnalysis: {
        relevance: Number,
        completeness: Number,
        correctness: Number,
        technicalAccuracy: Number,
      },
      speechAnalysis: {
        fillerWords: Number,
        speakingSpeed: String,
        clarity: Number,
        pauses: Number,
      },
      videoAnalysis: {
        eyeContact: Number,
        facialExpressions: String,
        posture: String,
        confidenceScore: Number,
      },
    },
    
    // Feedback and recommendations
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    
    // Session metadata
    duration: {
      type: Number, // Duration in seconds
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
interviewSessionSchema.index({ user: 1, createdAt: -1 });
interviewSessionSchema.index({ status: 1 });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;