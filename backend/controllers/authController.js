const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');


// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, photoURL } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = name || user.name;
    user.photoURL = photoURL || user.photoURL;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photoURL: updatedUser.photoURL,
            role: updatedUser.role
        }
    });
});

// Note: Google authentication and email verification are now handled by Firebase middleware
// The verifyFirebaseToken middleware automatically creates/updates users and verifies email status

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // You can add any cleanup logic here if needed
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = {
    getMe,
    updateProfile,
    logoutUser
};