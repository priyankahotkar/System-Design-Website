const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/badges/me
const getMyBadges = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('badges');
    res.status(200).json({ success: true, data: user?.badges || [] });
});

// POST /api/badges/award
// body: { key, title, description }
const awardBadge = asyncHandler(async (req, res) => {
    const { key, title, description } = req.body || {};
    if (!key || !title) {
        res.status(400);
        throw new Error('key and title are required');
    }
    const user = await User.findById(req.user._id).select('badges');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const already = (user.badges || []).some(b => b.key === key);
    if (!already) {
        user.badges.push({ key, title, description });
        await user.save();
    }
    res.status(200).json({ success: true, data: user.badges });
});

module.exports = { getMyBadges, awardBadge };


