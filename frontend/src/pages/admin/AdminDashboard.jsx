// ADMIN DASHBOARD PAGE

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  }, [user, navigate]);

  const fetchAdminStats = async () => {
    try {
      const { data } = await api.get('/admin/dashboard-stats');
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin statistics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Admin Dashboard 👑</h1>
              <p className="text-purple-800 mt-1">Platform management and analytics</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
              >
                Manage Users
              </button>
              <button
                onClick={() => navigate('/admin/questions')}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
              >
                Manage Questions
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              >
                User View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                +{stats?.users?.newThisMonth || 0} this month
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.users?.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="mt-2 text-xs text-gray-500">
              {stats?.users?.active || 0} active
            </div>
          </div>

          {/* Total Interviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <span className="text-sm text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded">
                +{stats?.interviews?.thisMonth || 0} this month
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.interviews?.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Interviews</div>
            <div className="mt-2 text-xs text-gray-500">
              {stats?.interviews?.completed || 0} completed
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.interviews?.averageScore || 0}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
            <div className="mt-2 text-xs text-gray-500">
              Across all interviews
            </div>
          </div>

          {/* Total Questions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📚</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.questions?.total || 0}
            </div>
            <div className="text-sm text-gray-600">Active Questions</div>
            <div className="mt-2 text-xs text-gray-500">
              In question bank
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Activity (Last 7 Days)</h3>
            {stats?.analytics?.dailyActivity && stats.analytics.dailyActivity.length > 0 ? (
              <div className="h-64 flex items-end justify-between gap-2">
                {stats.analytics.dailyActivity.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-purple-600 rounded-t-lg hover:bg-purple-700 transition"
                      style={{
                        height: `${(day.count / Math.max(...stats.analytics.dailyActivity.map(d => d.count))) * 100}%`,
                        minHeight: '20px'
                      }}
                      title={`${day._id}: ${day.count} interviews`}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(day._id).getDate()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No activity data available
              </div>
            )}
          </div>

          {/* Interview Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Types</h3>
            {stats?.analytics?.interviewsByType && stats.analytics.interviewsByType.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.interviewsByType.map((type, index) => {
                  const total = stats.analytics.interviewsByType.reduce((sum, t) => sum + t.count, 0);
                  const percentage = ((type.count / total) * 100).toFixed(1);
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{type._id}</span>
                        <span className="text-sm text-gray-600">{type.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No interview type data available
              </div>
            )}
          </div>
        </div>

        {/* Top Users */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Users</h3>
            {stats?.analytics?.topUsers && stats.analytics.topUsers.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.topUsers.map((topUser, index) => (
                  <div
                    key={topUser.userId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/admin/users/${topUser.userId}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{topUser.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{topUser.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{topUser.interviewCount}</div>
                      <div className="text-xs text-gray-500">Avg: {topUser.avgScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No user data available</div>
            )}
          </div>

          {/* Popular Questions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Popular Questions</h3>
            {stats?.analytics?.popularQuestions && stats.analytics.popularQuestions.length > 0 ? (
              <div className="space-y-3">
                {stats.analytics.popularQuestions.slice(0, 5).map((q, index) => (
                  <div key={q._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {q.questionText}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {q.category}
                          </span>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-bold text-purple-600">{q.timesUsed}</div>
                        <div className="text-xs text-gray-500">uses</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No question data available</div>
            )}
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Question Bank Overview</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* By Category */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">By Category</h4>
              {stats?.questions?.byCategory && stats.questions.byCategory.length > 0 ? (
                <div className="space-y-2">
                  {stats.questions.byCategory.map((cat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{cat._id}</span>
                      <span className="text-sm font-semibold text-gray-900">{cat.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No category data</div>
              )}
            </div>

            {/* By Difficulty */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">By Difficulty</h4>
              {stats?.questions?.byDifficulty && stats.questions.byDifficulty.length > 0 ? (
                <div className="space-y-2">
                  {stats.questions.byDifficulty.map((diff, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{diff._id}</span>
                      <span className="text-sm font-semibold text-gray-900">{diff.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No difficulty data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;