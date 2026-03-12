USE campuslink_db;

INSERT INTO users (full_name, email, password, course, interests, bio, role)
VALUES
  ('Aisha Khan', 'aisha@student.university.edu', '$2b$10$f4U.HJaehSQgWSgzQj/e7.gJdNpYG84GKYpk3P/PyljE8hgKRGkWe', 'Computer Science', 'AI, Web Development, Hackathons', 'Second-year CS student who enjoys group study sessions.', 'student'),
  ('Liam Patel', 'liam@student.university.edu', '$2b$10$L2RVL4IiWGbpri6wIwq./ezkHp6KfuPcO5FNj8EzAFJE2UaFOUt96', 'Business Analytics', 'Data Visualization, Entrepreneurship', 'Looking for peers to prepare for analytics modules.', 'student'),
  ('Campus Admin', 'admin@campuslink.edu', '$2b$10$oLiqbIrXIymDvYwBkArMp.DWbqr8Nn0QM6rkA9GP9lWwSDYSRIy7C', 'Administration', 'Campus Management', 'Platform administrator account.', 'admin');

INSERT INTO events (title, event_date, event_time, location, category, description)
VALUES
  ('Exam Prep Sprint', '2026-04-05', '16:00:00', 'Library Seminar Hall', 'Academic', 'Collaborative revision workshop for final exam preparation.'),
  ('Campus Innovation Meetup', '2026-04-10', '18:30:00', 'Engineering Block A', 'Tech', 'Meet students building startups and tech side-projects.'),
  ('Wellness and Study Balance Talk', '2026-04-14', '13:00:00', 'Student Center Room 12', 'Wellbeing', 'Tips on balancing academic pressure and mental wellness.'),
  ('Career Networking Evening', '2026-04-20', '17:30:00', 'Main Auditorium', 'Career', 'Connect with alumni and local employers for internships.');

INSERT INTO buddy_requests (sender_id, receiver_id, status)
VALUES
  (1, 2, 'pending');

INSERT INTO saved_events (user_id, event_id)
VALUES
  (1, 1),
  (1, 2),
  (2, 3);
