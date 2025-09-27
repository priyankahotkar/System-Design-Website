const express = require('express');
const router = express.Router();
const {
    getMe,
    updateProfile,
    logoutUser
} = require('../controllers/authController');
const { protect, verifyFirebaseToken } = require('../middleware/auth');

// Auth routes
router.post('/logout', verifyFirebaseToken, logoutUser);
router.get('/me', verifyFirebaseToken, getMe);
router.put('/updateprofile', verifyFirebaseToken, updateProfile);

module.exports = router;