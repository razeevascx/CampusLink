const pool = require('../config/db');

const sendBuddyRequest = async (req, res) => {
  const receiverId = Number(req.body.receiverId);

  if (!receiverId) {
    return res.status(400).json({ message: 'Valid receiver ID is required' });
  }

  if (receiverId === req.user.id) {
    return res.status(400).json({ message: 'You cannot send a request to yourself' });
  }

  try {
    const receiver = await pool.query('SELECT id FROM users WHERE id = $1 AND role = $2', [receiverId, 'student']);

    if (receiver.rows.length === 0) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const existing = await pool.query(
      `SELECT id FROM buddy_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [req.user.id, receiverId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Request already sent' });
    }

    await pool.query(
      'INSERT INTO buddy_requests (sender_id, receiver_id, status) VALUES ($1, $2, $3)',
      [req.user.id, receiverId, 'pending']
    );

    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [receiverId, 'buddy_request', `${req.user.full_name} sent you a study buddy request`]
    );

    return res.status(201).json({ message: 'Buddy request sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to send request' });
  }
};

const getBuddyRequests = async (req, res) => {
  try {
    const incoming = await pool.query(
      `SELECT br.id, br.status, br.created_at, u.id AS sender_id, u.full_name AS sender_name, u.course, u.interests
       FROM buddy_requests br
       JOIN users u ON br.sender_id = u.id
       WHERE br.receiver_id = $1
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );

    const outgoing = await pool.query(
      `SELECT br.id, br.status, br.created_at, u.id AS receiver_id, u.full_name AS receiver_name, u.course, u.interests
       FROM buddy_requests br
       JOIN users u ON br.receiver_id = u.id
       WHERE br.sender_id = $1
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );

    return res.json({ incoming: incoming.rows, outgoing: outgoing.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch buddy requests' });
  }
};

const updateBuddyRequestStatus = async (req, res) => {
  const requestId = Number(req.params.requestId);
  const status = String(req.body.status || '').trim().toLowerCase();

  if (!requestId || !['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid request ID or status' });
  }

  try {
    const requests = await pool.query(
      'SELECT id FROM buddy_requests WHERE id = $1 AND receiver_id = $2',
      [requestId, req.user.id]
    );

    if (requests.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await pool.query('UPDATE buddy_requests SET status = $1 WHERE id = $2', [status, requestId]);

    const reqData = await pool.query(
      'SELECT sender_id FROM buddy_requests WHERE id = $1',
      [requestId]
    );
    if (reqData.rows.length > 0) {
      const verb = status === 'accepted' ? 'accepted' : 'declined';
      await pool.query(
        'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
        [reqData.rows[0].sender_id, 'buddy_response', `${req.user.full_name} ${verb} your study buddy request`]
      );
    }

    return res.json({ message: `Request ${status}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update request status' });
  }
};

module.exports = {
  sendBuddyRequest,
  getBuddyRequests,
  updateBuddyRequestStatus,
};
