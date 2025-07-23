const { Event } = require('../models/eventSchema');
const { User } = require('../models/userSchema');
const Joi = require('joi');

// Joi schema for event validation
const eventValidationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(2000).optional(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endDate: Joi.date().iso().optional(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  location: Joi.string().max(255).optional(),
  category: Joi.string().max(100).optional(),
  capacity: Joi.number().integer().min(1).optional(),
  ticketPrice: Joi.number().precision(2).min(0).optional(),
  isFree: Joi.boolean().default(true),
  requiresApproval: Joi.boolean().default(false),
  isPrivate: Joi.boolean().default(false),
  timezone: Joi.string().max(50).default('UTC'),
  poapName: Joi.string().max(255).optional(),
  poapDescription: Joi.string().max(1000).optional(),
  poapImage: Joi.string().uri().optional(),
  qrCode: Joi.string().optional(),
  eventUrl: Joi.string().uri().optional(),
  suiEventId: Joi.string().optional(),
  creatorWalletAddress: Joi.string().optional(),
});
// Controller to create a new event
exports.createEvent = async (req, res, next) => {
  const userId = req.user.userId; // From JWT token

  try {
    // Validate request body
    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(detail => detail.message) 
      });
    }

    // Check if user exists and has wallet connected (for non-wallet auth users)
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure wallet is connected for event creation
    if (!user.walletAddress && !value.creatorWalletAddress) {
      return res.status(400).json({ 
        error: 'Wallet connection required for event creation' 
      });
    }

    // Create event with validated data
    const eventData = {
      ...value,
      userId,
      creatorWalletAddress: value.creatorWalletAddress || user.walletAddress,
    };

    const newEvent = await Event.create(eventData);

    // Fetch the created event with user details
    const eventWithCreator = await Event.findByPk(newEvent.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'username', 'avatarUrl', 'walletAddress']
      }]
    });

    return res.status(201).json({ 
      message: 'Event created successfully', 
      event: eventWithCreator 
    });
  } catch (err) {
    console.error('Event creation error:', err);
    next(err);
  }
};

// Controller to get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause = {};
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    if (search) {
      whereClause[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    const events = await Event.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'username', 'avatarUrl', 'walletAddress']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      events: events.rows,
      pagination: {
        total: events.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(events.count / limit)
      }
    });
  } catch (err) {
    console.error('Get events error:', err);
    next(err);
  }
};

// Controller to get a specific event
exports.getEventById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const event = await Event.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'username', 'avatarUrl', 'walletAddress']
      }]
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (err) {
    console.error('Get event by ID error:', err);
    next(err);
  }
};

// Controller to get user's events
exports.getUserEvents = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const events = await Event.findAll({
      where: { userId },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'username', 'avatarUrl', 'walletAddress']
      }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ events });
  } catch (err) {
    console.error('Get user events error:', err);
    next(err);
  }
};

// Controller to update an event
exports.updateEvent = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Validate request body
    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(detail => detail.message) 
      });
    }

    // Find event and check ownership
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    // Update event
    await event.update(value);

    // Fetch updated event with creator details
    const updatedEvent = await Event.findByPk(id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'username', 'avatarUrl', 'walletAddress']
      }]
    });

    return res.status(200).json({ 
      message: 'Event updated successfully', 
      event: updatedEvent 
    });
  } catch (err) {
    console.error('Update event error:', err);
    next(err);
  }
};

// Controller to delete an event
exports.deleteEvent = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Find event and check ownership
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    // Delete event
    await event.destroy();

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    next(err);
  }
};
module.exports = {
  createEvent: exports.createEvent,
  getAllEvents: exports.getAllEvents,
  getEventById: exports.getEventById,
  getUserEvents: exports.getUserEvents,
  updateEvent: exports.updateEvent,
  deleteEvent: exports.deleteEvent,
};
