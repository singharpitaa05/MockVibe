// INTERVIEW HISTORY PAGE

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';

const InterviewHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, in-progress
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviewHistory();
  }, [filter]);

  const fetchInterviewHistory = async () => {
    try {
      setLoading(true);
      const statusParam = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/interviews${statusParam}`);
      setSessions(data.sessions);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load interview history');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading interview history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Interviews
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'in-progress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
          </div>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first mock interview to see your history here
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/interview-result/${session._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {session.jobRole}
                      </h3>
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

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>📅 {formatDate(session.createdAt)}</span>
                      {session.duration && (
                        <span>⏱️ {formatDuration(session.duration)}</span>
                      )}
                      <span className="capitalize">
                        Status: <span className="font-medium">{session.status}</span>
                      </span>
                    </div>
                  </div>

                  {session.status === 'completed' && session.overallScore !== undefined && (
                    <div className="text-right">
                      <div
                        className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(
                          session.overallScore
                        )}`}
                      >
                        {session.overallScore}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Overall Score</div>
                    </div>
                  )}
                </div>

                {session.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Detailed Report →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;