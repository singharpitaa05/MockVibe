// QUESTION MODEL

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    // Question content
    questionText: {
      type: String,
      required: true,
    },
    
    // Question category
    category: {
      type: String,
      enum: ['Coding', 'Behavioral', 'System Design', 'HR', 'Technical Theory'],
      required: true,
    },
    
    // Subcategory for more specific classification
    subcategory: {
      type: String,
      // Examples: 'Arrays', 'Strings', 'Leadership', 'Scalability', etc.
    },
    
    // Difficulty level
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true,
    },
    
    // Job roles this question is relevant for
    relevantRoles: [{
      type: String,
      // Examples: 'Software Developer', 'Data Analyst', 'Product Manager', etc.
    }],
    
    // Tags for better filtering
    tags: [{
      type: String,
    }],
    
    // For coding questions
    codingDetails: {
      language: {
        type: String,
        enum: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Any'],
      },
      starterCode: String,
      testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: Boolean,
      }],
      constraints: String,
      timeComplexity: String,
      spaceComplexity: String,
    },
    
    // Sample/ideal answer for reference
    sampleAnswer: {
      type: String,
    },
    
    // Evaluation criteria
    evaluationCriteria: [{
      criterion: String,
      weight: Number, // Percentage weight in evaluation
    }],
    
    // Hints that can be provided during interview
    hints: [{
      type: String,
    }],
    
    // Follow-up questions
    followUpQuestions: [{
      type: String,
    }],
    
    // Usage statistics
    timesUsed: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    
    // Question status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Who created this question (for admin tracking)
    createdBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ relevantRoles: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ isActive: 1 });

// Method to increment usage
questionSchema.methods.incrementUsage = function() {
  this.timesUsed += 1;
  return this.save();
};

// Method to update average score
questionSchema.methods.updateAverageScore = function(newScore) {
  if (this.timesUsed === 0) {
    this.averageScore = newScore;
  } else {
    this.averageScore = ((this.averageScore * (this.timesUsed - 1)) + newScore) / this.timesUsed;
  }
  return this.save();
};

const Question = mongoose.model('Question', questionSchema);

export default Question;