const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/auth');
const { createWhiteboard, getOrJoinWhiteboard, listMyWhiteboards } = require('../controllers/whiteboardController');

// Create new whiteboard
router.post('/', verifyFirebaseToken, createWhiteboard);

// List my whiteboards, filtered by questionId
router.get('/', verifyFirebaseToken, listMyWhiteboards);

// Join/fetch existing whiteboard by id
router.get('/:id', verifyFirebaseToken, getOrJoinWhiteboard);

module.exports = router;


