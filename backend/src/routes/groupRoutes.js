const express = require('express');
const { getGroups, createGroup, joinGroup, leaveGroup, deleteGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getGroups);
router.post('/', protect, createGroup);
router.post('/:groupId/join', protect, joinGroup);
router.delete('/:groupId/leave', protect, leaveGroup);
router.delete('/:groupId', protect, deleteGroup);

module.exports = router;
