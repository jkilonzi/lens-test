const express = require('express');
const Joi = require('joi');
const router = express.Router();
const verifyToken = require('../middleware/authenticateToken');
const eventsController = require('../controllers/eventsController');

// Joi schema for event creation validation
const eventCreationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  date: Joi.date().iso().required(),
  location: Joi.string().max(255).optional(),
  // Add other event fields as needed
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

module.exports = router;
