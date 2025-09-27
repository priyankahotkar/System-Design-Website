const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { auth: firebaseAuth } = require('../config/firebase');

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

// Firebase token verification middleware
const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
    let token;
    console.log('Firebase auth headers:', req.headers.authorization);

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Extracted Firebase token:', token);

            // Verify Firebase ID token
            const decodedToken = await firebaseAuth.verifyIdToken(token);
            console.log('Decoded Firebase token:', decodedToken);

            // Check if email is verified (for email/password users)
            if (!decodedToken.email_verified) {
                res.status(403);
                throw new Error('Please verify your email before logging in');
            }

            // Get or create user from Firebase token
            let user = await User.findOne({ 
                $or: [
                    { firebaseUid: decodedToken.uid },
                    { email: decodedToken.email }
                ]
            });

            if (!user) {
                // Create new user from Firebase token
                user = await User.create({
                    email: decodedToken.email,
                    name: decodedToken.name || decodedToken.email.split('@')[0],
                    firebaseUid: decodedToken.uid,
                    photoURL: decodedToken.picture || '',
                    emailVerified: decodedToken.email_verified
                });
            } else {
                // Update existing user with latest Firebase data
                user.firebaseUid = decodedToken.uid;
                user.name = decodedToken.name || user.name;
                user.photoURL = decodedToken.picture || user.photoURL;
                user.lastLogin = Date.now();
                await user.save();
            }

            req.user = user;
            req.firebaseUser = decodedToken;
            next();
        } catch (error) {
            console.error('Firebase token verification error:', error);
            res.status(401);
            throw new Error('Not authorized: ' + error.message);
        }
    }

    if (!token) {
        console.log('No Firebase token provided');
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

module.exports = { protect, verifyFirebaseToken, generateToken };
