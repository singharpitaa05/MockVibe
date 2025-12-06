// USER MODEL

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Basic authentication fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
    // Profile information
    name: {
      type: String,
      trim: true,
    },
    skillLevel: {
      type: String,
      enum: ['Fresher', 'Intermediate', 'Senior'],
    },
    preferredRoles: [{
      type: String,
    }],
    skills: [{
      type: String,
    }],
    interviewGoals: {
      type: String,
    },
    resume: {
      type: String, // URL or file path
    },
    
    // Profile completion status
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'interviewer', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving user
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;