// VOICE IBTERVIEW ROUTES

import express from 'express';
import {
    getSpeechAnalysis,
    processVoiceAnswer,
    transcribeAudio,
} from '../controllers/voiceInterviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Process voice answer with transcript
router.post('/:sessionId/process-voice', processVoiceAnswer);

// Transcribe audio (placeholder for future STT)
router.post('/:sessionId/transcribe', transcribeAudio);

// Get speech analysis for session
router.get('/:sessionId/speech-analysis', getSpeechAnalysis);

export default router;