const axios = require('axios');

async function testEventCreation() {
  try {
    const eventData = {
      title: 'Test Event',
      description: 'This is a test event',
      date: '2025-07-24',
      time: '14:30:00',
      timezone: 'UTC',
      location: 'Test Location'
    };

    console.log('Testing event creation with data:', eventData);

    const response = await axios.post('http://localhost:3000/events', eventData, {
      headers: {
        'Content-Type': 'application/json',
        // Add any required headers here
      }
    });

    console.log('Success! Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
  }
}

testEventCreation();