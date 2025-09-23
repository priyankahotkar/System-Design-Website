const asyncHandler = require('express-async-handler');
const Whiteboard = require('../models/Whiteboard');

// POST /api/whiteboard
// Creates a new whiteboard with current user as owner and member
const createWhiteboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { questionId } = req.body || {};

    const whiteboard = await Whiteboard.create({
        owner: userId,
        users: [userId],
        state: {},
        questionId,
    });

    res.status(201).json({
        success: true,
        data: {
            id: whiteboard._id,
            owner: whiteboard.owner,
            users: whiteboard.users,
            state: whiteboard.state,
            questionId: whiteboard.questionId,
        },
    });
});

// GET /api/whiteboard/:id
// Ensures the signed-in user is a member; returns whiteboard meta/state
const getOrJoinWhiteboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) {
        res.status(404);
        throw new Error('Whiteboard not found');
    }

    const isMember = whiteboard.users.some((u) => String(u) === String(userId));
    if (!isMember) {
        whiteboard.users.push(userId);
        await whiteboard.save();
    }

    res.status(200).json({
        success: true,
        data: {
            id: whiteboard._id,
            owner: whiteboard.owner,
            users: whiteboard.users,
            state: whiteboard.state,
            questionId: whiteboard.questionId,
        },
    });
});

// GET /api/whiteboard?questionId=123
// List user's whiteboards filtered by optional questionId
const listMyWhiteboards = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { questionId } = req.query;

    const filter = { users: userId };
    if (questionId) filter.questionId = questionId;

    const whiteboards = await Whiteboard.find(filter)
        .sort({ updatedAt: -1 })
        .select('_id owner users questionId updatedAt createdAt')
        .lean();

    res.status(200).json({
        success: true,
        data: whiteboards.map(wb => ({
            id: wb._id,
            owner: wb.owner,
            users: wb.users,
            questionId: wb.questionId,
            updatedAt: wb.updatedAt,
            createdAt: wb.createdAt,
        })),
    });
});

module.exports = {
    createWhiteboard,
    getOrJoinWhiteboard,
    listMyWhiteboards,
};


