# Stage 1 — install production deps (build tools in case bcrypt has no prebuilt binary for the platform)
FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev

# Stage 2 — runtime image (no build tools, non-root)
FROM node:22-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Upload directory must be writable by the non-root user (mounted as a volume in compose).
RUN mkdir -p public/uploads/slides/images && chown -R node:node public

USER node

EXPOSE 3500

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3500) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "index.js"]
