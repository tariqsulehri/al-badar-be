#!/bin/bash
# Build Docker images from local source and run with compose
# Usage:
#   ./docker-build.sh          — build both BE and FE, then run
#   ./docker-build.sh be       — build backend only, then run
#   ./docker-build.sh fe       — build frontend only, then run
#   ./docker-build.sh push     — build multi-platform and push to Docker Hub

ROOT=$(cd "$(dirname "$0")" && pwd)
BE_IMAGE="tariqsulehri/slides-be:latest"
FE_IMAGE="tariqsulehri/slides-fe:latest"

build_be() {
  echo "Building backend image..."
  docker build -t "$BE_IMAGE" "$ROOT/slides-be"
}

build_fe() {
  echo "Building frontend image..."
  docker build -t "$FE_IMAGE" "$ROOT/slides-fe"
}

push_multi() {
  echo "Building and pushing multi-platform images (amd64 + arm64)..."
  docker buildx build --platform linux/amd64,linux/arm64 -t "$BE_IMAGE" --push "$ROOT/slides-be"
  docker buildx build --platform linux/amd64,linux/arm64 -t "$FE_IMAGE" --push "$ROOT/slides-fe"
  echo "Done. Images pushed to Docker Hub."
}

run() {
  echo "Starting containers..."
  docker compose -f "$ROOT/docker-compose.yml" up -d
  echo ""
  echo "Frontend → http://localhost:3000"
  echo "Backend  → http://localhost:3500"
  echo ""
  echo "To view logs: docker compose logs -f"
  echo "To stop:      docker compose down"
}

case "${1:-both}" in
  be)   build_be && run ;;
  fe)   build_fe && run ;;
  push) push_multi ;;
  both) build_be && build_fe && run ;;
  *)    echo "Usage: $0 [be|fe|push]"; exit 1 ;;
esac
