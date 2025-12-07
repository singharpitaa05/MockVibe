// ADMIN CONTROLLER 

import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getAdminDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    // Interview statistics
    const totalInterviews = await InterviewSession.countDocuments();
    const completedInterviews = await InterviewSession.countDocuments({ status: 'completed' });
    const inProgressInterviews = await InterviewSession.countDocuments({ status: 'in-progress' });
    
    const interviewsThisMonth = await InterviewSession.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    // Question statistics
    const totalQuestions = await Question.countDocuments({ isActive: true });
    const questionsByCategory = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const questionsByDifficulty = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    // Average scores
    const avgScoreResult = await InterviewSession.aggregate([
      { $match: { status: 'completed', overallScore: { $exists: true } } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Interview types breakdown
    const interviewsByType = await InterviewSession.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$interviewType', count: { $sum: 1 } } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyActivity = await InterviewSession.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most active users
    const topUsers = await InterviewSession.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$user', interviewCount: { $sum: 1 }, avgScore: { $avg: '$overallScore' } } },
      { $sort: { interviewCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' }
    ]);

    // Popular questions (most used)
    const popularQuestions = await Question.aggregate([
      { $match: { isActive: true } },
      { $sort: { timesUsed: -1 } },
      { $limit: 10 },
      { $project: { questionText: 1, timesUsed: 1, category: 1, difficulty: 1, averageScore: 1 } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      interviews: {
        total: totalInterviews,
        completed: completedInterviews,
        inProgress: inProgressInterviews,
        thisMonth: interviewsThisMonth,
        averageScore,
      },
      questions: {
        total: totalQuestions,
        byCategory: questionsByCategory,
        byDifficulty: questionsByDifficulty,
      },
      analytics: {
        interviewsByType,
        dailyActivity,
        topUsers: topUsers.map(u => ({
          userId: u._id,
          name: u.userDetails.name,
          email: u.userDetails.email,
          interviewCount: u.interviewCount,
          avgScore: Math.round(u.avgScore || 0),
        })),
        popularQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, isActive, limit = 20, page = 1 } = req.query;

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    // Get interview count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const interviewCount = await InterviewSession.countDocuments({ 
          user: user._id, 
          status: 'completed' 
        });
        
        const avgScoreResult = await InterviewSession.aggregate([
          { $match: { user: user._id, status: 'completed', overallScore: { $exists: true } } },
          { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
        ]);
        
        const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

        return {
          ...user.toObject(),
          stats: {
            interviewCount,
            avgScore,
          }
        };
      })
    );

    res.json({
      users: usersWithStats,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalUsers: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single user details with full stats
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's interview statistics
    const interviews = await InterviewSession.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const interviewStats = {
      total: await InterviewSession.countDocuments({ user: user._id }),
      completed: await InterviewSession.countDocuments({ user: user._id, status: 'completed' }),
      inProgress: await InterviewSession.countDocuments({ user: user._id, status: 'in-progress' }),
    };

    const avgScoreResult = await InterviewSession.aggregate([
      { $match: { user: user._id, status: 'completed', overallScore: { $exists: true } } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);

    const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    res.json({
      user,
      stats: {
        ...interviewStats,
        avgScore,
      },
      recentInterviews: interviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user (activate/deactivate, change role)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user's interviews
    await InterviewSession.deleteMany({ user: user._id });

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get system logs/activity
// @route   GET /api/admin/activity-logs
// @access  Private/Admin
const getActivityLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent interviews as activity
    const recentActivity = await InterviewSession.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .select('user jobRole interviewType status overallScore createdAt');

    const logs = recentActivity.map(activity => ({
      id: activity._id,
      user: activity.user,
      action: `${activity.status === 'completed' ? 'Completed' : 'Started'} ${activity.interviewType} interview`,
      details: `${activity.jobRole} - ${activity.status}`,
      score: activity.overallScore,
      timestamp: activity.createdAt,
    }));

    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
    deleteUser,
    getActivityLogs, getAdminDashboardStats,
    getAllUsers,
    getUserDetails,
    updateUser
};

