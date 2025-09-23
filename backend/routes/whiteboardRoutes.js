const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createWhiteboard, getOrJoinWhiteboard, listMyWhiteboards } = require('../controllers/whiteboardController');

// Create new whiteboard
router.post('/', protect, createWhiteboard);

// List my whiteboards, filtered by questionId
router.get('/', protect, listMyWhiteboards);

// Join/fetch existing whiteboard by id
router.get('/:id', protect, getOrJoinWhiteboard);

module.exports = router;


