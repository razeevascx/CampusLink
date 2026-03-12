const pool = require('../config/db');
const { validateEventInput } = require('../middleware/validation');

const addEvent = async (req, res) => {
  const validation = validateEventInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { title, eventDate, eventTime, location, category, description } = validation.data;

  try {
    const result = await pool.query(
      `INSERT INTO events (title, event_date, event_time, location, category, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, eventDate, eventTime, location, category, description]
    );

    return res.status(201).json({ message: 'Event created', eventId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create event' });
  }
};

const editEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);
  const validation = validateEventInput(req.body);

  if (!eventId) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { title, eventDate, eventTime, location, category, description } = validation.data;

  try {
    await pool.query(
      `UPDATE events SET title = $1, event_date = $2, event_time = $3, location = $4, category = $5, description = $6
       WHERE id = $7`,
      [title, eventDate, eventTime, location, category, description, eventId]
    );

    return res.json({ message: 'Event updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);

  if (!eventId) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
    return res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete event' });
  }
};

module.exports = { addEvent, editEvent, deleteEvent };
