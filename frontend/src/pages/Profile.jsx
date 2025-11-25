import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setExperience(user.experience || '');
      setResumeLink(user.resumeLink || user.resume || '');
      setSkills(Array.isArray(user.skills) ? user.skills : (user.skills ? user.skills.split(',').map(s=>s.trim()).filter(Boolean) : []));
    }
  }, [user]);

  const addSkill = (skill) => {
    const s = skill.trim();
    if (!s) return;
    if (skills.includes(s)) return;
    setSkills(prev => [...prev, s]);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    } else if (e.key === 'Backspace' && !skillInput) {
      // remove last skill when input empty and backspace pressed
      setSkills(prev => prev.slice(0, -1));
    }
  };

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const profileData = { name, bio, experience, resumeLink, skills };
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block mb-2 font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          rows={4}
        />

        <label className="block mb-2 font-medium">Experience</label>
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 3 years as Software Engineer"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-medium">Resume Link</label>
        <input
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
          placeholder="https://..."
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-medium">Skills</label>
        <div className="mb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((s, idx) => (
              <span key={s + idx} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                <span className="mr-2">{s}</span>
                <button
                  onClick={() => removeSkill(idx)}
                  className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  aria-label={`Remove ${s}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter or comma"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {message && (
            <span className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {message.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;