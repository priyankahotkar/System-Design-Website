const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;
    console.log('Auth headers:', req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Extracted token:', token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            console.log('Found user:', user);

            if (!user) {
                res.status(401);
                throw new Error('User not found');
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401);
            throw new Error('Not authorized: ' + error.message);
        }
    }

    if (!token) {
        console.log('No token provided');
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = { protect, generateToken };
