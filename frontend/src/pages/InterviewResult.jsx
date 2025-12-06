// INTERVIEW RESULT PAGE

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/interviews/${id}`);
      setSession(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview details');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading interview results...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error || 'Interview not found'}</p>
          <Link
            to="/interview-history"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Interview Results</h1>
            <Link
              to="/interview-history"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.jobRole}</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {session.interviewType}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {session.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                  {session.interviewMode}
                </span>
              </div>
            </div>

            {session.overallScore !== undefined && (
              <div className="text-center">
                <div
                  className={`text-5xl font-bold px-6 py-4 rounded-lg ${getScoreColor(
                    session.overallScore
                  )}`}
                >
                  {session.overallScore}%
                </div>
                <div className="text-sm text-gray-600 mt-2">Overall Score</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="font-semibold">{formatDate(session.createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Duration</div>
              <div className="font-semibold">
                {session.duration ? formatDuration(session.duration) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Questions</div>
              <div className="font-semibold">{session.questions?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        {session.analysis && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h3>

            {/* Content Analysis */}
            {session.analysis.contentAnalysis && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Content Quality</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(session.analysis.contentAnalysis).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-lg font-bold text-blue-600">{value}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speech Analysis */}
            {session.analysis.speechAnalysis && session.interviewMode !== 'Text' && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Communication</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Filler Words</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.speechAnalysis.fillerWords || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Speaking Speed</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.speechAnalysis.speakingSpeed || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Clarity</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.speechAnalysis.clarity || 0}/100
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Pauses</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.speechAnalysis.pauses || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Analysis */}
            {session.analysis.videoAnalysis && session.interviewMode === 'Video' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Non-Verbal Communication</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Eye Contact</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.videoAnalysis.eyeContact || 0}/100
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Confidence Score</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {session.analysis.videoAnalysis.confidenceScore || 0}/100
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Facial Expressions</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {session.analysis.videoAnalysis.facialExpressions || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">Posture</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {session.analysis.videoAnalysis.posture || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Strengths and Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          {session.strengths && session.strengths.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-green-600 mb-4">💪 Strengths</h3>
              <ul className="space-y-2">
                {session.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {session.weaknesses && session.weaknesses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-orange-600 mb-4">📈 Areas to Improve</h3>
              <ul className="space-y-2">
                {session.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-600 mr-2">→</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {session.recommendations && session.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-600 mb-4">💡 Recommendations</h3>
            <ul className="space-y-3">
              {session.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 text-lg">•</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions and Answers */}
        {session.questions && session.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Questions & Answers</h3>
            <div className="space-y-6">
              {session.questions.map((qa, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start mb-3">
                    <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{qa.question}</h4>
                      {qa.answer && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <div className="text-sm font-medium text-gray-600 mb-1">Your Answer:</div>
                          <p className="text-gray-800">{qa.answer}</p>
                        </div>
                      )}
                      {qa.evaluation && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">Score:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(qa.evaluation.score)}`}>
                              {qa.evaluation.score}%
                            </span>
                          </div>
                          {qa.evaluation.feedback && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Feedback:</span> {qa.evaluation.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => navigate('/interview-customization')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Start Another Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;