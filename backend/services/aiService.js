// AI SERVICES

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// Generate interview question based on context
const generateQuestion = async (context) => {
  try {
    const model = getModel();
    
    const {
      jobRole,
      interviewType,
      difficulty,
      previousQuestions = [],
      userProfile,
    } = context;

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const question = response.text().trim();

    return question;
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question');
  }
};

// Generate follow-up question based on previous answer
const generateFollowUpQuestion = async (context) => {
  try {
    const model = getModel();
    
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const followUp = response.text().trim();

    return followUp;
  } catch (error) {
    console.error('Error generating follow-up:', error);
    throw new Error('Failed to generate follow-up question');
  }
};

// Evaluate user's answer
const evaluateAnswer = async (context) => {
  try {
    const model = getModel();
    
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    let evaluationText = response.text().trim();

    // Remove markdown code blocks if present
    evaluationText = evaluationText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const evaluation = JSON.parse(evaluationText);

    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
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
    const model = getModel();
    
    const {
      questions,
      averageScore,
      interviewType,
      jobRole,
    } = context;

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    let feedbackText = response.text().trim();

    // Remove markdown code blocks if present
    feedbackText = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const feedback = JSON.parse(feedbackText);

    return feedback;
  } catch (error) {
    console.error('Error generating overall feedback:', error);
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

