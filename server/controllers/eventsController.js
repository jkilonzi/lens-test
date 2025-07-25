const Event = require('../models/event'); // ✅ correct Sequelize model
const QRCode = require('qrcode');
const { sendEmailWithQRCode } = require('../services/emailService');
const db = require('../config/db');

// Controller to create a new event
exports.createEvent = async (req, res, next) => {
  const { title, description, date, time, timezone, location } = req.body;
  const baseUrl = 'http://localhost:3000/events';

  try {
    const eventTime = time || '00:00:00';
    const eventTimezone = timezone || 'UTC';

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

    return res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
      eventLink
    });
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

    const newRegistration = result.rows[0];

    const checkInUrl = `http://localhost:3000/events/${eventId}/checkin/${newRegistration.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl);

    await sendEmailWithQRCode(email, name, qrCodeDataUrl, checkInUrl);

    return res.status(201).json({
      message: 'Registered for event successfully',
      registration: newRegistration
    });
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
    next(err);
  }
};

// ✅ Updated Controller to get event by ID
exports.getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId); // consistent with Sequelize setup

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
