import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get('/statistics/dashboard');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">MockVibe</h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={() => navigate('/interview-history')}
                className="text-gray-700 hover:text-blue-600"
              >
                History
              </button>
              <button
                onClick={() => navigate('/practice-mode')}
                className="text-gray-700 hover:text-blue-600"
              >
                Practice
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="text-gray-700 hover:text-blue-600"
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => navigate('/profile-setup')}
                className="text-gray-700 hover:text-blue-600"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-linear-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-blue-100">Ready to practice your interview skills?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => navigate('/interview-customization')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Interview</h3>
            <p className="text-gray-600">Begin a new mock interview session</p>
          </button>

          <button 
            onClick={() => navigate('/practice-mode')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Practice Mode</h3>
            <p className="text-gray-600">Practice coding problems at your own pace</p>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Progress</h3>
            {stats && stats.totalInterviews > 0 && (
              <button
                onClick={() => navigate('/interview-history')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading statistics...</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats?.totalInterviews || 0}
                </div>
                <div className="text-sm text-gray-600">Interviews Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats?.averageScore ? `${stats.averageScore}%` : '-'}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats?.totalInterviews || 0}
                </div>
                <div className="text-sm text-gray-600">Practice Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats?.totalPracticeTime ? `${stats.totalPracticeTime}h` : '0h'}
                </div>
                <div className="text-sm text-gray-600">Total Practice Time</div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Trend Chart */}
        {stats && stats.performanceTrend && stats.performanceTrend.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {stats.performanceTrend.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition" 
                       style={{ height: `${(point.score / 100) * 100}%`, minHeight: '20px' }}
                       title={`Session ${point.sessionNumber}: ${point.score}%`}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{point.sessionNumber}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 mt-4">Recent Interview Sessions</div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weak Areas */}
          {stats && stats.weakAreas && stats.weakAreas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📉 Areas to Improve</h3>
              <div className="space-y-3">
                {stats.weakAreas.map((area, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{area.area}</span>
                    <span className="text-orange-600 font-semibold">{area.averageScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Interviews */}
          {stats && stats.recentInterviews && stats.recentInterviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Recent Interviews</h3>
              <div className="space-y-3">
                {stats.recentInterviews.map((interview) => (
                  <div 
                    key={interview._id}
                    onClick={() => navigate(`/interview-result/${interview._id}`)}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{interview.jobRole}</div>
                      <div className="text-xs text-gray-500">{interview.interviewType}</div>
                    </div>
                    <div className="text-blue-600 font-bold">{interview.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interview Types Breakdown */}
        {stats && stats.interviewsByType && Object.keys(stats.interviewsByType).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Interview Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.interviewsByType).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Summary</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Skill Level:</span>
              <span className="ml-2 text-gray-900">{user?.skillLevel || 'Not set'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Preferred Roles:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {user?.preferredRoles && user.preferredRoles.length > 0 ? (
                  user.preferredRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No roles selected</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Skills:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills added</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;