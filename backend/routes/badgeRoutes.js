const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyBadges, awardBadge } = require('../controllers/badgeController');

router.get('/me', verifyFirebaseToken, getMyBadges);
router.post('/award', verifyFirebaseToken, awardBadge);

module.exports = router;


