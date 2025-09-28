# Use slim Debian base
FROM debian:bullseye-slim

# Install runtimes & compilers (no recommended packages to save space)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    g++ \
    openjdk-11-jdk-headless \
    nodejs \
    npm \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy app code
COPY . .

# Expose port
EXPOSE 9090

# Start service
CMD ["node", "index.js"]
