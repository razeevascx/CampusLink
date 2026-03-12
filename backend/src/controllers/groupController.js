const pool = require('../config/db');

const getGroups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sg.*,
        u.full_name AS creator_name,
        COUNT(gm.id) AS member_count,
        EXISTS (
          SELECT 1 FROM group_members WHERE group_id = sg.id AND user_id = $1
        ) AS is_member
      FROM study_groups sg
      JOIN users u ON sg.creator_id = u.id
      LEFT JOIN group_members gm ON gm.group_id = sg.id
      GROUP BY sg.id, u.full_name
      ORDER BY sg.created_at DESC
    `, [req.user.id]);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch study groups' });
  }
};

const createGroup = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const course = String(req.body.course || '').trim();
  const description = String(req.body.description || '').trim();
  const maxMembers = Number(req.body.max_members) || 10;

  if (!name || !course) {
    return res.status(400).json({ message: 'Group name and course are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO study_groups (name, course, description, creator_id, max_members) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, course, description, req.user.id, maxMembers]
    );

    const groupId = result.rows[0].id;

    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [groupId, req.user.id]
    );

    return res.status(201).json({ message: 'Study group created', groupId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create study group' });
  }
};

const joinGroup = async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!groupId) return res.status(400).json({ message: 'Invalid group ID' });

  try {
    const group = await pool.query(
      `SELECT sg.*, COUNT(gm.id) AS member_count
       FROM study_groups sg
       LEFT JOIN group_members gm ON gm.group_id = sg.id
       WHERE sg.id = $1
       GROUP BY sg.id`,
      [groupId]
    );

    if (group.rows.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const g = group.rows[0];
    if (Number(g.member_count) >= g.max_members) {
      return res.status(400).json({ message: 'Group is full' });
    }

    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, req.user.id]
    );

    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [g.creator_id, 'group_join', `${req.user.full_name} joined your study group "${g.name}"`]
    );

    return res.json({ message: 'Joined group successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to join group' });
  }
};

const leaveGroup = async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!groupId) return res.status(400).json({ message: 'Invalid group ID' });

  try {
    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, req.user.id]
    );
    return res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to leave group' });
  }
};

const deleteGroup = async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (!groupId) return res.status(400).json({ message: 'Invalid group ID' });

  try {
    const group = await pool.query('SELECT id FROM study_groups WHERE id = $1 AND creator_id = $2', [groupId, req.user.id]);
    if (group.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });
    }

    await pool.query('DELETE FROM study_groups WHERE id = $1', [groupId]);
    return res.json({ message: 'Group deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete group' });
  }
};

module.exports = { getGroups, createGroup, joinGroup, leaveGroup, deleteGroup };
