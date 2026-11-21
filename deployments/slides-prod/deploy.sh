#!/usr/bin/env bash
# ==============================================================================
# Production Deployment Script for Slides Application
# Target Host: 167.86.122.141
# Environment: PRODUCTION
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

info()  { echo -e "${BLUE}[PROD INFO]${NC} $*"; }
ok()    { echo -e "${GREEN}[PROD OK]${NC} $*"; }
warn()  { echo -e "${YELLOW}[PROD WARN]${NC} $*"; }
err()   { echo -e "${RED}[PROD ERROR]${NC} $*" >&2; }
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

  mkdir -p /uploads/prod/images/slides
  chmod -R 775 /uploads/prod/images/slides 2>/dev/null || true
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

run_backup() {
  if [ -x "./mongodb-backup.sh" ]; then
    info "Running production MongoDB backup before deploy..."
    ./mongodb-backup.sh || warn "MongoDB backup encountered a non-fatal warning."
  fi
}

show_status() {
  echo ""
  info "=== Production Status ==="
  docker compose -f "$COMPOSE_FILE" ps
  echo ""
  if curl -sf http://127.0.0.1:3500/health >/dev/null 2>&1; then
    ok "Production API: HEALTHY (http://127.0.0.1:3500/health -> 200 OK)"
  else
    warn "Production API not healthy on port 3500"
  fi
  if curl -sf http://127.0.0.1:3000 >/dev/null 2>&1; then
    ok "Production Frontend: RESPONDING (http://127.0.0.1:3000 -> 200 OK)"
  else
    warn "Production Frontend not responding on port 3000"
  fi
  echo ""
}

deploy() {
  local target="${1:-both}"
  local be_tag="${2:-${BACKEND_TAG:-latest}}"
  local fe_tag="${3:-${FRONTEND_TAG:-$be_tag}}"

  export BACKEND_TAG="$be_tag"
  export FRONTEND_TAG="$fe_tag"

  check_prerequisites
  check_host_mongodb

  echo ""
  info "=========================================================="
  info " Deploying Slides Application (PRODUCTION)"
  info " Target:   $target"
  info " Backend:  tariqsulehri/slides-be:$BACKEND_TAG"
  info " Frontend: tariqsulehri/slides-fe:$FRONTEND_TAG"
  info " Ports:    API: 3500, Frontend: 3000"
  info "=========================================================="
  echo ""

  case "$target" in
    both)
      run_backup
      info "Pulling production images..."
      docker compose -f "$COMPOSE_FILE" pull backend frontend
      info "Starting production containers..."
      docker compose -f "$COMPOSE_FILE" up -d --remove-orphans backend frontend
      ;;
    backend|be)
      run_backup
      docker compose -f "$COMPOSE_FILE" pull backend
      docker compose -f "$COMPOSE_FILE" up -d --no-deps backend
      ;;
    frontend|fe)
      docker compose -f "$COMPOSE_FILE" pull frontend
      docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend
      ;;
    *)
      die "Unknown target '$target'. Use: both, backend, frontend."
      ;;
  esac

  info "Waiting for production backend to be healthy..."
  local attempts=0
  while [ $attempts -lt 15 ]; do
    if curl -sf http://127.0.0.1:3500/health >/dev/null 2>&1; then
      ok "Production backend is healthy!"
      break
    fi
    attempts=$((attempts + 1))
    echo -n "."
    sleep 2
  done
  echo ""

  show_status
  ok "Production deployment completed!"
}

COMMAND="${1:-both}"

case "$COMMAND" in
  status)  show_status ;;
  logs)    docker compose -f "$COMPOSE_FILE" logs -f --tail=100 "${2:-}" ;;
  restart) docker compose -f "$COMPOSE_FILE" restart && show_status ;;
  stop)    docker compose -f "$COMPOSE_FILE" down ;;
  backup)  run_backup ;;
  both|backend|frontend|be|fe) deploy "$COMMAND" "${2:-}" "${3:-}" ;;
  *) deploy "both" "$1" "${2:-$1}" ;;
esac
