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

### Backend (`slides-be/`)
```bash
npm run dev            # nodemon on port 3500 (needs .env — copy .env.example)
npm test               # Jest + Supertest integration tests; needs MongoDB (TEST_DB_URI, default mongodb://127.0.0.1:27017/slides_test)
npm run create-admin   # ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD env vars; creates or resets an admin
npm run sync-lookups   # one-off backfill of province/city/area/subarea/supplier lookups from existing slides
```

### Docker (from repo root)
```bash
docker compose up -d                                          # Start full stack locally
docker build -t tariqsulehri/slides-fe:latest ./slides-fe   # Build FE image
docker build -t tariqsulehri/slides-be:latest ./slides-be   # Build BE image
```

Backend has integration tests in `slides-be/tests/`. The frontend has no tests yet. CI (`.github/workflows/`) runs backend tests / frontend lint+build before pushing images.

## Architecture

### Frontend (`slides-fe/src/`)

- **`main.jsx`** — Bootstrap: Redux store, Redux Persist, React Query, Router, toast notifications
- **`routes/`** — Route config split into `publicRoutes`, `privateRoutes`, `protectedRoutes`
- **`features/`** — Feature modules (auth, config, party, slides, user). Each contains components, a Redux slice, and API service calls.
- **`services/axios.js`** — the single Axios client: adds `Authorization: Bearer <token>` from the Redux `auth` slice, logs out on 401. `unwrap()` returns `response.data.result`.
- **`services/apis/`** — API functions per resource; `config/lookupApi.js` is shared by the four lookup services
- **`store/`** — Redux store + root reducer
- **`components/`** — Shared UI components

State management uses Redux Toolkit (persists only the `auth` slice — user + JWT — via Redux Persist) for client state and TanStack React Query for server state.

**Reference implementation:** `slides` feature is the clearest full-stack example to follow when adding new features.

### Backend (`slides-be/`)

- **`index.js`** — connects MongoDB then starts the server (graceful shutdown)
- **`src/app.js`** — Express app: helmet, CORS allowlist (`CORS_ORIGINS`), JSON, static uploads, routes, 404 + central error handler. Exported for tests.
- **`src/config/env.js`** — loads/validates env vars; fails fast if `DB` or `NODE_SECRET_KEY` is missing
- **`src/startup/routes.js`** — All API route mounts; everything except `/api/auth` sits behind the JWT `auth` middleware
- **`src/routes/crudRouter.js`** — standard `create / update/:id / find/:id / DELETE delete/:id / list` route set
- **`src/models/`** — Mongoose schemas
- **`src/controllers/`** — Route handler logic
- **`src/services/`** — Business logic layer
- **`src/middleware/`** — `auth` (JWT), `requireRole`, `asyncHandler`, `errorHandler`, `imageUpload` (multer)
- **`src/utils/`** — `apiResponse` (`ok`/`created`), `HttpError`, query helpers (`parsePagination`, `containsRegex`, `readPayload`), logger
- **`src/validation/`** — zod schemas for auth/user input

**Conventions:** controllers throw `HttpError` (never build error JSON themselves) and reply with `ok()`/`created()`. Every response is `{ status: "success" | "error", message, result }`; errors use real HTTP status codes (400/401/403/404/409/500). Lists are 1-based: `result = { data, totalRecords, pageNo, pageSize, totalPages }`. User text going into `$regex` must use `containsRegex`/`exactRegex`.

**API base path:** `/api/*` — routes include auth, users, slides, party, invoice, quote, and geographic lookups (province, city, area, subarea).

### Adding a New Full-Stack Feature

Model → Service (throws `HttpError`) → Controller → `crudRouter(controller)` → mount in `startup/routes.js` behind `auth` → test in `slides-be/tests/` → Frontend service using `httpClient` + `unwrap` → Feature Component

## Known Quirks

- Roles: `admin`, `manager`, `user`. The API only requires authentication on data routes; user management (`/api/users/list|create|find|delete`) is admin-only. The frontend route guards are UX only.
- There is no public sign-up. Create the first admin with `npm run create-admin`.
- Lookup collections (province/city/area/subarea and supplier parties) are filled from slides when a slide is saved, not on read.
- List screens use 0-based page indexes internally; the frontend services add 1 before calling the API.
- Slide editing lives at `/slides/edit/:id` (id in the URL, not Redux).
- `slides-fe/.env` still has an unused `VITE_APP_API_BASE_URL`; only `VITE_API_BASE_URL` is read.
