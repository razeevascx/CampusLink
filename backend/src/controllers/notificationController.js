const pool = require('../config/db');

const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  const notifId = Number(req.params.id);
  if (!notifId) return res.status(400).json({ message: 'Invalid notification ID' });

  try {
    await pool.query(
      'UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2',
      [notifId, req.user.id]
    );
    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update notification' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET read = TRUE WHERE user_id = $1', [req.user.id]);
    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update notifications' });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
