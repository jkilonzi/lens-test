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

module.exports = router;
