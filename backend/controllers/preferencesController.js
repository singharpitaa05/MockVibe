// PREFERNCES CONTROLLER

import UserPreference from '../models/UserPreference.js';

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
const getPreferences = async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.user._id });

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await UserPreference.create({
        user: req.user._id,
      });
    }

    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.user._id });

    if (!preferences) {
      // Create new preferences if they don't exist
      preferences = await UserPreference.create({
        user: req.user._id,
        ...req.body,
      });
    } else {
      // Update existing preferences
      // Deep merge for nested objects
      if (req.body.defaultInterviewSettings) {
        preferences.defaultInterviewSettings = {
          ...preferences.defaultInterviewSettings,
          ...req.body.defaultInterviewSettings,
        };
      }

      if (req.body.notifications) {
        if (req.body.notifications.email) {
          preferences.notifications.email = {
            ...preferences.notifications.email,
            ...req.body.notifications.email,
          };
        }
        if (req.body.notifications.inApp) {
          preferences.notifications.inApp = {
            ...preferences.notifications.inApp,
            ...req.body.notifications.inApp,
          };
        }
      }

      if (req.body.practiceMode) {
        preferences.practiceMode = {
          ...preferences.practiceMode,
          ...req.body.practiceMode,
        };
      }

      if (req.body.accessibility) {
        preferences.accessibility = {
          ...preferences.accessibility,
          ...req.body.accessibility,
        };
      }

      // Update simple fields
      if (req.body.theme) preferences.theme = req.body.theme;
      if (req.body.language) preferences.language = req.body.language;
      if (req.body.timezone) preferences.timezone = req.body.timezone;

      await preferences.save();
    }

    res.json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset preferences to default
// @route   POST /api/preferences/reset
// @access  Private
const resetPreferences = async (req, res) => {
  try {
    // Delete existing preferences
    await UserPreference.findOneAndDelete({ user: req.user._id });

    // Create new default preferences
    const preferences = await UserPreference.create({
      user: req.user._id,
    });

    res.json({ message: 'Preferences reset to default', preferences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getPreferences, resetPreferences, updatePreferences };
