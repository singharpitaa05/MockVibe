import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [codeExecutionResult, setCodeExecutionResult] = useState(null);

  useEffect(() => {
    fetchSessionAndStartInterview();
  }, [id]);

  const fetchSessionAndStartInterview = async () => {
    try {
      setLoading(true);
      
      // Get session details
      const { data: sessionData } = await api.get(`/interviews/${id}`);
      setSession(sessionData);
      setTotalQuestions(sessionData.questionCount || 5);

      // Generate first AI question
      await generateNextQuestion(sessionData);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview');
      setLoading(false);
    }
  };

  const generateNextQuestion = async (sessionData = session) => {
    try {
      setGeneratingQuestion(true);
      setError('');
      
      const { data } = await api.post(`/ai-interview/${id}/generate-question`);
      
      setCurrentQuestion(data.question);
      setQuestionCount(data.questionNumber);
      setGeneratingQuestion(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate question');
      setGeneratingQuestion(false);
    }
  };

  const handleRunCode = async () => {
    if (!answer.trim()) {
      alert('Please write some code before running');
      return;
    }

    setSubmitting(true);
    setCodeExecutionResult(null);

    try {
      // For now, we'll use a simple test case
      // In a real app, you'd get test cases from the question
      const testCases = [
        { input: '"hello"', expectedOutput: '"olleh"', isHidden: false },
        { input: '"world"', expectedOutput: '"dlrow"', isHidden: false },
      ];

      const { data } = await api.post(`/ai-interview/${id}/execute-code`, {
        code: answer,
        language: 'javascript',
        testCases,
      });

      setCodeExecutionResult(data);
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute code');
      setSubmitting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    setSubmitting(true);
    setShowEvaluation(false);
    setEvaluation(null);

    try {
      // Submit answer and get AI evaluation
      const { data } = await api.post(`/ai-interview/${id}/submit-answer`, {
        question: currentQuestion,
        answer: answer,
        questionType: session.interviewType,
      });

      setEvaluation(data.evaluation);
      setShowEvaluation(true);
      setSubmitting(false);

      // Auto-hide evaluation after 5 seconds and move to next question
      setTimeout(() => {
        proceedToNext();
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
      setSubmitting(false);
    }
  };

  const proceedToNext = async () => {
    setShowEvaluation(false);
    setAnswer('');
    setCodeExecutionResult(null);

    // Check if we've reached the total number of questions
    if (questionCount >= totalQuestions) {
      // Complete interview
      await completeInterview();
    } else {
      // Generate next question
      await generateNextQuestion();
    }
  };

  const completeInterview = async () => {
    try {
      setLoading(true);
      // If no questions have been answered yet,that edge case uses a different endpoint
      if (session && Array.isArray(session.questions) && session.questions.length === 0) {
        await api.post(`/interviews/${id}/complete`);
      } else {
        // Complete interview with AI feedback
        await api.post(`/ai-interview/${id}/complete`);
      }

      // Navigate to results
      navigate(`/interview-result/${id}`);
    } catch (err) {
      setError('Failed to complete interview');
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    const confirmed = window.confirm('Are you sure you want to end this interview? Your progress will be saved.');
    if (confirmed) {
      await completeInterview();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">
            {generatingQuestion ? 'Generating your next question...' : 'Preparing your interview...'}
          </div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = (questionCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.jobRole} Interview</h1>
              <p className="text-sm text-gray-600">
                {session.interviewType} • {session.difficulty} • {session.interviewMode} Mode
              </p>
            </div>
            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Interview
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {questionCount} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Evaluation Feedback (shows after submission) */}
        {showEvaluation && evaluation && (
          <div className="mb-6 bg-linear-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">✅</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Answer Evaluated!</h3>
                <p className="text-sm text-gray-600">Moving to next question in a moment...</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-gray-700">Score:</span>
                <span className={`text-2xl font-bold px-4 py-1 rounded-lg ${
                  evaluation.score >= 80 ? 'text-green-600 bg-green-100' :
                  evaluation.score >= 60 ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {evaluation.score}%
                </span>
              </div>
              <p className="text-gray-700">{evaluation.feedback}</p>
            </div>

            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="mb-3">
                <div className="font-semibold text-green-700 mb-1">✓ Strengths:</div>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.improvements && evaluation.improvements.length > 0 && (
              <div>
                <div className="font-semibold text-orange-700 mb-1">→ Areas to Improve:</div>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {evaluation.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={proceedToNext}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Continue to Next Question →
            </button>
          </div>
        )}

        {/* Question Card */}
        {!showEvaluation && currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {questionCount}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {session.interviewType}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {session.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                    🤖 AI Generated
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentQuestion}
                </h2>
              </div>
            </div>

            {/* Code Execution Results */}
            {codeExecutionResult && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                <h4 className="font-semibold text-gray-900 mb-3">Execution Results:</h4>
                {codeExecutionResult.success ? (
                  <div>
                    <div className={`mb-2 font-semibold ${
                      codeExecutionResult.summary.allPassed ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      Passed: {codeExecutionResult.summary.passed} / {codeExecutionResult.summary.total}
                      ({codeExecutionResult.summary.percentage}%)
                    </div>
                    <div className="space-y-2">
                      {codeExecutionResult.results.map((result, idx) => (
                        <div key={idx} className={`p-2 rounded text-sm ${
                          result.passed ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <div className="font-medium">
                            {result.passed ? '✓' : '✗'} Test Case {idx + 1}
                          </div>
                          <div className="text-xs text-gray-600">
                            Input: {result.input} → Expected: {result.expectedOutput}
                          </div>
                          {!result.passed && (
                            <div className="text-xs text-red-600">
                              {result.error || `Got: ${result.actualOutput}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">{codeExecutionResult.error}</div>
                )}
              </div>
            )}

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder={
                  session.interviewType === 'Coding'
                    ? 'Write your code here...\n\nfunction solution() {\n  // Your code\n}'
                    : 'Type your answer here...\n\nTip: For behavioral questions, use the STAR method:\n- Situation\n- Task\n- Action\n- Result'
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                💡 Tip: {session.interviewType === 'Behavioral' 
                  ? 'Use the STAR method in your answer'
                  : 'Explain your thought process clearly'}
              </div>
              <div className="flex gap-3">
                {session.interviewType === 'Coding' && (
                  <button
                    onClick={handleRunCode}
                    disabled={submitting || !answer.trim()}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ▶ Run Code
                  </button>
                )}
                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answer.trim()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '⏳ Evaluating...' : 'Submit Answer →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Progress Dots */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx < questionCount - 1
                    ? 'bg-green-500'
                    : idx === questionCount - 1
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;