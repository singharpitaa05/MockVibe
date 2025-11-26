// INTERVIEW CONTROLLER

// Interview scheduling and management controller
import Interview from '../models/Interview.js';

// @desc    Create/Schedule a new interview
// @route   POST /api/interviews
// @access  Private
export const createInterview = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      difficulty,
      scheduledDate,
      duration,
      questions,
      interviewer
    } = req.body;

    // Validate scheduled date is in the future
    if (new Date(scheduledDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date must be in the future'
      });
    }

    // Create interview
    const interview = await Interview.create({
      candidate: req.user.id,
      interviewer: interviewer || null,
      title,
      description,
      type,
      difficulty,
      scheduledDate,
      duration,
      questions: questions || []
    });

    await interview.populate('candidate', 'name email');
    await interview.populate('interviewer', 'name email');
    await interview.populate('questions', 'title type difficulty');

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all interviews for user
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    // Build query based on user role
    const query = {
      $or: [
        { candidate: req.user.id },
        { interviewer: req.user.id }
      ]
    };

    if (status) query.status = status;
    if (type) query.type = type;

    // Pagination
    const skip = (page - 1) * limit;

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email')
      .populate('interviewer', 'name email')
      .populate('questions', 'title type difficulty')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email skills experience')
      .populate('interviewer', 'name email')
      .populate('questions');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check if user is authorized to view this interview
    if (
      interview.candidate._id.toString() !== req.user.id &&
      interview.interviewer?._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check authorization
    if (
      interview.candidate.toString() !== req.user.id &&
      interview.interviewer?.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('candidate', 'name email')
      .populate('interviewer', 'name email')
      .populate('questions', 'title type difficulty');

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel interview
// @route   PUT /api/interviews/:id/cancel
// @access  Private
export const cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check authorization
    if (
      interview.candidate.toString() !== req.user.id &&
      interview.interviewer?.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this interview'
      });
    }

    // Cannot cancel completed interviews
    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed interview'
      });
    }

    interview.status = 'cancelled';
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit interview feedback
// @route   PUT /api/interviews/:id/feedback
// @access  Private (Interviewer only)
export const submitFeedback = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Only interviewer can submit feedback
    if (
      interview.interviewer?.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the interviewer can submit feedback'
      });
    }

    // Update feedback
    interview.feedback = req.body.feedback;
    interview.feedbackShared = true;
    interview.status = 'completed';

    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get upcoming interviews
// @route   GET /api/interviews/upcoming
// @access  Private
export const getUpcomingInterviews = async (req, res) => {
  try {
    const now = new Date();
    const query = {
      $or: [
        { candidate: req.user.id },
        { interviewer: req.user.id }
      ],
      status: 'scheduled',
      scheduledDate: { $gte: now }
    };

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email')
      .populate('interviewer', 'name email')
      .populate('questions', 'title type difficulty')
      .sort({ scheduledDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get interview statistics for user
// @route   GET /api/interviews/stats
// @access  Private
export const getInterviewStats = async (req, res) => {
  try {
    const stats = await Interview.aggregate([
      {
        $match: {
          candidate: req.user._id
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          avgRating: { $avg: '$feedback.overallRating' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        total: 0,
        completed: 0,
        scheduled: 0,
        cancelled: 0,
        avgRating: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private/Admin
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};