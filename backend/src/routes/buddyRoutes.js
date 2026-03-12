const express = require('express');
const {
  sendBuddyRequest,
  getBuddyRequests,
  updateBuddyRequestStatus,
} = require('../controllers/buddyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/request', protect, sendBuddyRequest);
router.get('/requests', protect, getBuddyRequests);
router.put('/requests/:requestId', protect, updateBuddyRequestStatus);

module.exports = router;
