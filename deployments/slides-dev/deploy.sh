#!/usr/bin/env bash
# ==============================================================================
# Development Deployment Script for Slides Application
# Target Host: 167.86.122.141
# Environment: DEVELOPMENT
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

COMPOSE_FILE="docker-compose.yml"
ENV_FILE="backend.env"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[DEV INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[DEV OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[DEV WARN]${NC} $*"; }
err()   { echo -e "${RED}[DEV ERROR]${NC} $*" >&2; }
die()   { err "$*"; exit 1; }

check_prerequisites() {
  command -v docker >/dev/null 2>&1 || die "docker is required but not installed."
  docker compose version >/dev/null 2>&1 || die "docker compose plugin is required."

  if [ ! -f "$ENV_FILE" ]; then
    if [ -f "backend.env.example" ]; then
      warn "$ENV_FILE not found! Copying from backend.env.example..."
      cp backend.env.example "$ENV_FILE"
    else
      die "$ENV_FILE is missing."
    fi
  fi

  mkdir -p ./uploads
  chmod -R 775 ./uploads 2>/dev/null || true
}

check_host_mongodb() {
  info "Checking MongoDB on host port 27017..."
  if command -v nc >/dev/null 2>&1; then
    if nc -z 127.0.0.1 27017 2>/dev/null; then
      ok "Host MongoDB is actively listening on port 27017."
    else
      warn "Could not connect to 127.0.0.1:27017. Verify systemctl status mongod."
    fi
  fi
}

show_status() {
  echo ""
  info "=== Development Status ==="
  docker compose -f "$COMPOSE_FILE" ps
  echo ""
  if curl -sf http://127.0.0.1:3501/health >/dev/null 2>&1; then
    ok "Dev API: HEALTHY (http://127.0.0.1:3501/health -> 200 OK)"
  else
    warn "Dev API not healthy on port 3501"
  fi
  if curl -sf http://127.0.0.1:3001 >/dev/null 2>&1; then
    ok "Dev Frontend: RESPONDING (http://127.0.0.1:3001 -> 200 OK)"
  else
    warn "Dev Frontend not responding on port 3001"
  fi
  echo ""
}

deploy() {
  local target="${1:-both}"
  local be_tag="${2:-${BACKEND_TAG:-dev}}"
  local fe_tag="${3:-${FRONTEND_TAG:-$be_tag}}"

  export BACKEND_TAG="$be_tag"
  export FRONTEND_TAG="$fe_tag"

  check_prerequisites
  check_host_mongodb

  echo ""
  info "=========================================================="
  info " Deploying Slides Application (DEVELOPMENT)"
  info " Target:   $target"
  info " Backend:  tariqsulehri/slides-be:$BACKEND_TAG"
  info " Frontend: tariqsulehri/slides-fe:$FRONTEND_TAG"
  info " Ports:    API: 3501, Frontend: 3001"
  info "=========================================================="
  echo ""

  case "$target" in
    both)
      info "Pulling dev images..."
      docker compose -f "$COMPOSE_FILE" pull backend frontend || true
      info "Starting dev containers..."
      docker compose -f "$COMPOSE_FILE" up -d --remove-orphans backend frontend
      ;;
    backend|be)
      docker compose -f "$COMPOSE_FILE" pull backend frontend || true
      docker compose -f "$COMPOSE_FILE" up -d --no-deps backend
      ;;
    frontend|fe)
      docker compose -f "$COMPOSE_FILE" pull backend frontend || true
      docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend
      ;;
    *)
      die "Unknown target '$target'. Use: both, backend, frontend."
      ;;
  esac

  info "Waiting for dev backend to be healthy..."
  local attempts=0
  while [ $attempts -lt 15 ]; do
    if curl -sf http://127.0.0.1:3501/health >/dev/null 2>&1; then
      ok "Dev backend is healthy!"
      break
    fi
    attempts=$((attempts + 1))
    echo -n "."
    sleep 2
  done
  echo ""

  show_status
  ok "Development deployment completed!"
}

COMMAND="${1:-both}"

case "$COMMAND" in
  status)  show_status ;;
  logs)    docker compose -f "$COMPOSE_FILE" logs -f --tail=100 "${2:-}" ;;
  restart) docker compose -f "$COMPOSE_FILE" restart && show_status ;;
  stop)    docker compose -f "$COMPOSE_FILE" down ;;
  both|backend|frontend|be|fe) deploy "$COMMAND" "${2:-}" "${3:-}" ;;
  *) deploy "both" "$1" "${2:-$1}" ;;
esac
