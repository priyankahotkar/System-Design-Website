# DesignNova

A modern, full‑stack platform to practice Low‑Level Design (LLD) and System Design with a collaborative whiteboard, integrated code editor, real‑time collaboration via WebSockets, a discussion forum, and a gamified learning roadmap with badges.

---

## Features

- Collaborative real-time whiteboard (Socket.IO)

  - Auth‑gated rooms; only members see updates
  - Incremental stroke sync with batching and eraser support
  - Snapshot + recent strokes model for fast late‑join loads
  - Synchronized clear for all users in a room

- Integrated code editor with sandboxed execution endpoint
- Auth (JWT) with Google/email support (backend JWT + Firebase client)
- Whiteboards persisted in MongoDB with periodic state saves
- Roadmap and badges (earn on milestones)
- Discussion Forum powered by Giscus (GitHub Discussions)
- Responsive UI with TailwindCSS

---

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Socket.IO Client, Monaco Editor
- Backend: Node.js, Express, Socket.IO, MongoDB (Mongoose)
- Auth: JWT (server) + Firebase client auth
- Realtime: Socket.IO (websocket transport)

---

## Monorepo Structure

```
backend/
  app.js
  routes/
  controllers/
  models/
  middleware/
  config/

frontend/
  src/
  public/
```

---

## Prerequisites

- Node.js 18+
- MongoDB URI
- Firebase client config (if using Google auth)

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=8080
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
WHITEBOARD_MAX_RECENT_STROKES=100
WHITEBOARD_PERSIST_MS=15000
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env` or `.env.local`)

```
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Setup & Run

1. Install dependencies

```
cd backend && npm install
cd ../frontend && npm install
```

2. Start backend

```
cd backend
node app.js
```

3. Start frontend

```
cd frontend
npm run dev
```

- Frontend dev server: `http://localhost:5173`
- Backend server: `http://localhost:8080`

---

## Backend APIs

Base path: `/api`

### Auth

- POST `/auth/register` – Email/password signup
- POST `/auth/login` – Email/password login
- POST `/auth/google` – Google auth exchange → returns JWT
- GET `/auth/me` – Get current user (Bearer token)
- PUT `/auth/updateprofile` – Update name/photo
- POST `/auth/logout` – Logout

### Whiteboards

- POST `/whiteboard` – Create a new whiteboard (auth). Body: `{ questionId? }`
- GET `/whiteboard/:id` – Join/fetch; adds caller to members (auth) and returns meta + latest state
- GET `/whiteboard?questionId=...` – List my whiteboards for a question (auth)

### Badges

- GET `/badges/me` – List current user’s badges (auth)
- POST `/badges/award` – Award a badge (idempotent). Body: `{ key, title, description? }`

### Run Code

- POST `/runCode` – Execute code in sandboxed container (limited languages)

---

## Socket.IO Events

### Client → Server

- `whiteboard:join` `{ whiteboardId }`
- `whiteboard:update` `{ whiteboardId, type, x, y, tool, color, lineWidth }`
- `whiteboard:stroke` `{ whiteboardId, stroke: { x1,y1,x2,y2,color,thickness,erase,ts } }`
- `whiteboard:snapshot` `{ whiteboardId, image }`
- `whiteboard:clear` `{ whiteboardId }`

### Server → Client

- `whiteboard:init` `{ snapshotImage, snapshotAt, strokes }`
- `whiteboard:update` mirror of update payloads
- `whiteboard:stroke` `{ stroke }`
- `whiteboard:snapshot` `{ image }`
- `whiteboard:clear`

Handshake: send JWT in `auth.token` when connecting. Only DB members of a whiteboard room receive updates.

---

## Frontend Pages

- `/` – Home
- `/dashboard` – Questions
- `/practice/:id` – Practice workspace (code editor + whiteboard)
- `/discussion-forum` – Giscus forum
- `/resources` – Roadmap with badges
- `/profile/badges` – Your earned badges
- `/about-us` – About the project
- `/contact-us` – Contact form

---

## Troubleshooting

- Sockets not connecting: verify `VITE_SOCKET_URL` and `auth_token` in `localStorage`.
- CORS: set `FRONTEND_ORIGIN` to your frontend origin.
- Mongo indexes: allow Mongoose to build in dev, or build manually in prod.
