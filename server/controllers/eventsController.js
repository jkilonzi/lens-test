const db = require('../config/db');

// Controller to create a new event
exports.createEvent = async (req, res, next) => {
  const { title, description, date, location } = req.body;
  const userId = req.user.id; // Assuming user ID is in the decoded token

  try {
    const insertQuery = `
      INSERT INTO events (title, description, date, location, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, date, location, created_by
    `;

    const result = await db.query(insertQuery, [title, description || null, date, location || null, userId]);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to create event' });
    }

    const newEvent = result.rows[0];
    return res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent: exports.createEvent,
};
