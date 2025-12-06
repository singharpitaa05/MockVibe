// INTERVIEW CUSTOMIZATION PAGE

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const InterviewCustomization = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionStats, setQuestionStats] = useState(null);

  const [settings, setSettings] = useState({
    jobRole: user?.preferredRoles?.[0] || 'Software Developer',
    interviewType: 'Technical',
    interviewMode: 'Text',
    difficulty: user?.skillLevel || 'Intermediate',
    interviewerStyle: 'Neutral',
    questionCount: 5,
  });

  // Predefined options
  const jobRoles = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'Product Manager',
    'DevOps Engineer',
    'QA Engineer',
    'Mobile Developer',
  ];

  const interviewTypes = [
    { value: 'Technical', description: 'Coding & technical theory questions' },
    { value: 'Behavioral', description: 'Situational & behavioral questions' },
    { value: 'HR', description: 'General HR and career-focused questions' },
    { value: 'System Design', description: 'Architecture & design questions' },
    { value: 'Mixed', description: 'Combination of all types' },
  ];

  const interviewModes = [
    { value: 'Text', icon: '💬', description: 'Type your answers' },
    { value: 'Voice', icon: '🎤', description: 'Speak your answers' },
    { value: 'Video', icon: '📹', description: 'Video interview with analysis' },
  ];

  const difficulties = [
    { value: 'Beginner', description: 'Entry-level questions' },
    { value: 'Intermediate', description: 'Mid-level questions' },
    { value: 'Expert', description: 'Advanced level questions' },
  ];

  const interviewerStyles = [
    { value: 'Friendly', icon: '😊', description: 'Encouraging and supportive' },
    { value: 'Neutral', icon: '😐', description: 'Professional and balanced' },
    { value: 'Strict', icon: '😤', description: 'Direct and challenging' },
  ];

  useEffect(() => {
    fetchQuestionStats();
  }, []);

  const fetchQuestionStats = async () => {
    try {
      const { data } = await api.get('/questions/stats/overview');
      setQuestionStats(data);
    } catch (error) {
      console.error('Failed to load question stats:', error);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleStartInterview = async () => {
    setError('');
    setLoading(true);

    try {
      // Create interview session
      const { data } = await api.post('/interviews', settings);

      // Navigate to interview page with session ID
      navigate(`/interview/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Customize Your Interview</h1>
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
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Question Bank Stats */}
        {questionStats && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📚</span>
              <h3 className="font-semibold text-blue-900">Question Bank</h3>
            </div>
            <p className="text-blue-800">
              We have <span className="font-bold">{questionStats.totalQuestions}</span> questions
              ready for your practice across multiple categories and difficulty levels.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Job Role Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              1. Select Target Job Role
            </label>
            <select
              value={settings.jobRole}
              onChange={(e) => handleChange('jobRole', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Interview Type */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              2. Choose Interview Type
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {interviewTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleChange('interviewType', type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    settings.interviewType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{type.value}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interview Mode */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              3. Select Interview Mode
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {interviewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleChange('interviewMode', mode.value)}
                  className={`p-6 rounded-lg border-2 text-center transition ${
                    settings.interviewMode === mode.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{mode.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{mode.value}</div>
                  <div className="text-sm text-gray-600">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              4. Set Difficulty Level
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => handleChange('difficulty', diff.value)}
                  className={`p-4 rounded-lg border-2 text-center transition ${
                    settings.difficulty === diff.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">{diff.value}</div>
                  <div className="text-sm text-gray-600">{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interviewer Style */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              5. Choose Interviewer Style
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {interviewerStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleChange('interviewerStyle', style.value)}
                  className={`p-6 rounded-lg border-2 text-center transition ${
                    settings.interviewerStyle === style.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{style.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{style.value}</div>
                  <div className="text-sm text-gray-600">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              6. Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="10"
                value={settings.questionCount}
                onChange={(e) => handleChange('questionCount', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                {settings.questionCount}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Quick (3 questions)</span>
              <span>Standard (5-7 questions)</span>
              <span>Comprehensive (10 questions)</span>
            </div>
          </div>

          {/* Summary & Start */}
          <div className="bg-linear-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Interview Summary</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-blue-100 text-sm mb-1">Job Role</div>
                <div className="font-semibold">{settings.jobRole}</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Interview Type</div>
                <div className="font-semibold">{settings.interviewType}</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Mode</div>
                <div className="font-semibold">{settings.interviewMode}</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Difficulty</div>
                <div className="font-semibold">{settings.difficulty}</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Style</div>
                <div className="font-semibold">{settings.interviewerStyle}</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Questions</div>
                <div className="font-semibold">{settings.questionCount}</div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting Interview...' : '🚀 Start Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCustomization;