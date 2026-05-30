# Development Guide

## Daily Workflow

### Option A — Local (fastest, hot reload)

```bash
./dev.sh
```

- Backend live at `http://localhost:3500` — restarts on every file save
- Frontend live at `http://localhost:5173` — updates in browser instantly
- Press `Ctrl+C` to stop both

### Option B — Docker (test the production build locally)

```bash
./docker-build.sh        # build both BE + FE, then run
./docker-build.sh be     # rebuild backend only, then run
./docker-build.sh fe     # rebuild frontend only, then run
```

- Frontend at `http://localhost:3000`
- Backend at `http://localhost:3500`

```bash
docker compose logs -f   # stream logs
docker compose down      # stop everything
```

---

## Pushing Changes

### 1. Commit and push to `dev`

```bash
git add .
git commit -m "your message"
git push origin dev
```

GitHub Actions automatically builds and pushes multi-platform Docker images
(`linux/amd64` + `linux/arm64`) to Docker Hub on every push to `dev`, `main`, or `master`.

### 2. Manual push to Docker Hub (skip CI)

```bash
./docker-build.sh push
```

---

## First-Time Setup

### Prerequisites

- Node.js 22+
- Docker Desktop
- Git

### 1. Clone and switch to dev

```bash
git clone git@github.com:tariqsulehri/al-badar-be.git
cd al-badar-be
git checkout dev
```

### 2. Backend environment

```bash
cp slides-be/src/sample.env slides-be/.env
```

Edit `slides-be/.env` and set your MongoDB URI:

```env
PORT=3500
DB=mongodb+srv://<user>:<password>@cluster.mongodb.net/abdata
BASE_IMAGES_PATH=http://localhost:3500/uploads/slides/images
BASE_URL=http://localhost:3500
NODE_SECRET_KEY=your_secret_key
```

### 3. Frontend environment

```bash
# slides-fe/.env is auto-created by dev.sh if missing
# or create manually:
echo "VITE_API_BASE_URL=http://localhost:3500/api" > slides-fe/.env
echo "VITE_APP_API_BASE_URL=http://localhost:3500/api" >> slides-fe/.env
```

### 4. Run

```bash
./dev.sh
```

---

## Docker Hub Images

| Image | Description |
|---|---|
| `tariqsulehri/slides-be:latest` | Express + MongoDB backend |
| `tariqsulehri/slides-fe:latest` | React frontend served via nginx |

Both images support `linux/amd64` (Linux servers) and `linux/arm64` (Apple Silicon / AWS Graviton).

### Pre-create MongoDB volume (first time only)

```bash
docker volume create mongodb_data
```

Then start the full stack:

```bash
docker compose up -d
```

---

## Project Structure

```
al-badar-be/
├── slides-be/          # Express + MongoDB backend (port 3500)
│   ├── index.js        # Server entry point
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── Dockerfile
├── slides-fe/          # React + Vite frontend
│   ├── src/
│   │   ├── features/   # slides, auth, party, config, user
│   │   ├── components/ # shared UI
│   │   ├── services/   # API calls
│   │   └── store/      # Redux
│   └── Dockerfile
├── docker-compose.yml
├── dev.sh              # Run both locally with hot reload
└── docker-build.sh     # Build Docker images and run
```

---

## Default Login

```
Username: admin
Password: admin
```

> The user must exist in the database. If running fresh, create it via `POST /api/users`.

---

## Useful Commands

```bash
# Backend
cd slides-be
npm run dev          # start with hot reload
npm start            # start without hot reload

# Frontend
cd slides-fe
npm run dev          # Vite dev server
npm run build        # production build
npm run lint         # ESLint check

# Docker
docker compose up -d          # start all containers
docker compose down           # stop all containers
docker compose logs -f        # stream all logs
docker compose logs -f backend  # backend logs only
docker volume ls              # list volumes
```
