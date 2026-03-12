const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const buddyRoutes = require('./routes/buddyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const groupRoutes = require('./routes/groupRoutes');
const seed = require('./seed');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 8000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'CampusLink API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/buddies', buddyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/groups', groupRoutes);

if (IS_PRODUCTION) {
  const buildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(buildPath));
  app.use((_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} (${IS_PRODUCTION ? 'production' : 'development'})`);
  await seed();
});
