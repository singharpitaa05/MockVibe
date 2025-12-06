// AI INTERVIEW CONTROLLER

import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';
import {
    evaluateAnswer,
    generateFollowUpQuestion,
    generateOverallFeedback,
    generateQuestion,
} from '../services/aiService.js';
import { executeCode, validateCode } from '../services/codeExecutionService.js';

// @desc    Generate next question for interview
// @route   POST /api/ai-interview/:sessionId/generate-question
// @access  Private
const generateNextQuestion = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get user profile
    const user = await User.findById(req.user._id);

    // Get previous questions from this session
    const previousQuestions = session.questions.map(q => q.question);

    // Generate question using AI
    const questionText = await generateQuestion({
      jobRole: session.jobRole,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      previousQuestions,
      userProfile: {
        skillLevel: user.skillLevel,
        skills: user.skills,
        preferredRoles: user.preferredRoles,
      },
    });

    res.json({
      question: questionText,
      questionNumber: session.questions.length + 1,
    });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ message: 'Failed to generate question', error: error.message });
  }
};

// @desc    Submit answer and get evaluation
// @route   POST /api/ai-interview/:sessionId/submit-answer
// @access  Private
const submitAndEvaluateAnswer = async (req, res) => {
  try {
    const { question, answer, questionType } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Evaluate answer using AI
    const evaluation = await evaluateAnswer({
      question,
      answer,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      jobRole: session.jobRole,
    });

    // Add question and answer to session
    session.questions.push({
      question,
      answer,
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      },
      timestamp: new Date(),
    });

    // Update session analysis with detailed scores
    if (!session.analysis) {
      session.analysis = { contentAnalysis: {} };
    }
    
    session.analysis.contentAnalysis = evaluation.detailedAnalysis;

    await session.save();

    res.json({
      evaluation,
      currentQuestionNumber: session.questions.length,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to evaluate answer', error: error.message });
  }
};

// @desc    Execute code for coding questions
// @route   POST /api/ai-interview/:sessionId/execute-code
// @access  Private
const executeCodeSubmission = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ message: 'Code, language, and test cases are required' });
    }

    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate code syntax
    const validation = validateCode(language, code);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: 'Code validation failed', 
        error: validation.error 
      });
    }

    // Execute code
    const executionResult = await executeCode(language, code, testCases);

    res.json(executionResult);
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ message: 'Failed to execute code', error: error.message });
  }
};

// @desc    Generate follow-up question
// @route   POST /api/ai-interview/:sessionId/follow-up
// @access  Private
const generateFollowUp = async (req, res) => {
  try {
    const { originalQuestion, userAnswer } = req.body;

    if (!originalQuestion || !userAnswer) {
      return res.status(400).json({ message: 'Original question and answer are required' });
    }

    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate follow-up question
    const followUpQuestion = await generateFollowUpQuestion({
      originalQuestion,
      userAnswer,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
    });

    res.json({
      followUpQuestion,
    });
  } catch (error) {
    console.error('Error generating follow-up:', error);
    res.status(500).json({ message: 'Failed to generate follow-up', error: error.message });
  }
};

// @desc    Complete interview and generate overall feedback
// @route   POST /api/ai-interview/:sessionId/complete
// @access  Private
const completeInterviewWithAI = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (session.questions.length === 0) {
      return res.status(400).json({ message: 'No questions answered yet' });
    }

    // Calculate overall score
    const scores = session.questions
      .filter(q => q.evaluation && q.evaluation.score)
      .map(q => q.evaluation.score);
    
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    session.overallScore = averageScore;

    // Generate overall feedback using AI
    const overallFeedback = await generateOverallFeedback({
      questions: session.questions,
      averageScore,
      interviewType: session.interviewType,
      jobRole: session.jobRole,
    });

    // Update session with feedback
    session.strengths = overallFeedback.overallStrengths;
    session.weaknesses = overallFeedback.overallWeaknesses;
    session.recommendations = overallFeedback.recommendations;

    // Calculate duration
    if (session.startTime) {
      session.duration = Math.floor((new Date() - session.startTime) / 1000);
    }

    // Mark as completed
    session.status = 'completed';
    session.endTime = new Date();

    await session.save();

    res.json({
      message: 'Interview completed successfully',
      session,
      overallFeedback: overallFeedback.summaryFeedback,
    });
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ message: 'Failed to complete interview', error: error.message });
  }
};

export {
    completeInterviewWithAI, executeCodeSubmission,
    generateFollowUp, generateNextQuestion,
    submitAndEvaluateAnswer
};
