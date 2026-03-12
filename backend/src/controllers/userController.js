const pool = require('../config/db');
const { sanitizeText } = require('../middleware/validation');

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, course, interests, bio, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  const fullName = sanitizeText(req.body.fullName);
  const course = sanitizeText(req.body.course);
  const interests = sanitizeText(req.body.interests);
  const bio = sanitizeText(req.body.bio || '');

  if (!fullName || !course || !interests) {
    return res.status(400).json({ message: 'Full name, course, and interests are required' });
  }

  try {
    await pool.query(
      `UPDATE users SET full_name = $1, course = $2, interests = $3, bio = $4 WHERE id = $5`,
      [fullName, course, interests, bio, req.user.id]
    );

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

const searchStudents = async (req, res) => {
  const course = sanitizeText(req.query.course || '');
  const interest = sanitizeText(req.query.interest || '');

  try {
    let query = `
      SELECT id, full_name, email, course, interests, bio
      FROM users
      WHERE role = 'student' AND id != $1
    `;
    const values = [req.user.id];
    let paramIndex = 2;

    if (course) {
      query += ` AND course ILIKE $${paramIndex}`;
      values.push(`%${course}%`);
      paramIndex++;
    }

    if (interest) {
      query += ` AND interests ILIKE $${paramIndex}`;
      values.push(`%${interest}%`);
      paramIndex++;
    }

    query += ' ORDER BY full_name ASC';

    const result = await pool.query(query, values);

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to search students' });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const savedEvents = await pool.query(
      `SELECT e.*
       FROM saved_events se
       JOIN events e ON se.event_id = e.id
       WHERE se.user_id = $1
       ORDER BY e.event_date ASC`,
      [req.user.id]
    );

    const incomingRequests = await pool.query(
      `SELECT br.id, br.status, br.created_at, u.full_name AS sender_name, u.course, u.interests
       FROM buddy_requests br
       JOIN users u ON br.sender_id = u.id
       WHERE br.receiver_id = $1
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );

    const outgoingRequests = await pool.query(
      `SELECT br.id, br.status, br.created_at, u.full_name AS receiver_name, u.course, u.interests
       FROM buddy_requests br
       JOIN users u ON br.receiver_id = u.id
       WHERE br.sender_id = $1
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );

    return res.json({
      savedEvents: savedEvents.rows,
      incomingRequests: incomingRequests.rows,
      outgoingRequests: outgoingRequests.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  searchStudents,
  getDashboardSummary,
};
