const Event = require('../models/event');
const QRCode = require('qrcode');
const { sendEmailWithQRCode } = require('../services/emailService');
const db = require('../config/db'); // Added import for db

// Controller to create a new event with Sequelize ORM
exports.createEvent = async (req, res, next) => {
  const { title, description, date, time, timezone, location } = req.body;
  const baseUrl = 'http://localhost:3000/events';

  try {
    // Use defaults for optional fields
    const eventTime = time || '00:00:00';
    const eventTimezone = timezone || 'UTC';

    // Create event using Sequelize, include user_id from authenticated user
    const newEvent = await Event.create({
      user_id: req.user.userId,
      title,
      description: description || null,
      date,
      time: eventTime,
      timezone: eventTimezone,
      location: location || null,
    });

    const eventLink = `${baseUrl}/${newEvent.id}`;

    return res.status(201).json({ message: 'Event created successfully', event: newEvent, eventLink });
  } catch (err) {
    console.error('Error creating event:', err);
    next(err);
  }
};

// Controller to register for an event
exports.registerForEvent = async (req, res, next) => {
  const { eventId, address, name, mobile, email, x } = req.body;

  try {
    const insertQuery = `
      INSERT INTO registrations (event_id, address, name, mobile, email, x, registered_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, event_id, address, name, mobile, email, x, registered_at
    `;

    const result = await db.query(insertQuery, [eventId, address, name, mobile, email, x || null]);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to register for event' });
    }

    const newRegistration = result.rows;

    // Generate unique check-in URL
    const checkInUrl = `http://localhost:3000/events/${eventId}/checkin/${newRegistration.id}`;

    // Generate QR code image as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl);

    // Send email with QR code
    await sendEmailWithQRCode(email, name, qrCodeDataUrl, checkInUrl);

    return res.status(201).json({ message: 'Registered for event successfully', registration: newRegistration });
  } catch (err) {
    next(err);
  }
};

// Controller to get events created by authenticated user
exports.getUserEvents = async (req, res, next) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

  try {
    const events = await Event.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
    });

    return res.status(200).json({ events });
  } catch (err) {
    console.error('Error in getUserEvents:', err);
    console.error('Stack trace:', err.stack);
    next(err);
  }
};
