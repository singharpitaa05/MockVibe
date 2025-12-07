// AI SERVICES

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// Cache for storing generated questions to reduce API calls
const questionCache = new Map();
const feedbackCache = new Map();

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to retry API calls with exponential backoff
const retryWithBackoff = async (fn, maxRetries = MAX_RETRIES, initialDelay = INITIAL_RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        const delayTime = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
        const retryAfter = error.retryAfter || Math.ceil(delayTime / 1000);
        
        console.warn(`Rate limit hit. Retry attempt ${attempt}/${maxRetries}. Waiting ${retryAfter}s...`);
        await delay(retryAfter * 1000);
        continue;
      }
      
      // Don't retry on other errors
      throw error;
    }
  }
  
  throw lastError;
};

// Helper function to get a question from database as fallback
const getDatabaseQuestion = async (interviewType, difficulty, previousQuestions = []) => {
  try {
    // Map interviewType to category
    const categoryMap = {
      'Behavioral': 'Behavioral',
      'Coding': 'Coding',
      'Technical': 'Technical Theory',
      'System Design': 'System Design',
      'HR': 'HR'
    };

    const category = categoryMap[interviewType] || interviewType;

    // Find a question that hasn't been used yet
    const question = await Question.findOne({
      category: category,
      difficulty: difficulty,
      questionText: { $nin: previousQuestions }
    }).lean();

    if (question) {
      return question.questionText;
    }

    // If no exact match, find any question in the category regardless of difficulty
    const fallbackQuestion = await Question.findOne({
      category: category,
      questionText: { $nin: previousQuestions }
    }).lean();

    if (fallbackQuestion) {
      return fallbackQuestion.questionText;
    }

    // Last resort: return any question not previously asked
    const anyQuestion = await Question.findOne({
      questionText: { $nin: previousQuestions }
    }).lean();

    if (anyQuestion) {
      return anyQuestion.questionText;
    }

    return null;
  } catch (error) {
    console.error('Error fetching question from database:', error);
    return null;
  }
};

// Generate interview question based on context
const generateQuestion = async (context) => {
  try {
    const {
      jobRole,
      interviewType,
      difficulty,
      previousQuestions = [],
      userProfile,
    } = context;

    // Create cache key
    const cacheKey = `${jobRole}-${interviewType}-${difficulty}`;
    
    // Check cache first
    if (questionCache.has(cacheKey)) {
      const cachedQuestions = questionCache.get(cacheKey);
      // Return a random cached question that hasn't been used
      const availableQuestions = cachedQuestions.filter(q => !previousQuestions.includes(q));
      if (availableQuestions.length > 0) {
        console.log('Using cached question');
        return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      }
    }

    const prompt = `You are an expert technical interviewer conducting a ${interviewType} interview for a ${jobRole} position at ${difficulty} level.

User Profile:
- Skill Level: ${userProfile?.skillLevel || 'Not specified'}
- Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile?.preferredRoles?.join(', ') || 'Not specified'}

Previous questions asked in this interview:
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None (this is the first question)'}

Generate ONE ${interviewType} interview question that:
1. Is appropriate for ${difficulty} level
2. Is relevant to ${jobRole}
3. Does NOT repeat or closely resemble any previous questions
4. Follows best practices for ${interviewType} interviews
${interviewType === 'Behavioral' ? '5. Uses the STAR method framework (Situation, Task, Action, Result)' : ''}
${interviewType === 'Coding' ? '5. Includes clear input/output examples and constraints' : ''}

Return ONLY the question text, nothing else. Do not include any preamble, numbering, or explanation.`;

    const question = await retryWithBackoff(async () => {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response) {
        throw new Error('Empty response from Gemini API');
      }
      
      const text = response.text();
      if (!text) {
        throw new Error('No text content in Gemini response');
      }
      
      return text.trim();
    }).catch(async (error) => {
      // If API fails due to quota/rate limit, use database fallback
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        console.warn('API quota exhausted, using database fallback questions');
        const dbQuestion = await getDatabaseQuestion(interviewType, difficulty, previousQuestions);
        if (dbQuestion) {
          return dbQuestion;
        }
      }
      throw error;
    });

    // Cache the generated question
    if (!questionCache.has(cacheKey)) {
      questionCache.set(cacheKey, []);
    }
    questionCache.get(cacheKey).push(question);

    return question;
  } catch (error) {
    console.error('Error generating question:', error.message || error);
    // Last resort fallback - return a database question
    try {
      const dbQuestion = await getDatabaseQuestion(interviewType, difficulty, previousQuestions);
      if (dbQuestion) {
        console.log('Using database fallback question');
        return dbQuestion;
      }
    } catch (dbError) {
      console.error('Database fallback also failed:', dbError);
    }
    throw error;
  }
};

// Generate follow-up question based on previous answer
const generateFollowUpQuestion = async (context) => {
  try {
    const {
      originalQuestion,
      userAnswer,
      interviewType,
      difficulty,
    } = context;

    const prompt = `You are an expert interviewer. Based on the candidate's answer, generate a thoughtful follow-up question.

Original Question: ${originalQuestion}

Candidate's Answer: ${userAnswer}

Generate ONE follow-up question that:
1. Digs deeper into their answer
2. Tests their understanding further
3. Is appropriate for ${difficulty} level ${interviewType} interview
4. Is natural and conversational

Return ONLY the follow-up question text, nothing else.`;

    const followUp = await retryWithBackoff(async () => {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response) {
        throw new Error('Empty response from Gemini API');
      }
      
      const text = response.text();
      if (!text) {
        throw new Error('No text content in Gemini response');
      }
      
      return text.trim();
    });

    return followUp;
  } catch (error) {
    console.error('Error generating follow-up:', error.message || error);
    throw error;
  }
};

// Evaluate user's answer
const evaluateAnswer = async (context) => {
  try {
    const {
      question,
      answer,
      interviewType,
      difficulty,
      jobRole,
    } = context;

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer for a ${jobRole} position.

Interview Type: ${interviewType}
Difficulty Level: ${difficulty}

Question: ${question}

Candidate's Answer: ${answer}

Provide a comprehensive evaluation in the following JSON format:
{
  "score": <number between 0-100>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area for improvement 1>", "<area for improvement 2>"],
  "detailedAnalysis": {
    "relevance": <number 0-100>,
    "completeness": <number 0-100>,
    "correctness": <number 0-100>,
    "technicalAccuracy": <number 0-100>
  }
}

Evaluation criteria:
- Relevance: Does the answer address the question?
- Completeness: Is the answer thorough and covers key points?
- Correctness: Is the information accurate?
- Technical Accuracy: Are technical terms and concepts used correctly?
${interviewType === 'Behavioral' ? '- STAR Method: Does it follow Situation, Task, Action, Result structure?' : ''}
${interviewType === 'Coding' ? '- Code Quality: Is the solution efficient and well-structured?' : ''}

Return ONLY the JSON object, no additional text.`;

    const evaluation = await retryWithBackoff(async () => {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response) {
        throw new Error('Empty response from Gemini API');
      }
      
      let evaluationText = response.text();
      if (!evaluationText) {
        throw new Error('No text content in Gemini response');
      }
      
      evaluationText = evaluationText.trim();
      evaluationText = evaluationText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      return JSON.parse(evaluationText);
    });

    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error.message || error);
    // Return a default evaluation if AI fails
    return {
      score: 50,
      feedback: 'Unable to evaluate answer automatically. Please review manually.',
      strengths: ['Answer provided'],
      improvements: ['Could not be evaluated'],
      detailedAnalysis: {
        relevance: 50,
        completeness: 50,
        correctness: 50,
        technicalAccuracy: 50,
      },
    };
  }
};

// Generate overall interview feedback
const generateOverallFeedback = async (context) => {
  try {
    const {
      questions,
      averageScore,
      interviewType,
      jobRole,
    } = context;

    // Create cache key
    const cacheKey = `feedback-${jobRole}-${interviewType}-${Math.floor(averageScore / 10)}`;
    
    // Check cache first
    if (feedbackCache.has(cacheKey)) {
      console.log('Using cached feedback');
      return feedbackCache.get(cacheKey);
    }

    const questionsAndAnswers = questions.map((q, i) => 
      `Q${i + 1}: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.evaluation?.score || 'N/A'}`
    ).join('\n\n');

    const prompt = `You are an expert career coach reviewing a ${interviewType} interview for a ${jobRole} position.

Average Score: ${averageScore}%

Questions and Answers:
${questionsAndAnswers}

Provide comprehensive feedback in the following JSON format:
{
  "overallStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "overallWeaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "recommendations": ["<actionable recommendation 1>", "<actionable recommendation 2>", "<actionable recommendation 3>"],
  "summaryFeedback": "<2-3 sentences summarizing the overall performance>"
}

Focus on:
- Patterns across all answers
- Areas of consistent strength
- Areas needing improvement
- Specific, actionable recommendations

Return ONLY the JSON object, no additional text.`;

    const feedback = await retryWithBackoff(async () => {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      if (!response) {
        throw new Error('Empty response from Gemini API');
      }
      
      let feedbackText = response.text();
      if (!feedbackText) {
        throw new Error('No text content in Gemini response');
      }
      
      feedbackText = feedbackText.trim();
      feedbackText = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      return JSON.parse(feedbackText);
    });

    // Cache the feedback
    feedbackCache.set(cacheKey, feedback);

    return feedback;
  } catch (error) {
    console.error('Error generating overall feedback:', error.message || error);
    return {
      overallStrengths: ['Completed the interview'],
      overallWeaknesses: ['Could not generate detailed feedback'],
      recommendations: ['Review your answers and try again'],
      summaryFeedback: 'Unable to generate comprehensive feedback at this time.',
    };
  }
};

export {
  evaluateAnswer, generateFollowUpQuestion, generateOverallFeedback, generateQuestion
};

