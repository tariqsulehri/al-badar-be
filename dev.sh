#!/bin/bash
# Local development — runs BE and FE without Docker (hot reload on both)

ROOT=$(cd "$(dirname "$0")" && pwd)

# Check .env files exist
if [ ! -f "$ROOT/slides-be/.env" ]; then
  echo "Missing slides-be/.env — copy from slides-be/src/sample.env and fill in your MongoDB URI"
  exit 1
fi

if [ ! -f "$ROOT/slides-fe/.env" ]; then
  echo "Missing slides-fe/.env — creating with default localhost values"
  echo "VITE_API_BASE_URL=http://localhost:3500/api" > "$ROOT/slides-fe/.env"
  echo "VITE_APP_API_BASE_URL=http://localhost:3500/api" >> "$ROOT/slides-fe/.env"
fi

# Install dependencies if node_modules missing
if [ ! -d "$ROOT/slides-be/node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install --prefix "$ROOT/slides-be"
fi

if [ ! -d "$ROOT/slides-fe/node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --prefix "$ROOT/slides-fe"
fi

echo ""
echo "Starting backend  → http://localhost:3500"
echo "Starting frontend → http://localhost:5173"
echo "Press Ctrl+C to stop both"
echo ""

# Run both in parallel, kill both on Ctrl+C
trap 'kill 0' SIGINT SIGTERM

npm run dev --prefix "$ROOT/slides-be" &
npm run dev --prefix "$ROOT/slides-fe" &

wait
