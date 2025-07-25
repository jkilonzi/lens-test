const express = require('express');
const Joi = require('joi');
const router = express.Router();
const verifyToken = require('../middleware/authenticateToken');
const eventsController = require('../controllers/eventsController');
const { csrfProtection } = require('../middleware/csrfMiddleware');

// Joi schema for event creation validation
const eventCreationSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional().allow('', null),
  image: Joi.string().uri().optional().allow('', null),
  date: Joi.date().iso().required(),
  time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .allow('', null),
  location: Joi.string().max(255).optional().allow('', null),
  category: Joi.string().max(100).optional().allow('', null),
  capacity: Joi.number().integer().min(0).optional().allow(null),
  ticketPrice: Joi.number().precision(2).min(0).optional().allow(null),
  isFree: Joi.boolean().default(true),
  requiresApproval: Joi.boolean().default(false),
  isPrivate: Joi.boolean().default(false),
  timezone: Joi.string().required(),
  poap_name: Joi.string().max(255).optional().allow('', null),
  poap_desc: Joi.string().max(1000).optional().allow('', null),
  poap_image: Joi.string().uri().optional().allow('', null),
  status: Joi.string().valid('published', 'draft', 'archived').default('published'),
  communityId: Joi.number().integer().optional().allow(null),
  userId: Joi.number().integer().optional().allow(null),
  created_at: Joi.date().optional()
});

// Joi schema for event registration validation
const eventRegistrationSchema = Joi.object({
  eventId: Joi.string().required(),
  address: Joi.string().optional().allow('', null), // Make optional if not enforced
  name: Joi.string().required(),
  mobile: Joi.string().required(),
  email: Joi.string().email().required(),
  x: Joi.string().optional().allow('', null)
});

// POST /create - Create a new event (protected route with CSRF)
router.post('/create', verifyToken, csrfProtection, async (req, res, next) => {
  try {
    // Validate request body and strip unknown fields
    const { error, value } = eventCreationSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      console.log("Validation Error:", error.details);
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    // Use the validated and stripped data
    req.body = value;
    await eventsController.createEvent(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /register - Register for an event (protected route with CSRF)
router.post('/register', verifyToken, csrfProtection, async (req, res, next) => {
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

// GET /user-events - Get events created by authenticated user
router.get('/user-events', verifyToken, async (req, res, next) => {
  try {
    await eventsController.getUserEvents(req, res, next);
  } catch (err) {
    next(err);
  }
});

// GET /:id - Get a single event by ID
router.get('/:id', verifyToken, async (req, res, next) => {

  try {
    await eventsController.getEventById(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;