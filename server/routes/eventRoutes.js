const express = require('express');
const Joi = require('joi');
const router = express.Router();
const verifyToken = require('../middleware/authenticateToken');
const eventsController = require('../controllers/eventsController');

// POST /create - Create a new event (protected route)
router.post('/create', verifyToken, eventsController.createEvent);

// GET /events - Get all events (public route with optional auth for personalization)
router.get('/', eventsController.getAllEvents);

// GET /events/:id - Get specific event (public route)
router.get('/:id', eventsController.getEventById);

// GET /my-events - Get user's events (protected route)
router.get('/user/my-events', verifyToken, eventsController.getUserEvents);

// PUT /events/:id - Update event (protected route)
router.put('/:id', verifyToken, eventsController.updateEvent);

// DELETE /events/:id - Delete event (protected route)
router.delete('/:id', verifyToken, eventsController.deleteEvent);

module.exports = router;
