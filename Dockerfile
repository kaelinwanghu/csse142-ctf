FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Initialize the database at image build time so the container starts fast
RUN node init_db.js

EXPOSE 3000

CMD ["node", "server.js"]