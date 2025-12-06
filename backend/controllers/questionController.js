import Question from '../models/Question.js';

// @desc    Get all questions with filters
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      role,
      tag,
      search,
      limit = 50,
      page = 1,
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (role) query.relevantRoles = role;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-sampleAnswer -evaluationCriteria'); // Hide answers from list view

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalQuestions: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get random questions for interview
// @route   POST /api/questions/random
// @access  Private
const getRandomQuestions = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      role,
      count = 5,
    } = req.body;

    // Build query
    const query = { isActive: true };

    if (category) {
      // Support multiple categories
      if (Array.isArray(category)) {
        query.category = { $in: category };
      } else {
        query.category = category;
      }
    }

    if (difficulty) query.difficulty = difficulty;
    if (role) query.relevantRoles = role;

    // Get random questions using aggregation
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } },
      { $project: { sampleAnswer: 0, evaluationCriteria: 0 } }, // Hide answers
    ]);

    // Update usage count for selected questions
    const questionIds = questions.map(q => q._id);
    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $inc: { timesUsed: 1 } }
    );

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Private
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Don't show sample answer to regular users during interview
    const questionData = question.toObject();
    delete questionData.sampleAnswer;
    delete questionData.evaluationCriteria;

    res.json(questionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new question (Admin only)
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      createdBy: req.user.email,
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update question (Admin only)
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update allowed fields
    Object.keys(req.body).forEach(key => {
      question[key] = req.body[key];
    });

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete question (Admin only)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Soft delete - just mark as inactive
    question.isActive = false;
    await question.save();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get question categories and stats
// @route   GET /api/questions/stats/overview
// @access  Private
const getQuestionStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            category: '$category',
            difficulty: '$difficulty',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          difficulties: {
            $push: {
              difficulty: '$_id.difficulty',
              count: '$count',
            },
          },
          total: { $sum: '$count' },
        },
      },
    ]);

    const totalQuestions = await Question.countDocuments({ isActive: true });

    res.json({
      totalQuestions,
      byCategory: stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
    createQuestion, deleteQuestion, getQuestionById, getQuestions, getQuestionStats, getRandomQuestions, updateQuestion
};
