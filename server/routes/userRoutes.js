const express = require('express');
const Joi = require('joi');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authenticateToken');
const { protectedRoute } = require('../controllers/userController');

// Joi schema for validating the 'domain' parameter
const domainValidationSchema = Joi.object({
  domain: Joi.string().required().min(1).max(255).message('Domain is required and must be a valid string'),
});

// Validation schemas for user update endpoints
const emailUpdateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

const usernameUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must only contain alpha-numeric characters',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required',
  }),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().max(255).allow(null, '').optional(),
  avatarUrl: Joi.string().uri().allow(null, '').optional(),
  bio: Joi.string().max(1000).allow(null, '').optional(),
  location: Joi.string().max(255).allow(null, '').optional(),
});

// Route to fetch credentials for a specific domain (protected by JWT)
router.post('/get-credentials', verifyToken, async (req, res, next) => {
  try {
    // Validate the domain input
    const { error } = domainValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // If validation passes, call the controller method
    await userController.getCredentials(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Protected route - Only accessible if logged in
router.get('/dashboard', verifyToken, protectedRoute);

// Endpoint to update email
router.put('/update-email', verifyToken, async (req, res, next) => {
  try {
    const { error } = emailUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    await userController.updateEmail(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Endpoint to update username
router.put('/update-username', verifyToken, async (req, res, next) => {
  try {
    const { error } = usernameUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    await userController.updateUsername(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Endpoint to update profile info (name, avatarUrl, bio, location)
router.put('/update-profile', verifyToken, async (req, res, next) => {
  try {
    const { error } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    await userController.updateProfile(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
