const express = require('express');
const { addEvent, editEvent, deleteEvent } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/events', protect, adminOnly, addEvent);
router.put('/events/:eventId', protect, adminOnly, editEvent);
router.delete('/events/:eventId', protect, adminOnly, deleteEvent);

module.exports = router;
