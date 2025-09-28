FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    python3 \
    g++ \
    openjdk-11-jdk \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
