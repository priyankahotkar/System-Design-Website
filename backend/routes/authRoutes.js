const express = require('express');
const router = express.Router();
const {
    loginUser,
    registerUser,
    googleAuth,
    getMe,
    updateProfile,
    verifyEmail,
    confirmEmailVerification,
    logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/verify-email', protect, verifyEmail);
router.post('/confirm-email-verification', confirmEmailVerification);

module.exports = router;