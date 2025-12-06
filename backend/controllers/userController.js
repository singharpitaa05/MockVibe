// USER CONTROLLER

import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.skillLevel = req.body.skillLevel || user.skillLevel;
    user.preferredRoles = req.body.preferredRoles || user.preferredRoles;
    user.skills = req.body.skills || user.skills;
    user.interviewGoals = req.body.interviewGoals || user.interviewGoals;
    user.resume = req.body.resume || user.resume;
    
    // Update profile completion status
    if (req.body.isProfileComplete !== undefined) {
      user.isProfileComplete = req.body.isProfileComplete;
    }

    const updatedUser = await user.save();

    // Return updated user without password
    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      skillLevel: updatedUser.skillLevel,
      preferredRoles: updatedUser.preferredRoles,
      skills: updatedUser.skills,
      interviewGoals: updatedUser.interviewGoals,
      resume: updatedUser.resume,
      isProfileComplete: updatedUser.isProfileComplete,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getProfile, updateProfile };
