# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack monorepo for a slides/presentation management application ("al-badar"). Consists of a React frontend, Express backend, and MongoDB, all orchestrated via Docker Compose.

```
/slides/
├── slides-fe/          # React 18 + Vite frontend (port 3000)
├── slides-be/          # Express + MongoDB backend (port 3500)
└── docker-compose.yml  # Full stack + MongoDB
```

## Commands

### Frontend (`slides-fe/`)
```bash
npm run dev       # Start Vite dev server on port 3000
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

### Docker (from repo root)
```bash
docker compose up -d                                          # Start full stack locally
docker build -t tariqsulehri/slides-fe:latest ./slides-fe   # Build FE image
docker build -t tariqsulehri/slides-be:latest ./slides-be   # Build BE image
```

There are no automated tests — `npm test` in the backend exits with a placeholder error.

## Architecture

### Frontend (`slides-fe/src/`)

- **`main.jsx`** — Bootstrap: Redux store, Redux Persist, React Query, Router, toast notifications
- **`routes/`** — Route config split into `publicRoutes`, `privateRoutes`, `protectedRoutes`
- **`features/`** — Feature modules (auth, config, party, slides, user). Each contains components, a Redux slice, and API service calls.
- **`services/apis/`** — Axios-based API clients
- **`store/`** — Redux store + root reducer
- **`components/`** — Shared UI components

State management uses Redux Toolkit (persists `auth` and `slidesForPptx` slices via Redux Persist) for client state and TanStack React Query for server state.

**Reference implementation:** `slides` feature is the clearest full-stack example to follow when adding new features.

### Backend (`slides-be/`)

- **`index.js`** — Express app init, CORS, route mounting, MongoDB connection
- **`src/startup/routes.js`** — All API route mounts
- **`src/models/`** — Mongoose schemas
- **`src/controllers/`** — Route handler logic
- **`src/services/`** — Business logic layer
- **`src/middleware/`** — Auth and validation middleware
- **`src/helpers/`** — Response helpers and utilities

**API base path:** `/api/*` — routes include auth, users, slides, party, invoice, quote, and geographic lookups (province, city, area, subarea).

### Adding a New Full-Stack Feature

Model → Controller → Route → mount in `startup/routes.js` → Frontend Service → Feature Component → Redux slice (if client state needed)

## Known Quirks

- Frontend has two inconsistent env var names for the API base URL: `VITE_APP_API_BASE_URL` (some services) and `VITE_API_BASE_URL` (others).
- Some frontend services use a shared Axios instance; others instantiate their own.
- JWT middleware in the backend is commented out — auth is not enforced on most routes.
- Upload URLs are hard-coded to `http://localhost:3500`.
- Local dev uses static `admin/admin` credentials.
