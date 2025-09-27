const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please enter a valid email'
        ]
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    password: {
        type: String,
        required: function() {
            return !this.firebaseUid; // Password required only for email/password auth
        }
    },
    firebaseUid: {
        type: String,
        sparse: true,
        unique: true
    },
    photoURL: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    badges: [
        {
            key: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, default: '' },
            awardedAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

// Index on badge key within array
userSchema.index({ 'badges.key': 1 });

module.exports = mongoose.model('User', userSchema);