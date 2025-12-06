// PROFILE SETUP PAGE

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const ProfileSetup = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    skillLevel: user?.skillLevel || '',
    preferredRoles: user?.preferredRoles || [],
    skills: user?.skills || [],
    interviewGoals: user?.interviewGoals || '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Predefined options
  const skillLevels = ['Fresher', 'Intermediate', 'Senior'];
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role selection (multiple)
  const toggleRole = (role) => {
    setFormData((prev) => {
      const roles = prev.preferredRoles.includes(role)
        ? prev.preferredRoles.filter((r) => r !== role)
        : [...prev.preferredRoles, role];
      return { ...prev, preferredRoles: roles };
    });
  };

  // Add skill to list
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  // Remove skill from list
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.skillLevel) {
      setError('Please select your skill level');
      return;
    }

    if (formData.preferredRoles.length === 0) {
      setError('Please select at least one preferred role');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    setLoading(true);

    try {
      // Send profile data to backend
      const { data } = await api.put('/users/profile', {
        ...formData,
        isProfileComplete: true,
      });

      // Update user context
      updateUser(data);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-8">
            Tell us about yourself to get personalized interview experiences
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, skillLevel: level }))}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                      formData.skillLevel === level
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Job Roles * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {jobRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`py-2 px-4 rounded-lg border-2 text-sm font-medium transition ${
                      formData.preferredRoles.includes(role)
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * (Add your technical skills)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, Python, React"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Goals */}
            <div>
              <label htmlFor="interviewGoals" className="block text-sm font-medium text-gray-700 mb-2">
                Interview Goals (Optional)
              </label>
              <textarea
                id="interviewGoals"
                name="interviewGoals"
                value={formData.interviewGoals}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What do you want to achieve with mock interviews? e.g., Improve coding speed, practice behavioral questions, etc."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;