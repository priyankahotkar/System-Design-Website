const express = require('express');
const router = express.Router();
const {
    loginUser,
    registerUser,
    getMe,
    updateProfile,
    logoutUser
} = require('../controllers/authController');
const { protect, verifyFirebaseToken } = require('../middleware/auth');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyFirebaseToken, logoutUser);
router.get('/me', verifyFirebaseToken, getMe);
router.put('/updateprofile', verifyFirebaseToken, updateProfile);

module.exports = router;