const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models/userSchema');
const otpService = require('../services/otpService');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// In-memory storage for refresh tokens (consider using Redis in production)
let refreshTokens = [];

// Helper function to generate tokens
const generateTokens = (user) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

// Helper function to set auth cookies
const setAuthCookies = (res, token, refreshToken) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 3600000, // 1 hour
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 604800000, // 7 days
  });
};

// Google Sign-In/Sign-Up
exports.googleAuth = async (req, res) => {
  const { googleToken, name, avatarUrl, bio, location } = req.body;

  try {
    if (!googleToken) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const googleEmail = payload.email;
    const googleId = payload.sub;

    // Find or create user
    let user = await User.findOne({ where: { email: googleEmail } });

    if (!user) {
      // Create new user
      user = await User.create({
        email: googleEmail,
        username: payload.name || googleEmail.split('@')[0],
        name: name || payload.name,
        avatarUrl: avatarUrl || payload.picture,
        google_oauth_id: googleId,
        bio,
        location,
        role: 'user',
      });
    } else {
      // Update existing user with new optional fields if provided
      await user.update({
        name: name || user.name || payload.name,
        avatarUrl: avatarUrl || user.avatarUrl || payload.picture,
        bio: bio || user.bio,
        location: location || user.location,
        google_oauth_id: googleId,
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    refreshTokens.push(refreshToken);

    // Set cookies
    setAuthCookies(res, token, refreshToken);

    return res.status(200).json({ 
      message: 'Authentication successful', 
      userId: user.id, 
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
      }
    });
  } catch (err) {
    console.error("Google OAuth Error:", err);
    return res.status(400).json({ error: 'Invalid Google token' });
  }
};

// Wallet Authentication
exports.walletAuth = async (req, res) => {
  const { walletAddress, name, avatarUrl, bio, location } = req.body;

  try {
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Find or create user
    let user = await User.findOne({ where: { walletAddress } });

    if (!user) {
      // Create new user
      user = await User.create({
        email: `wallet-${walletAddress.slice(0, 8)}@suilens.local`,
        username: `user-${walletAddress.slice(0, 8)}`,
        walletAddress,
        name: name || `Sui User`,
        avatarUrl: avatarUrl || '/placeholder-user.jpg',
        bio,
        location,
        role: 'user',
      });
    } else {
      // Update existing user
      await user.update({
        name: name || user.name,
        avatarUrl: avatarUrl || user.avatarUrl,
        bio: bio || user.bio,
        location: location || user.location,
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    refreshTokens.push(refreshToken);

    // Set cookies
    setAuthCookies(res, token, refreshToken);

    return res.status(200).json({ 
      message: 'Wallet authentication successful', 
      userId: user.id, 
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        walletAddress: user.walletAddress,
        bio: user.bio,
        location: user.location,
      }
    });
  } catch (err) {
    console.error("Wallet Auth Error:", err);
    return res.status(500).json({ error: 'Something went wrong during authentication' });
  }
};

// Send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await otpService.sendOTP(email);

    return res.status(200).json({ 
      message: 'OTP sent successfully',
      email: email 
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and authenticate
exports.verifyOTP = async (req, res) => {
  const { email, otp, name, avatarUrl, bio, location } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Verify OTP
    const otpResult = await otpService.verifyOTP(email, otp);
    
    if (!otpResult.success) {
      return res.status(400).json({ error: otpResult.message });
    }

    // Find or create user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        username: name || email.split('@')[0],
        name: name || email.split('@')[0],
        avatarUrl: avatarUrl || '/placeholder-user.jpg',
        bio,
        location,
        role: 'user',
      });
    } else {
      // Update existing user
      await user.update({
        name: name || user.name,
        avatarUrl: avatarUrl || user.avatarUrl,
        bio: bio || user.bio,
        location: location || user.location,
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    refreshTokens.push(refreshToken);

    // Set cookies
    setAuthCookies(res, token, refreshToken);

    return res.status(200).json({ 
      message: 'OTP verification successful', 
      userId: user.id, 
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Refresh Token endpoint
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: newAccessToken });
  } catch (err) {
    console.error('Error verifying refresh token:', err);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

// Check Authentication endpoint
exports.checkAuth = async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findByPk(req.user.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      return res.status(200).json({
        message: 'User is authenticated',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
          walletAddress: user.walletAddress,
          bio: user.bio,
          location: user.location,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Check auth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

// Logout endpoint
exports.logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  }
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully' });