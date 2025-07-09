const express = require('express');
const router = express.Router();
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { 
  googleAuth, 
  walletAuth, 
  sendOTP, 
  verifyOTP, 
  logout, 
  refreshToken, 
  checkAuth 
} = require('../controllers/authController');
const verifyToken = require('../middleware/authenticateToken');

// Rate Limiting for authentication attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per IP per window
  message: {
    error: 'Too many authentication attempts. Please try again later.',
  },
});

// Rate Limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit to 3 OTP requests per IP per window
  message: {
    error: 'Too many OTP requests. Please try again later.',
  },
});

// Joi Validation Schemas
const googleAuthSchema = Joi.object({
  googleToken: Joi.string().required().messages({
    'any.required': 'Google token is required',
    'string.base': 'Invalid Google token format',
  }),
  name: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
});

const walletAuthSchema = Joi.object({
  walletAddress: Joi.string().required().messages({
    'any.required': 'Wallet address is required',
    'string.base': 'Invalid wallet address format',
  }),
  name: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
});

const sendOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
    'any.required': 'OTP is required',
  }),
  name: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
});

// Route for Google authentication
router.post('/google', authLimiter, async (req, res, next) => {
  try {
    const { error } = googleAuthSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    await googleAuth(req, res);
  } catch (err) {
    next(err);
  }
});

// Route for wallet authentication
router.post('/wallet', authLimiter, async (req, res, next) => {
  try {
    const { error } = walletAuthSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    await walletAuth(req, res);
  } catch (err) {
    next(err);
  }
});

// Route for sending OTP
router.post('/otp/send', otpLimiter, async (req, res, next) => {
  try {
    const { error } = sendOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    await sendOTP(req, res);
  } catch (err) {
    next(err);
  }
});

// Route for verifying OTP
router.post('/otp/verify', authLimiter, async (req, res, next) => {
  try {
    const { error } = verifyOTPSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }

    await verifyOTP(req, res);
  } catch (err) {
    next(err);
  }
});

// Route for refreshing the access token
router.post('/refresh-token', async (req, res, next) => {
  try {
    await refreshToken(req, res);
  } catch (err) {
    next(err);
  }
});

// Route for checking user authentication
router.get('/check-auth', verifyToken, checkAuth);

// Route for user logout
router.post('/logout', verifyToken, logout);

module.exports = router;