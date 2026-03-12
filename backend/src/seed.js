const pool = require('./config/db');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      course VARCHAR(120) NOT NULL,
      interests VARCHAR(255) NOT NULL,
      bio TEXT,
      role VARCHAR(10) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      event_date DATE NOT NULL,
      event_time TIME NOT NULL,
      location VARCHAR(150) NOT NULL,
      category VARCHAR(80) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS buddy_requests (
      id SERIAL PRIMARY KEY,
      sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (sender_id, receiver_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_events (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, event_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_rsvps (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, event_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS study_groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      course VARCHAR(120) NOT NULL,
      description TEXT,
      creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      max_members INT NOT NULL DEFAULT 10,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (group_id, user_id)
    )
  `);
};

const seed = async () => {
  try {
    await createTables();

    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) > 0) return;

    await pool.query(`
      INSERT INTO users (full_name, email, password, course, interests, bio, role) VALUES
        ('Aisha Khan', 'aisha@student.university.edu', '$2b$10$f4U.HJaehSQgWSgzQj/e7.gJdNpYG84GKYpk3P/PyljE8hgKRGkWe', 'Computer Science', 'AI, Web Development, Hackathons', 'Second-year CS student who enjoys group study sessions.', 'student'),
        ('Liam Patel', 'liam@student.university.edu', '$2b$10$L2RVL4IiWGbpri6wIwq./ezkHp6KfuPcO5FNj8EzAFJE2UaFOUt96', 'Business Analytics', 'Data Visualization, Entrepreneurship', 'Looking for peers to prepare for analytics modules.', 'student'),
        ('Campus Admin', 'admin@campuslink.edu', '$2b$10$oLiqbIrXIymDvYwBkArMp.DWbqr8Nn0QM6rkA9GP9lWwSDYSRIy7C', 'Administration', 'Campus Management', 'Platform administrator account.', 'admin')
      ON CONFLICT (email) DO NOTHING
    `);

    await pool.query(`
      INSERT INTO events (title, event_date, event_time, location, category, description) VALUES
        ('Exam Prep Sprint', '2026-04-05', '16:00:00', 'Library Seminar Hall', 'Academic', 'Collaborative revision workshop for final exam preparation.'),
        ('Campus Innovation Meetup', '2026-04-10', '18:30:00', 'Engineering Block A', 'Tech', 'Meet students building startups and tech side-projects.'),
        ('Wellness and Study Balance Talk', '2026-04-14', '13:00:00', 'Student Center Room 12', 'Wellbeing', 'Tips on balancing academic pressure and mental wellness.'),
        ('Career Networking Evening', '2026-04-20', '17:30:00', 'Main Auditorium', 'Career', 'Connect with alumni and local employers for internships.')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO buddy_requests (sender_id, receiver_id, status)
      SELECT u1.id, u2.id, 'pending'
      FROM users u1, users u2
      WHERE u1.email = 'aisha@student.university.edu'
        AND u2.email = 'liam@student.university.edu'
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO saved_events (user_id, event_id)
      SELECT u.id, e.id FROM users u, events e
      WHERE u.email = 'aisha@student.university.edu' AND e.title IN ('Exam Prep Sprint', 'Campus Innovation Meetup')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO saved_events (user_id, event_id)
      SELECT u.id, e.id FROM users u, events e
      WHERE u.email = 'liam@student.university.edu' AND e.title = 'Wellness and Study Balance Talk'
      ON CONFLICT DO NOTHING
    `);

    console.log('Database seeded with demo data');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seed;
