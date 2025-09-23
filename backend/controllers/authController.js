const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register new user with email/password
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                role: user.role,
                token: generateToken(user._id)
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user with email/password
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            role: user.role,
            token: generateToken(user._id)
        }
    });
});

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

// @desc    Handle Google Authentication
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { email, name, firebaseUid, photoURL } = req.body;

    if (!email || !firebaseUid) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });

    if (user) {
        // Update user data
        user.firebaseUid = firebaseUid;
        user.name = name || user.name;
        user.photoURL = photoURL || user.photoURL;
        user.lastLogin = Date.now();
        await user.save();
    } else {
        // Create user
        user = await User.create({
            email,
            name,
            firebaseUid,
            photoURL
        });
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            role: user.role,
            token: generateToken(user._id)
        }
    });
});

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
    registerUser,
    loginUser,
    googleAuth,
    getMe,
    updateProfile,
    logoutUser
};