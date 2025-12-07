import Question from '../models/Question.js';

// @desc    Get all questions with advanced filtering (Admin)
// @route   GET /api/admin/questions
// @access  Private/Admin
const getAllQuestionsAdmin = async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      isActive,
      sortBy = 'createdAt',
      order = 'desc',
      limit = 50,
      page = 1,
    } = req.query;

    const query = {};

    // Search in question text
    if (search) {
      query.questionText = { $regex: search, $options: 'i' };
    }

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const questions = await Question.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

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

// @desc    Get single question (Admin - includes sample answer)
// @route   GET /api/admin/questions/:id
// @access  Private/Admin
const getQuestionByIdAdmin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new question (Admin)
// @route   POST /api/admin/questions
// @access  Private/Admin
const createQuestionAdmin = async (req, res) => {
  try {
    const questionData = {
      ...req.body,
      createdBy: req.user.email,
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update question (Admin)
// @route   PUT /api/admin/questions/:id
// @access  Private/Admin
const updateQuestionAdmin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update all provided fields
    Object.keys(req.body).forEach(key => {
      question[key] = req.body[key];
    });

    await question.save();

    res.json({
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete question (Admin)
// @route   DELETE /api/admin/questions/:id
// @access  Private/Admin
const deleteQuestionAdmin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();

    res.json({ message: 'Question deleted permanently' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle question active status
// @route   PATCH /api/admin/questions/:id/toggle-active
// @access  Private/Admin
const toggleQuestionActive = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isActive = !question.isActive;
    await question.save();

    res.json({
      message: `Question ${question.isActive ? 'activated' : 'deactivated'} successfully`,
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Bulk import questions (Admin)
// @route   POST /api/admin/questions/bulk-import
// @access  Private/Admin
const bulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of questions' });
    }

    // Add createdBy to all questions
    const questionsWithCreator = questions.map(q => ({
      ...q,
      createdBy: req.user.email,
    }));

    const result = await Question.insertMany(questionsWithCreator, { ordered: false });

    res.status(201).json({
      message: `Successfully imported ${result.length} questions`,
      count: result.length,
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const successCount = error.result?.nInserted || 0;
      return res.status(207).json({
        message: `Imported ${successCount} questions. Some duplicates were skipped.`,
        count: successCount,
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export all questions (Admin)
// @route   GET /api/admin/questions/export
// @access  Private/Admin
const exportQuestions = async (req, res) => {
  try {
    const { category, difficulty, isActive } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const questions = await Question.find(query)
      .select('-createdAt -updatedAt -__v')
      .sort({ category: 1, difficulty: 1 });

    res.json({
      message: `Exported ${questions.length} questions`,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get question statistics (Admin)
// @route   GET /api/admin/questions/statistics
// @access  Private/Admin
const getQuestionStatistics = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const activeQuestions = await Question.countDocuments({ isActive: true });

    // By category
    const byCategory = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          avgTimesUsed: { $avg: '$timesUsed' },
          avgScore: { $avg: '$averageScore' },
        }
      },
      { $sort: { total: -1 } }
    ]);

    // By difficulty
    const byDifficulty = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most used questions
    const mostUsed = await Question.find({ isActive: true })
      .sort({ timesUsed: -1 })
      .limit(10)
      .select('questionText category difficulty timesUsed averageScore');

    // Least used questions
    const leastUsed = await Question.find({ isActive: true })
      .sort({ timesUsed: 1 })
      .limit(10)
      .select('questionText category difficulty timesUsed averageScore');

    // Questions with best average scores
    const bestPerforming = await Question.find({ isActive: true, averageScore: { $gt: 0 } })
      .sort({ averageScore: -1 })
      .limit(10)
      .select('questionText category difficulty timesUsed averageScore');

    // Questions with worst average scores
    const worstPerforming = await Question.find({ isActive: true, averageScore: { $gt: 0 } })
      .sort({ averageScore: 1 })
      .limit(10)
      .select('questionText category difficulty timesUsed averageScore');

    res.json({
      overview: {
        total: totalQuestions,
        active: activeQuestions,
        inactive: totalQuestions - activeQuestions,
      },
      byCategory,
      byDifficulty,
      analytics: {
        mostUsed,
        leastUsed,
        bestPerforming,
        worstPerforming,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Bulk update questions (activate/deactivate multiple)
// @route   PATCH /api/admin/questions/bulk-update
// @access  Private/Admin
const bulkUpdateQuestions = async (req, res) => {
  try {
    const { questionIds, updates } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of question IDs' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Please provide updates object' });
    }

    const result = await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: updates }
    );

    res.json({
      message: `Updated ${result.modifiedCount} questions`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Bulk delete questions
// @route   POST /api/admin/questions/bulk-delete
// @access  Private/Admin
const bulkDeleteQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of question IDs' });
    }

    const result = await Question.deleteMany({ _id: { $in: questionIds } });

    res.json({
      message: `Deleted ${result.deletedCount} questions`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
    bulkDeleteQuestions, bulkImportQuestions, bulkUpdateQuestions, createQuestionAdmin, deleteQuestionAdmin, exportQuestions, getAllQuestionsAdmin,
    getQuestionByIdAdmin, getQuestionStatistics, toggleQuestionActive, updateQuestionAdmin
};
