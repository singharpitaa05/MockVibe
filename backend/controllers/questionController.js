// QUESTION CONTROLLER

// Question management controller
import Question from '../models/Question.js';

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
  try {
    const questionData = {
      ...req.body,
      createdBy: req.user.id
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all questions with filters
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req, res) => {
  try {
    const { type, difficulty, category, tags, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isActive: true };

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const questions = await Question.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete question (soft delete)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Soft delete
    question.isActive = false;
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get random questions for practice
// @route   GET /api/questions/random
// @access  Private
export const getRandomQuestions = async (req, res) => {
  try {
    const { type, difficulty, count = 5 } = req.query;

    const query = { isActive: true };
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get question statistics
// @route   GET /api/questions/stats
// @access  Private/Admin
export const getQuestionStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          byDifficulty: {
            $push: {
              difficulty: '$difficulty',
              count: 1
            }
          },
          avgAttempts: { $avg: '$totalAttempts' },
          avgSuccessRate: {
            $avg: {
              $cond: [
                { $gt: ['$totalAttempts', 0] },
                { $multiply: [{ $divide: ['$successfulAttempts', '$totalAttempts'] }, 100] },
                0
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};