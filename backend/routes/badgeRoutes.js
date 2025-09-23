const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyBadges, awardBadge } = require('../controllers/badgeController');

router.get('/me', protect, getMyBadges);
router.post('/award', protect, awardBadge);

module.exports = router;


