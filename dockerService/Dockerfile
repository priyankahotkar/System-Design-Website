# Use Debian slim base
FROM debian:bullseye-slim

# Install Node.js, npm, Python3, and g++
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    python3 \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Expose port
ENV PORT 8080
EXPOSE 8080

# Start Node app
CMD ["node", "app.js"]
