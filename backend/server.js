import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import advancedVideoRoutes from './routes/advancedVideoRoutes.js';
import aiInterviewRoutes from './routes/aiInterviewRoutes.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import preferencesRoutes from './routes/preferencesRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import voiceInterviewRoutes from './routes/voiceInterviewRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai-interview', aiInterviewRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/voice-interview', voiceInterviewRoutes);
app.use('/api/advanced-video', advancedVideoRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('MockVibe API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});