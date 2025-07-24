const express = require('express');
const Joi = require('joi');
const router = express.Router();
const verifyToken = require('../middleware/authenticateToken');
const eventsController = require('../controllers/eventsController');
const otpController = require('../controllers/otpController');

// Joi schema for event creation validation
const eventCreationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).optional(),
  timezone: Joi.string().optional(),
  location: Joi.string().max(255).optional(),
  // Add other event fields as needed
});

// Joi schema for event registration validation
const eventRegistrationSchema = Joi.object({
  eventId: Joi.string().required(),
  address: Joi.string().required(),
  name: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().email().required(),
  x: Joi.string().optional(),
});

// POST /create - Create a new event (protected route)
router.post('/create', verifyToken, async (req, res, next) => {
  try {
    // Validate request body
    const { error } = eventCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Call controller to create event
    await eventsController.createEvent(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /register - Register for an event (protected route)
router.post('/register', verifyToken, async (req, res, next) => {
  try {
    // Validate request body
    const { error } = eventRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Call controller to register for event
    await eventsController.registerForEvent(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /otp/send - Send OTP for signup/login
router.post('/otp/send', async (req, res, next) => {
  try {
    await otpController.sendOTP(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /otp/verify - Verify OTP for signup/login
router.post('/otp/verify', async (req, res, next) => {
  try {
    await otpController.verifyOTP(req, res, next);
  } catch (err) {
    next(err);
  }
});

const authController = require('../controllers/authController');

router.post('/google', async (req, res, next) => {
  try {
    await authController.googleAuth(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.post('/wallet', async (req, res, next) => {
  try {
    await authController.walletAuth(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
