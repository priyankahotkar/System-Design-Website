const mongoose = require('mongoose');

const WhiteboardSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            index: true,
        },
        state: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Optional latest snapshot for fast load
        snapshotImage: {
            type: String,
            default: '',
        },
        snapshotAt: {
            type: Date,
        },
        // Incremental strokes for replay
        strokes: [
            {
                x1: Number,
                y1: Number,
                x2: Number,
                y2: Number,
                color: String,
                thickness: Number,
                erase: { type: Boolean, default: false },
                ts: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
WhiteboardSchema.index({ questionId: 1, updatedAt: -1 });

// Ensure "users" acts like a set (no duplicates)
WhiteboardSchema.pre('save', function (next) {
    if (Array.isArray(this.users)) {
        this.users = [...new Set(this.users.map((u) => String(u)))];
    }
    next();
});

module.exports = mongoose.model('Whiteboard', WhiteboardSchema);


