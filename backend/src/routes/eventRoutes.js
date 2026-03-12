const express = require('express');
const {
  getEvents,
  saveEvent,
  getSavedEvents,
  removeSavedEvent,
  rsvpEvent,
  unrsvpEvent,
  getEventsWithRsvp,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getEventsWithRsvp);
router.get('/saved', protect, getSavedEvents);
router.post('/save/:eventId', protect, saveEvent);
router.delete('/save/:eventId', protect, removeSavedEvent);
router.post('/rsvp/:eventId', protect, rsvpEvent);
router.delete('/rsvp/:eventId', protect, unrsvpEvent);

module.exports = router;
