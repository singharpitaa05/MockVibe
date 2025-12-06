// PRACTICE MODE PAGE

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const PracticeMode = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('Coding');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const categories = ['Coding', 'Behavioral', 'Technical Theory', 'HR', 'System Design'];
  const difficulties = ['Beginner', 'Intermediate', 'Expert'];

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.post('/questions/random', {
        category: [selectedCategory],
        difficulty: selectedDifficulty,
        count: 10,
      });

      if (data && data.length > 0) {
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setAnswer('');
        setShowAnswer(false);
        setTimer(0);
        setIsTimerRunning(true);
      } else {
        setError('No questions found. Please try different settings.');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
      setLoading(false);
    }
  };

  const handleStartPractice = () => {
    loadQuestions();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setShowAnswer(false);
      setTimer(0);
    } else {
      // End of practice
      setIsTimerRunning(false);
      alert('Practice session completed! Great job! 🎉');
      setQuestions([]);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Practice Mode 💪</h1>
              <p className="text-gray-600 mt-1">Practice at your own pace without evaluation</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Configuration (Before Starting) */}
        {questions.length === 0 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About Practice Mode</h3>
              <p className="text-blue-800 text-sm">
                Practice mode lets you work through questions at your own pace. You can view sample answers,
                skip questions, and take as much time as you need. No evaluation or scoring - just practice! 📚
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Category Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Category
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      selectedCategory === category
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Difficulty
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`p-4 rounded-lg border-2 text-center transition ${
                      selectedDifficulty === difficulty
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{difficulty}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartPractice}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading Questions...' : '🚀 Start Practice Session'}
            </button>
          </div>
        )}

        {/* Practice Session (After Starting) */}
        {questions.length > 0 && currentQuestion && (
          <div className="space-y-6">
            {/* Progress & Timer */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ⏱️ {formatTime(timer)}
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {isTimerRunning ? '⏸️ Pause' : '▶️ Resume'}
                  </button>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {currentQuestion.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {currentQuestion.questionText}
                  </h2>

                  {/* Coding Details */}
                  {currentQuestion.category === 'Coding' && currentQuestion.codingDetails && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Language: {currentQuestion.codingDetails.language}
                      </div>
                      {currentQuestion.codingDetails.constraints && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Constraints:</strong> {currentQuestion.codingDetails.constraints}
                        </div>
                      )}
                      {currentQuestion.codingDetails.testCases && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Test Cases:</div>
                          {currentQuestion.codingDetails.testCases
                            .filter(tc => !tc.isHidden)
                            .map((tc, idx) => (
                              <div key={idx} className="text-sm bg-white p-2 rounded mb-1">
                                <span className="text-gray-600">Input:</span> <code>{tc.input}</code>
                                {' → '}
                                <span className="text-gray-600">Output:</span> <code>{tc.expectedOutput}</code>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hints */}
                  {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                    <details className="mb-4">
                      <summary className="cursor-pointer text-blue-600 font-medium hover:text-blue-700">
                        💡 Show Hints ({currentQuestion.hints.length})
                      </summary>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700">
                        {currentQuestion.hints.map((hint, idx) => (
                          <li key={idx}>{hint}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>

              {/* Answer Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer (Practice):
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your answer here..."
                />
              </div>

              {/* Sample Answer */}
              {showAnswer && currentQuestion.sampleAnswer && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Sample Answer:</h4>
                  <p className="text-gray-800 whitespace-pre-wrap">{currentQuestion.sampleAnswer}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={handleShowAnswer}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {showAnswer ? '🙈 Hide Answer' : '👁️ Show Answer'}
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSkipQuestion}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    Skip →
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Practice'}
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-2">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-2 rounded-full ${
                      idx <= currentQuestionIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeMode;