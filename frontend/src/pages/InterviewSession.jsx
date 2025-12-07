import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdvancedVideoInterview from '../components/AdvancedVideoInterview';
import VideoInterview from '../components/VideoInterview';
import VoiceInterview from '../components/VoiceInterview';
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
  const [useAdvancedVideo, setUseAdvancedVideo] = useState(false);

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

      // Auto-enable advanced video for Video mode
      if (sessionData.interviewMode === 'Video') {
        setUseAdvancedVideo(true);
      }

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

  const handleSubmitAnswer = async (answerData = null) => {
    const finalAnswer = answerData?.transcript || answer;
    
    if (!finalAnswer.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    setSubmitting(true);
    setShowEvaluation(false);
    setEvaluation(null);

    try {
      let evaluationData;

      // Use advanced video endpoint if visual analysis is provided
      if (answerData?.visualAnalysis && useAdvancedVideo) {
        const { data } = await api.post(`/advanced-video/${id}/process-video`, {
          transcript: answerData.transcript,
          question: currentQuestion,
          duration: answerData.duration,
          visualAnalysis: answerData.visualAnalysis,
        });
        evaluationData = data;
      }
      // Use voice/video endpoint if transcript is provided
      else if (answerData?.transcript && (session.interviewMode === 'Voice' || session.interviewMode === 'Video')) {
        const { data } = await api.post(`/voice-interview/${id}/process-voice`, {
          transcript: answerData.transcript,
          question: currentQuestion,
          duration: answerData.duration,
        });
        evaluationData = data;
      } 
      // Use regular text endpoint
      else {
        const { data } = await api.post(`/ai-interview/${id}/submit-answer`, {
          question: currentQuestion,
          answer: finalAnswer,
          questionType: session.interviewType,
        });
        evaluationData = data;
      }

      setEvaluation(evaluationData.evaluation);
      
      // Show speech analysis if available
      if (evaluationData.speechAnalysis) {
        setEvaluation(prev => ({
          ...prev,
          speechAnalysis: evaluationData.speechAnalysis,
        }));
      }

      // Show visual analysis if available
      if (evaluationData.visualAnalysis) {
        setEvaluation(prev => ({
          ...prev,
          visualAnalysis: evaluationData.visualAnalysis,
        }));
      }
      
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
      if (session && Array.isArray(session.questions) && session.questions.length === 0) {
        await api.post(`/interviews/${id}/complete`);
      } else {
        await api.post(`/ai-interview/${id}/complete`);
      }

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
  const isVoiceMode = session?.interviewMode === 'Voice';
  const isVideoMode = session?.interviewMode === 'Video';
  const isTextMode = session?.interviewMode === 'Text';

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
                {useAdvancedVideo && ' • AI-Enhanced'}
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

        {/* Evaluation Feedback */}
        {showEvaluation && evaluation && (
          <div className="mb-6 bg-linear-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
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

            {/* Speech Analysis */}
            {evaluation.speechAnalysis && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🎤 Speech Analysis:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Filler Words:</span>
                    <span className="ml-2 font-semibold">{evaluation.speechAnalysis.fillerWords}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Speaking Speed:</span>
                    <span className="ml-2 font-semibold">{evaluation.speechAnalysis.speakingSpeed}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Clarity:</span>
                    <span className="ml-2 font-semibold">{evaluation.speechAnalysis.clarity}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <span className="ml-2 font-semibold">{evaluation.speechAnalysis.confidenceScore}/100</span>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Analysis (Advanced Video) */}
            {evaluation.visualAnalysis && (
              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">👁️ Visual Analysis:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Eye Contact:</span>
                    <span className="ml-2 font-semibold">{evaluation.visualAnalysis.eyeContactScore}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Posture:</span>
                    <span className="ml-2 font-semibold">{evaluation.visualAnalysis.posture}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expression:</span>
                    <span className="ml-2 font-semibold">{evaluation.visualAnalysis.facialExpression}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Visual Confidence:</span>
                    <span className="ml-2 font-semibold">{evaluation.visualAnalysis.overallConfidence}/100</span>
                  </div>
                </div>
              </div>
            )}

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

        {/* Question Display */}
        {!showEvaluation && currentQuestion && (
          <>
            {/* Question Header Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start gap-4">
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
                    {(isVoiceMode || isVideoMode) && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        {isVoiceMode ? '🎤 Voice' : '📹 Video'}
                      </span>
                    )}
                    {useAdvancedVideo && (
                      <span className="px-3 py-1 bg-linear-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm rounded-full">
                        ✨ AI-Enhanced
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentQuestion}
                  </h2>
                </div>
              </div>
            </div>

            {/* Voice Mode */}
            {isVoiceMode && (
              <VoiceInterview
                currentQuestion={currentQuestion}
                onSubmitAnswer={handleSubmitAnswer}
                isSubmitting={submitting}
              />
            )}

            {/* Video Mode - Advanced or Basic */}
            {isVideoMode && (
              <>
                {useAdvancedVideo ? (
                  <AdvancedVideoInterview
                    currentQuestion={currentQuestion}
                    onSubmitAnswer={handleSubmitAnswer}
                    isSubmitting={submitting}
                  />
                ) : (
                  <VideoInterview
                    currentQuestion={currentQuestion}
                    onSubmitAnswer={handleSubmitAnswer}
                    isSubmitting={submitting}
                  />
                )}
              </>
            )}

            {/* Text Mode (Original) */}
            {isTextMode && (
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
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
                      onClick={() => handleSubmitAnswer()}
                      disabled={submitting || !answer.trim()}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? '⏳ Evaluating...' : 'Submit Answer →'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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