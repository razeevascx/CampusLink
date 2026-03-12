const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validation');

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  const validation = validateRegisterInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { fullName, email, password, course, interests, bio } = validation.data;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, course, interests, bio, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'student') RETURNING id`,
      [fullName, email, hashedPassword, course, interests, bio]
    );

    const user = {
      id: result.rows[0].id,
      full_name: fullName,
      email,
      course,
      interests,
      bio,
      role: 'student',
    };

    const token = createToken(user);

    return res.status(201).json({ message: 'Registration successful', token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const validation = validateLoginInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { email, password } = validation.data;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        course: user.course,
        interests: user.interests,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, course, interests, bio, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching user' });
  }
};

module.exports = { register, login, getCurrentUser };
