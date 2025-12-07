// SETTING PAGE

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('interview');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data } = await api.get('/preferences');
      setPreferences(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load preferences');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await api.put('/preferences', preferences);

      setSuccess('Settings saved successfully!');
      setSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm('Are you sure you want to reset all settings to default?');
    if (!confirmed) return;

    try {
      setSaving(true);
      const { data } = await api.post('/preferences/reset');
      setPreferences(data.preferences);
      setSuccess('Settings reset to default!');
      setSaving(false);
    } catch (err) {
      setError('Failed to reset settings');
      setSaving(false);
    }
  };

  const updatePreference = (path, value) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = path.split('.');
      let current = newPrefs;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'interview', label: 'Interview Defaults', icon: '🎯' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'practice', label: 'Practice Mode', icon: '💪' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Settings ⚙️</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label.replace(/^.\s/, '')}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 space-y-6">
            {/* Interview Defaults Tab */}
            {activeTab === 'interview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Interview Default Settings</h2>
                
                <div className="space-y-6">
                  {/* Job Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Job Role
                    </label>
                    <input
                      type="text"
                      value={preferences?.defaultInterviewSettings?.jobRole || ''}
                      onChange={(e) => updatePreference('defaultInterviewSettings.jobRole', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Software Developer"
                    />
                  </div>

                  {/* Interview Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Interview Type
                    </label>
                    <select
                      value={preferences?.defaultInterviewSettings?.interviewType || 'Technical'}
                      onChange={(e) => updatePreference('defaultInterviewSettings.interviewType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="HR">HR</option>
                      <option value="System Design">System Design</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>

                  {/* Interview Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Interview Mode
                    </label>
                    <select
                      value={preferences?.defaultInterviewSettings?.interviewMode || 'Text'}
                      onChange={(e) => updatePreference('defaultInterviewSettings.interviewMode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Text">Text</option>
                      <option value="Voice">Voice</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Difficulty
                    </label>
                    <select
                      value={preferences?.defaultInterviewSettings?.difficulty || 'Intermediate'}
                      onChange={(e) => updatePreference('defaultInterviewSettings.difficulty', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  {/* Interviewer Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Interviewer Style
                    </label>
                    <select
                      value={preferences?.defaultInterviewSettings?.interviewerStyle || 'Neutral'}
                      onChange={(e) => updatePreference('defaultInterviewSettings.interviewerStyle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Friendly">Friendly</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Strict">Strict</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Question Count: {preferences?.defaultInterviewSettings?.questionCount || 5}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={preferences?.defaultInterviewSettings?.questionCount || 5}
                      onChange={(e) => updatePreference('defaultInterviewSettings.questionCount', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>3 (Quick)</span>
                      <span>10 (Comprehensive)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.email?.interviewReminders || false}
                          onChange={(e) => updatePreference('notifications.email.interviewReminders', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Interview reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.email?.feedbackAvailable || false}
                          onChange={(e) => updatePreference('notifications.email.feedbackAvailable', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Feedback available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.email?.weeklyProgress || false}
                          onChange={(e) => updatePreference('notifications.email.weeklyProgress', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Weekly progress reports</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.email?.newFeatures || false}
                          onChange={(e) => updatePreference('notifications.email.newFeatures', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">New features and updates</span>
                      </label>
                    </div>
                  </div>

                  {/* In-App Notifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 In-App Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.inApp?.interviewReminders || false}
                          onChange={(e) => updatePreference('notifications.inApp.interviewReminders', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Interview reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences?.notifications?.inApp?.feedbackAvailable || false}
                          onChange={(e) => updatePreference('notifications.inApp.feedbackAvailable', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">Feedback available</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Mode Tab */}
            {activeTab === 'practice' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Mode Settings</h2>
                
                <div className="space-y-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences?.practiceMode?.autoShowAnswers || false}
                      onChange={(e) => updatePreference('practiceMode.autoShowAnswers', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Automatically show answers after submission</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences?.practiceMode?.timerEnabled || false}
                      onChange={(e) => updatePreference('practiceMode.timerEnabled', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Enable timer in practice mode</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Practice Category
                    </label>
                    <select
                      value={preferences?.practiceMode?.defaultCategory || 'Coding'}
                      onChange={(e) => updatePreference('practiceMode.defaultCategory', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Coding">Coding</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Technical Theory">Technical Theory</option>
                      <option value="HR">HR</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Practice Difficulty
                    </label>
                    <select
                      value={preferences?.practiceMode?.defaultDifficulty || 'Intermediate'}
                      onChange={(e) => updatePreference('practiceMode.defaultDifficulty', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={preferences?.theme || 'light'}
                      onChange={(e) => updatePreference('theme', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">☀️ Light</option>
                      <option value="dark">🌙 Dark</option>
                      <option value="auto">🔄 Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={preferences?.accessibility?.fontSize || 'medium'}
                      onChange={(e) => updatePreference('accessibility.fontSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences?.accessibility?.highContrast || false}
                      onChange={(e) => updatePreference('accessibility.highContrast', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">High contrast mode</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences?.accessibility?.reduceMotion || false}
                      onChange={(e) => updatePreference('accessibility.reduceMotion', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Reduce motion</span>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
              >
                Reset to Default
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;