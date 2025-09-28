# Use Debian slim base
FROM debian:bullseye-slim

# Install runtimes & compilers for Python and C++
RUN apt-get update && apt-get install -y --no-install-recommends \
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

# Expose port (Cloud Run uses PORT env)
ENV PORT 8080
EXPOSE 8080

# Start Node app
CMD ["node", "app.js"]
