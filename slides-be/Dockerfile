# Stage 1 — install deps (needs build tools for bcrypt native compilation)
FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2 — final image (no build tools, smaller size)
FROM node:22-bookworm-slim

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3500

CMD ["node", "index.js"]
