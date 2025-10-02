FROM node:20-slim

WORKDIR /app

# Install concurrently globally
RUN npm install -g concurrently

# Copy frontend and install deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

# Copy backend and install deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy the rest of the code
WORKDIR /app
COPY . .

# Expose frontend + backend ports
EXPOSE 5173
EXPOSE 8080

# Run frontend (vite dev) + backend (node app.js)
CMD ["concurrently", "npm run dev --prefix frontend -- --host 0.0.0.0", "node backend/app.js"]

