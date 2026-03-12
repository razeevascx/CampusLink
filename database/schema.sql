CREATE DATABASE IF NOT EXISTS campuslink_db;
USE campuslink_db;

DROP TABLE IF EXISTS saved_events;
DROP TABLE IF EXISTS buddy_requests;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  course VARCHAR(120) NOT NULL,
  interests VARCHAR(255) NOT NULL,
  bio TEXT,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buddy_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_buddy_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_buddy_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_buddy_pair UNIQUE (sender_id, receiver_id)
);

CREATE TABLE saved_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT uq_saved_event UNIQUE (user_id, event_id)
);
