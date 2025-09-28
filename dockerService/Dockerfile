# Use modern Node.js (20 LTS)
FROM node:20-slim

# Install additional runtimes & compilers
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    g++ \
    openjdk-17-jdk-headless \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy application source
COPY . .

# Expose service port
EXPOSE 9090

# Start service
CMD ["node", "app.js"]
