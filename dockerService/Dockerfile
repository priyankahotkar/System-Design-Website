FROM debian:bullseye-slim

# Install curl, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3 \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Node 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Set working directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./
RUN npm install --production

# Copy app code
COPY . .

# Expose port
ENV PORT 8080
EXPOSE 8080

# Start Node app
CMD ["node", "app.js"]
