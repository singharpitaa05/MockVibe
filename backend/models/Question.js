// QUESTION MODEL

// Question model for storing interview questions
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a question title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide question description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    type: {
      type: String,
      enum: ['coding', 'behavioral', 'system-design', 'technical'],
      required: [true, 'Please specify question type']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Please specify difficulty level']
    },
    category: {
      type: String,
      enum: ['DSA', 'Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Mobile', 'ML/AI', 'General'],
      required: [true, 'Please specify category']
    },
    tags: [{
      type: String,
      trim: true
    }],
    // For coding questions
    sampleTestCases: [{
      input: String,
      output: String,
      explanation: String
    }],
    hiddenTestCases: [{
      input: String,
      output: String
    }],
    constraints: {
      type: String,
      maxlength: [1000, 'Constraints cannot be more than 1000 characters']
    },
    hints: [{
      type: String,
      maxlength: [500, 'Hint cannot be more than 500 characters']
    }],
    // Template code for different languages
    starterCode: {
      javascript: String,
      python: String,
      java: String,
      cpp: String
    },
    // Expected approach/solution (for interviewers)
    solution: {
      type: String,
      maxlength: [10000, 'Solution cannot be more than 10000 characters']
    },
    timeComplexity: String,
    spaceComplexity: String,
    // Question statistics
    totalAttempts: {
      type: Number,
      default: 0
    },
    successfulAttempts: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient searching
questionSchema.index({ type: 1, difficulty: 1, category: 1 });
questionSchema.index({ tags: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;