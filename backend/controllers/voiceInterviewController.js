// VOICE INTERVIEW CONTROLLER

import InterviewSession from '../models/InterviewSession.js';
import { evaluateAnswer } from '../services/aiService.js';
import { analyzeSpeech, analyzeTone, generateSpeechFeedback } from '../services/speechAnalysisService.js';

// @desc    Process voice answer (transcribed text)
// @route   POST /api/voice-interview/:sessionId/process-voice
// @access  Private
const processVoiceAnswer = async (req, res) => {
  try {
    const { transcript, question, duration } = req.body;

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

    // Combine speech and content analysis
    const combinedScore = Math.round(
      (contentEvaluation.score * 0.7) + // 70% content
      (speechAnalysis.clarity * 0.15) + // 15% clarity
      (toneAnalysis.confidenceScore * 0.15) // 15% confidence
    );

    // Update session with answer and analysis
    session.questions.push({
      question,
      answer: transcript,
      evaluation: {
        score: combinedScore,
        feedback: contentEvaluation.feedback,
        strengths: [
          ...contentEvaluation.strengths,
          ...speechFeedback.strengths,
        ],
        improvements: [
          ...contentEvaluation.improvements,
          ...speechFeedback.improvements,
        ],
      },
      timestamp: new Date(),
    });

    // Update session speech analysis
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

    await session.save();

    res.json({
      evaluation: {
        score: combinedScore,
        feedback: contentEvaluation.feedback,
        strengths: [
          ...contentEvaluation.strengths,
          ...speechFeedback.strengths,
        ],
        improvements: [
          ...contentEvaluation.improvements,
          ...speechFeedback.improvements,
        ],
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
      currentQuestionNumber: session.questions.length,
    });
  } catch (error) {
    console.error('Error processing voice answer:', error);
    res.status(500).json({ message: 'Failed to process voice answer', error: error.message });
  }
};

// @desc    Analyze recorded audio (placeholder for future STT integration)
// @route   POST /api/voice-interview/:sessionId/transcribe
// @access  Private
const transcribeAudio = async (req, res) => {
  try {
    // This is a placeholder for Speech-to-Text integration
    // In production, you would:
    // 1. Receive audio file/blob from frontend
    // 2. Send to Google Cloud Speech-to-Text or similar service
    // 3. Return transcript

    // For now, we'll return a message
    res.json({
      message: 'Audio transcription endpoint ready',
      note: 'Integrate with Google Cloud Speech-to-Text API or Web Speech API for production',
      transcript: '', // Would contain the transcribed text
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ message: 'Failed to transcribe audio', error: error.message });
  }
};

// @desc    Get speech analysis for session
// @route   GET /api/voice-interview/:sessionId/speech-analysis
// @access  Private
const getSpeechAnalysis = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Verify session belongs to user
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!session.analysis || !session.analysis.speechAnalysis) {
      return res.status(404).json({ message: 'No speech analysis available for this session' });
    }

    res.json({
      speechAnalysis: session.analysis.speechAnalysis,
      questionsAnswered: session.questions.length,
    });
  } catch (error) {
    console.error('Error getting speech analysis:', error);
    res.status(500).json({ message: 'Failed to get speech analysis', error: error.message });
  }
};

export {
    getSpeechAnalysis, processVoiceAnswer,
    transcribeAudio
};
