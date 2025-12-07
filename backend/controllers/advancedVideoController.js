// ADVANCED VIDEO CONTROLLER

import InterviewSession from '../models/InterviewSession.js';
import { evaluateAnswer } from '../services/aiService.js';
import { analyzeSpeech, analyzeTone, generateSpeechFeedback } from '../services/speechAnalysisService.js';

// @desc    Process advanced video answer with visual analysis
// @route   POST /api/advanced-video/:sessionId/process-video
// @access  Private
const processAdvancedVideoAnswer = async (req, res) => {
  try {
    const { 
      transcript, 
      question, 
      duration, 
      visualAnalysis 
    } = req.body;

    if (!transcript || !question) {
      return res.status(400).json({ message: 'Transcript and question are required' });
    }

    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Analyze speech patterns
    const speechAnalysis = analyzeSpeech(transcript, duration || 30);
    const toneAnalysis = analyzeTone(transcript);
    const speechFeedback = generateSpeechFeedback(speechAnalysis);

    // Evaluate answer content using AI
    const contentEvaluation = await evaluateAnswer({
      question,
      answer: transcript,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      jobRole: session.jobRole,
    });

    // Process visual analysis data
    const processedVisualAnalysis = processVisualMetrics(visualAnalysis);

    // Generate visual feedback
    const visualFeedback = generateVisualFeedback(processedVisualAnalysis);

    // Combined score with visual analysis
    const combinedScore = Math.round(
      (contentEvaluation.score * 0.50) + // 50% content
      (speechAnalysis.clarity * 0.20) + // 20% speech clarity
      (toneAnalysis.confidenceScore * 0.15) + // 15% tone confidence
      (processedVisualAnalysis.overallConfidence * 0.15) // 15% visual confidence
    );

    // Combine all feedback
    const combinedStrengths = [
      ...contentEvaluation.strengths,
      ...speechFeedback.strengths,
      ...visualFeedback.strengths,
    ];

    const combinedImprovements = [
      ...contentEvaluation.improvements,
      ...speechFeedback.improvements,
      ...visualFeedback.improvements,
    ];

    // Update session with answer and comprehensive analysis
    session.questions.push({
      question,
      answer: transcript,
      evaluation: {
        score: combinedScore,
        feedback: contentEvaluation.feedback,
        strengths: combinedStrengths,
        improvements: combinedImprovements,
      },
      timestamp: new Date(),
    });

    // Update session analysis with all metrics
    if (!session.analysis) {
      session.analysis = {};
    }

    session.analysis.speechAnalysis = {
      fillerWords: speechAnalysis.fillerWords,
      speakingSpeed: speechAnalysis.speakingSpeed,
      clarity: speechAnalysis.clarity,
      pauses: speechAnalysis.pauses,
      confidenceScore: toneAnalysis.confidenceScore,
      avgWordsPerSentence: speechAnalysis.avgWordsPerSentence,
    };

    session.analysis.videoAnalysis = {
      eyeContact: processedVisualAnalysis.eyeContactScore,
      facialExpressions: processedVisualAnalysis.facialExpression,
      posture: processedVisualAnalysis.posture,
      confidenceScore: processedVisualAnalysis.overallConfidence,
      lookingAwayCount: processedVisualAnalysis.lookingAwayCount,
    };

    await session.save();

    res.json({
      evaluation: {
        score: combinedScore,
        feedback: contentEvaluation.feedback,
        strengths: combinedStrengths,
        improvements: combinedImprovements,
      },
      speechAnalysis: {
        fillerWords: speechAnalysis.fillerWords,
        speakingSpeed: speechAnalysis.speakingSpeed,
        speakingRate: speechAnalysis.speakingRate,
        clarity: speechAnalysis.clarity,
        pauses: speechAnalysis.pauses,
        wordCount: speechAnalysis.wordCount,
        confidenceScore: toneAnalysis.confidenceScore,
      },
      visualAnalysis: processedVisualAnalysis,
      currentQuestionNumber: session.questions.length,
    });
  } catch (error) {
    console.error('Error processing advanced video answer:', error);
    res.status(500).json({ 
      message: 'Failed to process video answer', 
      error: error.message 
    });
  }
};

// Process and validate visual metrics
const processVisualMetrics = (visualAnalysis) => {
  if (!visualAnalysis) {
    return {
      eyeContactScore: 0,
      posture: 'Unknown',
      facialExpression: 'Neutral',
      overallConfidence: 0,
      lookingAwayCount: 0,
    };
  }

  return {
    eyeContactScore: Math.min(100, Math.max(0, visualAnalysis.eyeContactScore || 0)),
    posture: visualAnalysis.posture || 'Fair',
    facialExpression: visualAnalysis.facialExpression || 'Neutral',
    overallConfidence: Math.min(100, Math.max(0, visualAnalysis.overallConfidence || 0)),
    lookingAwayCount: visualAnalysis.lookingAwayCount || 0,
  };
};

// Generate feedback based on visual analysis
const generateVisualFeedback = (visualAnalysis) => {
  const strengths = [];
  const improvements = [];

  // Eye contact feedback
  if (visualAnalysis.eyeContactScore >= 70) {
    strengths.push('Excellent eye contact maintained throughout');
  } else if (visualAnalysis.eyeContactScore >= 50) {
    strengths.push('Good eye contact during most of the answer');
  } else if (visualAnalysis.eyeContactScore < 40) {
    improvements.push('Try to maintain more consistent eye contact with the camera');
  }

  // Looking away feedback
  if (visualAnalysis.lookingAwayCount > 5) {
    improvements.push(`You looked away ${visualAnalysis.lookingAwayCount} times - try to stay focused on the camera`);
  } else if (visualAnalysis.lookingAwayCount === 0) {
    strengths.push('Maintained consistent focus throughout');
  }

  // Posture feedback
  if (visualAnalysis.posture === 'Good') {
    strengths.push('Excellent posture and positioning');
  } else if (visualAnalysis.posture === 'Needs Improvement') {
    improvements.push('Consider improving your posture and staying centered in frame');
  }

  // Expression feedback
  if (visualAnalysis.facialExpression === 'Confident') {
    strengths.push('Confident facial expressions observed');
  } else if (visualAnalysis.facialExpression === 'Uncertain') {
    improvements.push('Work on projecting more confidence through facial expressions');
  }

  // Overall confidence feedback
  if (visualAnalysis.overallConfidence >= 75) {
    strengths.push('Strong overall presence and confidence');
  } else if (visualAnalysis.overallConfidence < 50) {
    improvements.push('Practice presenting with more confidence and natural body language');
  }

  return { strengths, improvements };
};

// @desc    Get comprehensive analysis for session
// @route   GET /api/advanced-video/:sessionId/full-analysis
// @access  Private
const getFullAnalysis = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!session.analysis) {
      return res.status(404).json({ message: 'No analysis available for this session' });
    }

    res.json({
      speechAnalysis: session.analysis.speechAnalysis || null,
      videoAnalysis: session.analysis.videoAnalysis || null,
      contentAnalysis: session.analysis.contentAnalysis || null,
      overallScore: session.overallScore || 0,
      questionsAnswered: session.questions.length,
    });
  } catch (error) {
    console.error('Error getting full analysis:', error);
    res.status(500).json({ 
      message: 'Failed to get analysis', 
      error: error.message 
    });
  }
};

export {
    getFullAnalysis, processAdvancedVideoAnswer
};
