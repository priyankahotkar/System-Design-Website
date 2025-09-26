require('dotenv').config();
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Whiteboard = require('./models/Whiteboard');
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 10000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
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

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Not authorized, no token'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(err);
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
                const isMember = whiteboard.users.some((u) => String(u) === String(socket.userId));
                if (!isMember) {
                    whiteboard.users.push(socket.userId);
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

app.post("/runCode", (req, res) => {
    const { language, code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Code is required." });
    }

    const config = {
        javascript: { ext: ".js", image: "node:alpine", run: "node" },
        python: { ext: ".py", image: "python:alpine", run: "python" },
        java: { ext: ".java", image: "openjdk:17", compile: "javac", run: "java SystemDesign" },
        cpp: { ext: ".cpp", image: "gcc:latest", compile: "g++", run: "./SystemDesign" }
    }[language];

    if (!config) {
        return res.status(400).json({ error: "Unsupported language." });
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-"));
    const filePath = path.join(tempDir, `SystemDesign${config.ext}`);
    fs.writeFileSync(filePath, code);

    // Build Docker command
    let command;
    if (config.compile) {
        if (language === "java") {
            command = `docker run --rm --network none --memory=256m --cpus=0.5 -v "${tempDir}:/usr/src/app" ${config.image} sh -c "cd /usr/src/app && ${config.compile} SystemDesign${config.ext} && ${config.run}"`;
        } else { // C++
            command = `docker run --rm --network none --memory=256m --cpus=0.5 -v "${tempDir}:/usr/src/app" ${config.image} sh -c "cd /usr/src/app && ${config.compile} SystemDesign${config.ext} -o SystemDesign && ${config.run}"`;
        }
    } else {
        command = `docker run --rm --network none --memory=256m --cpus=0.5 -v "${filePath}:/usr/src/app/code${config.ext}" ${config.image} ${config.run} /usr/src/app/code${config.ext}`;
    }

    console.log("Executing command:", command);

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        console.log("--- Docker Execution Finished ---");
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
        if (error) {
            console.log("exec error:", error);
        }
        console.log("-------------------------------");

        fs.rmSync(tempDir, { recursive: true, force: true });

        if (error) {
            return res.json({ output: stderr || error.message });
        }
        res.json({ output: stdout || stderr });
    });
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
