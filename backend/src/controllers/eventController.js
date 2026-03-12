const pool = require('../config/db');

const getEvents = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC, event_time ASC');
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
};

const saveEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);

  if (!eventId) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM saved_events WHERE user_id = $1 AND event_id = $2',
      [req.user.id, eventId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Event already saved' });
    }

    await pool.query('INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2)', [req.user.id, eventId]);

    return res.status(201).json({ message: 'Event saved successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save event' });
  }
};

const getSavedEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, se.created_at AS saved_at
       FROM saved_events se
       JOIN events e ON se.event_id = e.id
       WHERE se.user_id = $1
       ORDER BY se.created_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch saved events' });
  }
};

const removeSavedEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);

  if (!eventId) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    await pool.query('DELETE FROM saved_events WHERE user_id = $1 AND event_id = $2', [req.user.id, eventId]);

    return res.json({ message: 'Saved event removed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to remove saved event' });
  }
};

const rsvpEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);
  if (!eventId) return res.status(400).json({ message: 'Invalid event ID' });

  try {
    const event = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
    if (event.rows.length === 0) return res.status(404).json({ message: 'Event not found' });

    await pool.query(
      'INSERT INTO event_rsvps (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, eventId]
    );
    return res.status(201).json({ message: 'RSVP confirmed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to RSVP' });
  }
};

const unrsvpEvent = async (req, res) => {
  const eventId = Number(req.params.eventId);
  if (!eventId) return res.status(400).json({ message: 'Invalid event ID' });

  try {
    await pool.query('DELETE FROM event_rsvps WHERE user_id = $1 AND event_id = $2', [req.user.id, eventId]);
    return res.json({ message: 'RSVP cancelled' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to cancel RSVP' });
  }
};

const getEventsWithRsvp = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.*,
        COUNT(er.id) AS rsvp_count,
        EXISTS (
          SELECT 1 FROM event_rsvps WHERE event_id = e.id AND user_id = $1
        ) AS rsvped
      FROM events e
      LEFT JOIN event_rsvps er ON er.event_id = e.id
      GROUP BY e.id
      ORDER BY e.event_date ASC, e.event_time ASC
    `, [req.user.id]);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
};

module.exports = {
  getEvents,
  saveEvent,
  getSavedEvents,
  removeSavedEvent,
  rsvpEvent,
  unrsvpEvent,
  getEventsWithRsvp,
};
