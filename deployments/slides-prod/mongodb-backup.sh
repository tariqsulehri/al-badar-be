#!/usr/bin/env bash
# ==============================================================================
# MongoDB Backup Script - PRODUCTION
# Backs up production database 'abdata' from host VM
# ==============================================================================
set -euo pipefail

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-27017}"
DB_NAME="${DB_NAME:-abdata}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mongodb-slides-prod}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

TIMESTAMP="$(date -u +'%Y-%m-%dT%H-%M-%SZ')"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_prod_${TIMESTAMP}.archive.gz"

echo "[PROD BACKUP] Starting MongoDB backup for database '$DB_NAME'..."

if ! command -v mongodump >/dev/null 2>&1; then
  echo "[ERROR] mongodump is not installed. Install via: apt-get install -y mongodb-database-tools" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
mongodump -u admin -p "#786Allahis1" --authenticationDatabase=admin --host="$DB_HOST" --port="$DB_PORT" --db="$DB_NAME" --archive="$BACKUP_FILE" --gzip

if [ -f "$BACKUP_FILE" ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "[OK] Production backup created: $BACKUP_FILE ($FILE_SIZE)"
else
  echo "[ERROR] Backup failed: file not created." >&2
  exit 1
fi

find "$BACKUP_DIR" -name "${DB_NAME}_prod_*.archive.gz" -type f -mtime "+$RETENTION_DAYS" -delete 2>/dev/null || true
echo "[OK] Backup maintenance complete."
