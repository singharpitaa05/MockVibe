// INTERVIEW CONTROLLER

import InterviewSession from '../models/InterviewSession.js';

// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Private
const createInterviewSession = async (req, res) => {
  try {
    const { jobRole, interviewType, interviewMode, difficulty, interviewerStyle } = req.body;

    // Validation
    if (!jobRole || !interviewType || !interviewMode || !difficulty) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: jobRole, interviewType, interviewMode, difficulty' 
      });
    }

    const interviewSession = await InterviewSession.create({
      user: req.user._id,
      jobRole,
      interviewType,
      interviewMode,
      difficulty,
      interviewerStyle: interviewerStyle || 'Neutral',
      status: 'in-progress',
      startTime: new Date(),
      questions: [],
    });

    res.status(201).json(interviewSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all interview sessions for user
// @route   GET /api/interviews
// @access  Private
const getInterviewSessions = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const query = { user: req.user._id };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await InterviewSession.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-questions.answer -questions.evaluation'); // Exclude detailed answers for list view

    const total = await InterviewSession.countDocuments(query);

    res.json({
      sessions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalSessions: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single interview session by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this interview' });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update interview session (add questions, update status, etc.)
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterviewSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this interview' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'questions',
      'overallScore',
      'analysis',
      'strengths',
      'weaknesses',
      'recommendations',
      'status',
      'endTime',
      'duration',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    const updatedSession = await session.save();
    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete interview session
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterviewSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this interview' });
    }

    await session.deleteOne();
    res.json({ message: 'Interview session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Complete interview session
// @route   POST /api/interviews/:id/complete
// @access  Private
const completeInterviewSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Check if session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this interview' });
    }

    // Calculate duration if not set
    if (!session.duration && session.startTime) {
      const duration = Math.floor((new Date() - session.startTime) / 1000);
      session.duration = duration;
    }

    session.status = 'completed';
    session.endTime = new Date();

    const completedSession = await session.save();
    res.json(completedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
    completeInterviewSession, createInterviewSession, deleteInterviewSession, getInterviewSessionById, getInterviewSessions, updateInterviewSession
};
