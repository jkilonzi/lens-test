const db = require('../config/db');
const { decrypt } = require('../utils/encryption');
const { User } = require('../models/userSchema');

// Fetch credentials for a specific domain (protected by JWT)
exports.getCredentials = async (req, res, next) => {
  const { domain } = req.body;

  try {
    const credentialsResult = await db.query('SELECT * FROM app_data.passwords WHERE site_name = $1', [domain]);
    if (credentialsResult.rows.length === 0) {
      return res.status(404).json({ error: 'No credentials found for this site' });
    }

    const credentials = credentialsResult.rows[0];

    return res.json({
      siteName: credentials.site_name,
      username: credentials.username,
      password: decrypt(credentials.encrypted_password),
    });
  } catch (err) {
    next(err);
  }
};

// Protected Route for user (Example)
// userController.js
exports.protectedRoute = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized access: User is not logged in.' });
  }

  res.json({ message: 'This is a protected route', user: req.user });
};

// Update email
exports.updateEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    // Check if email is already in use by another user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    // Update email
    await User.update({ email }, { where: { id: userId } });

    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Update username
exports.updateUsername = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    // Check if username is already in use by another user
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ error: 'Username is already in use' });
    }

    // Update username
    await User.update({ username }, { where: { id: userId } });

    res.json({ message: 'Username updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Update profile info (name, avatarUrl, bio, location)
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, avatarUrl, bio, location } = req.body;

    // Update profile fields
    await User.update(
      { name, avatarUrl, bio, location },
      { where: { id: userId } }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCredentials: exports.getCredentials,
  protectedRoute: exports.protectedRoute,
  updateEmail: exports.updateEmail,
  updateUsername: exports.updateUsername,
  updateProfile: exports.updateProfile,
};
