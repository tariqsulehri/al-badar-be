#!/bin/bash
# Build Docker images from local source and run with compose
# Usage:
#   ./docker-build.sh          — build both BE and FE, then run locally
#   ./docker-build.sh be       — build backend only, then run
#   ./docker-build.sh fe       — build frontend only, then run
#   ./docker-build.sh push     — build multi-platform (latest) and push to Docker Hub
#   ./docker-build.sh push v1.0.0 — build multi-platform (v1.0.0 + latest) and push

set -euo pipefail

ROOT=$(cd "$(dirname "$0")" && pwd)
TAG="${2:-latest}"
BE_IMAGE_NAME="tariqsulehri/slides-be"
FE_IMAGE_NAME="tariqsulehri/slides-fe"
BE_IMAGE="${BE_IMAGE_NAME}:${TAG}"
FE_IMAGE="${FE_IMAGE_NAME}:${TAG}"
VITE_API_URL="${VITE_API_BASE_URL:-/api}"

build_be() {
  echo "Building backend image ($BE_IMAGE)..."
  docker build -t "$BE_IMAGE" "$ROOT/slides-be"
  if [ "$TAG" != "latest" ]; then
    docker tag "$BE_IMAGE" "${BE_IMAGE_NAME}:latest"
  fi
}

build_fe() {
  echo "Building frontend image ($FE_IMAGE with VITE_API_BASE_URL=$VITE_API_URL)..."
  docker build --build-arg VITE_API_BASE_URL="$VITE_API_URL" -t "$FE_IMAGE" "$ROOT/slides-fe"
  if [ "$TAG" != "latest" ]; then
    docker tag "$FE_IMAGE" "${FE_IMAGE_NAME}:latest"
  fi
}

push_multi() {
  echo "Building and pushing multi-platform images (linux/amd64,linux/arm64) with tag: $TAG..."
  local be_tags="-t ${BE_IMAGE_NAME}:${TAG}"
  local fe_tags="-t ${FE_IMAGE_NAME}:${TAG}"
  if [ "$TAG" != "latest" ]; then
    be_tags="$be_tags -t ${BE_IMAGE_NAME}:latest"
    fe_tags="$fe_tags -t ${FE_IMAGE_NAME}:latest"
  fi

  docker buildx build --platform linux/amd64,linux/arm64 $be_tags --push "$ROOT/slides-be"
  docker buildx build --platform linux/amd64,linux/arm64 --build-arg VITE_API_BASE_URL="$VITE_API_URL" $fe_tags --push "$ROOT/slides-fe"
  echo "Done. Multi-platform images pushed to Docker Hub."
}

run() {
  echo "Starting containers with compose..."
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
  *)    echo "Usage: $0 [be|fe|push [tag]|both]"; exit 1 ;;
esac
