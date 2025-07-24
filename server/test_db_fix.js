const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function testEventCreation() {
  try {
    console.log('Testing direct database event creation...');

    const eventId = uuidv4();
    const title = 'Test Event';
    const description = 'This is a test event';
    const date = '2025-07-24';
    const time = '14:30:00';
    const timezone = 'UTC';
    const location = 'Test Location';

    const insertQuery = `
      INSERT INTO events (id, title, description, date, time, timezone, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, date, time, timezone, location
    `;

    console.log('Executing query with parameters:', [eventId, title, description, date, time, timezone, location]);

    const result = await db.query(insertQuery, [
      eventId,
      title,
      description,
      date,
      time,
      timezone,
      location
    ]);

    if (result.rows.length > 0) {
      console.log('✅ SUCCESS! Event created successfully:', result.rows[0]);
    } else {
      console.log('❌ FAILED: No rows returned');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the database connection
    await db.close();
    process.exit(0);
  }
}

testEventCreation();