require('dotenv').config();
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const { auth } = require('./config/firebase');
const User = require('./models/User');
const Whiteboard = require('./models/Whiteboard');
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const connectDB = require('./config/db');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
    'https://design-nova.vercel.app',
    'http://localhost:5173'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };
  
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());


// Routes
const authRoutes = require('./routes/authRoutes');
const whiteboardRoutes = require('./routes/whiteboardRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/whiteboard', whiteboardRoutes);
app.use('/api/badges', badgeRoutes);

// Socket.IO setup with CORS matching frontend dev origin
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Map to track in-memory latest states and persistence timers per room
const whiteboardStateCache = new Map(); // roomId -> { state, timer }
const MAX_RECENT_STROKES = Number(process.env.WHITEBOARD_MAX_RECENT_STROKES || 100);


io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }
    try {
        const decodedToken = await auth.verifyIdToken(token);
        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        if (!user) {
            // If user does not exist, create a new one
            user = await User.create({
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                firebaseUid: decodedToken.uid,
                photoURL: decodedToken.picture || '',
                emailVerified: decodedToken.email_verified
            });
        }

        // Attach the full user object to the socket
        socket.user = user;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error.message);
        return next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    socket.on('whiteboard:join', async ({ whiteboardId }) => {
        if (!whiteboardId) return;
        const room = `whiteboard:${whiteboardId}`;
        socket.join(room);

        // Ensure membership in DB
        try {
            const whiteboard = await Whiteboard.findById(whiteboardId);
            if (whiteboard) {
                const isMember = whiteboard.users.some((u) => u.equals(socket.user._id));
                if (!isMember) {
                    whiteboard.users.push(socket.user._id);
                    await whiteboard.save();
                }
                // Send init payload: snapshot and strokes since snapshot
                const cached = whiteboardStateCache.get(whiteboardId);
                const state = cached?.state ?? whiteboard.state ?? {};
                socket.emit('whiteboard:init', {
                    snapshotImage: whiteboard.snapshotImage || state.image || '',
                    snapshotAt: whiteboard.snapshotAt || null,
                    strokes: whiteboard.strokes || [],
                });
            } else {
                socket.emit('whiteboard:error', { message: 'Whiteboard not found' });
            }
        } catch (e) {
            socket.emit('whiteboard:error', { message: 'Join failed' });
        }
    });

    socket.on('whiteboard:update', (payload) => {
        const { whiteboardId, delta, fullState, ...rest } = payload || {};
        if (!whiteboardId) return;
        const room = `whiteboard:${whiteboardId}`;
        // Broadcast to room except sender, forward all relevant fields
        socket.to(room).emit('whiteboard:update', { delta, fullState, ...rest });

        // Update cache for periodic persistence
        const current = whiteboardStateCache.get(whiteboardId) || {};
        if (fullState !== undefined) {
            current.state = fullState;
        } else if (delta) {
            current.state = { ...(current.state || {}), ...delta };
        }
        whiteboardStateCache.set(whiteboardId, current);
    });


    // Stroke segment handler with server-side buffering for bulk write
    const strokeBuffer = new Map(); // whiteboardId -> { strokes: [], timer }
    socket.on('whiteboard:stroke', async ({ whiteboardId, stroke }) => {
        if (!whiteboardId || !stroke) return;
        const room = `whiteboard:${whiteboardId}`;
        socket.to(room).emit('whiteboard:stroke', { stroke });

        const buf = strokeBuffer.get(whiteboardId) || { strokes: [], timer: null };
        buf.strokes.push(stroke);
        if (!buf.timer) {
            buf.timer = setTimeout(async () => {
                const toWrite = buf.strokes.splice(0, buf.strokes.length);
                buf.timer = null;
                if (toWrite.length) {
                    try {
                        await Whiteboard.findByIdAndUpdate(
                            whiteboardId,
                            { $push: { strokes: { $each: toWrite, $slice: -MAX_RECENT_STROKES } } }
                        );
                    } catch (e) {
                        console.error('Failed bulk append strokes', e.message);
                    }
                }
            }, 50);
        }
        strokeBuffer.set(whiteboardId, buf);
    });

    // Snapshot image handler
    socket.on('whiteboard:snapshot', async ({ whiteboardId, image }) => {
        if (!whiteboardId || !image) return;
        whiteboardStateCache.set(whiteboardId, { state: { image } });
        try {
            // Persist snapshot and reset recent strokes
            await Whiteboard.findByIdAndUpdate(whiteboardId, {
                snapshotImage: image,
                snapshotAt: new Date(),
                strokes: [],
            });
        } catch (e) {
            console.error('Failed to persist snapshot', e.message);
        }
        const room = `whiteboard:${whiteboardId}`;
        socket.to(room).emit('whiteboard:snapshot', { image });
    });

    // Clear board for all in room
    socket.on('whiteboard:clear', async ({ whiteboardId }) => {
        if (!whiteboardId) return;
        const room = `whiteboard:${whiteboardId}`;
        socket.to(room).emit('whiteboard:clear');
        try {
            await Whiteboard.findByIdAndUpdate(whiteboardId, {
                snapshotImage: '',
                strokes: [],
            });
            whiteboardStateCache.set(whiteboardId, { state: { image: '' } });
        } catch (e) {
            console.error('Failed to clear whiteboard state', e.message);
        }
    });

});

// Periodic persistence every N ms
const PERSIST_INTERVAL_MS = Number(process.env.WHITEBOARD_PERSIST_MS || 15000);
setInterval(async () => {
    const entries = Array.from(whiteboardStateCache.entries());
    for (const [whiteboardId, { state }] of entries) {
        if (!state) continue;
        try {
            await Whiteboard.findByIdAndUpdate(whiteboardId, { state });
        } catch (e) {
            console.error('Failed to persist whiteboard', whiteboardId, e.message);
        }
    }
}, PERSIST_INTERVAL_MS);

server.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Root API working");
});

app.post("/runCode", async (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Code is required." });
    }

    // Handle Java execution with JDoodle
    if (language === 'java') {
        try {
          const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: code,
            language: 'java',
            versionIndex: '4',
          });
          return res.json({ output: response.data.output, exitCode: response.data.statusCode });
        } catch (error) {
          console.error('Error executing Java code with JDoodle:', error.response ? error.response.data : error.message);
          return res.status(500).json({ output: 'Error executing Java code.', error: error.message });
        }
    }

    // Forward Python and C++ to external runner service
    if (language === 'python' || language === 'cpp') {
        try {
            const response = await axios.post(process.env.CODE_RUNNER_URL, {
                language,
                code,
            });
            return res.json(response.data);
        } catch (error)
{
            console.error(`Error forwarding ${language} code execution:`, error.response ? error.response.data : error.message);
            return res.status(500).json({ output: `Error executing ${language} code.`, error: error.message });
        }
    }

    // Fallback for unsupported languages
    return res.status(400).json({ error: "Unsupported language." });
});

// Error handling middleware (place AFTER routes and respect existing status codes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});