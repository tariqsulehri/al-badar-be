# Codebase Context

Last indexed: 2026-04-24

## Layout

This repository contains a nested application directory:

- `slides/slides-fe`: React + Vite frontend
- `slides/slides-be`: Express + MongoDB backend

The current workspace root is not a Git repository. It acts more like a plain
container folder for the deployable app under `slides/`.

## Runtime And Tooling

Frontend:

- Package manager artifacts: `slides/slides-fe/package-lock.json`
- Dev command: `npm run dev`
- Build command: `npm run build`
- Main stack: React 18, Vite 4, React Router 6, Redux Toolkit, Redux Persist,
  TanStack React Query, MUI, Formik, Yup, Axios, `pptxgenjs`

Backend:

- Package manager artifacts: `slides/slides-be/package-lock.json`
- No real test script is configured; `npm test` exits with an error placeholder
- Main stack: Express 4, Mongoose 5, MongoDB, Multer, JSON Web Token, bcrypt
- Default port: `3500`

Deployment:

- Root deployment instructions live in `slides/README.MD`
- Root Compose file: `slides/docker-compose.yml`
- Docker images documented as `tariqsulehri/slides-fe:latest` and
  `tariqsulehri/slides-be:latest`

## Frontend Architecture

Main entry points:

- `slides/slides-fe/src/main.jsx`: bootstraps React, Redux, Redux Persist, React Query, router, and toast notifications
- `slides/slides-fe/src/App.jsx`: renders the app shell, hides the global navbar on `/login`, and mounts the route tree
- `slides/slides-fe/src/routes/index.jsx`: mounts `publicRoutes`, `privateRoutes`, and `protectedRoutes`

State and data flow:

- Redux store is configured in `slides/slides-fe/src/store/store.js`
- Root reducers live in `slides/slides-fe/src/store/rootReducer.js`
- Persisted slices are `auth` and `slidesForPptx`
- API calls mostly live under `slides/slides-fe/src/services/apis`
- Feature state is usually kept in a slice under `src/features/**/slice`
- Shared Axios instance lives in `src/services/axios.js`, but some feature
  services create their own Axios client instead

Feature organization pattern:

- `src/features/auth`
- `src/features/config`
- `src/features/party`
- `src/features/slides`
- `src/features/user`

Mounted frontend routes:

- Public: `/`, `/login`
- Private user route: `/user/pass`
- Protected admin/manager routes: `/dashboard`, `/users/create`, `/user/list`,
  setup CRUD routes under `/setup/*`, party routes under `/party/*`, and slide
  routes under `/slides/*`

Typical frontend feature flow:

1. Add or update route in `src/routes/publicRoutes.js`, `privateRoutes.js`, or `protectedRoutes.js`
2. Build UI inside `src/features/<feature>`
3. Add API calls in `src/services/apis/...`
4. Add Redux slice only if the feature needs shared client state
5. Add menu entry in `src/components/menu/*` if the page needs navigation

## Backend Architecture

Main entry points:

- `slides/slides-be/index.js`: starts Express, enables CORS, loads routes, connects MongoDB
- `slides/slides-be/src/startup/routes.js`: central API mount point
- `slides/slides-be/src/startup/db.js`: MongoDB connection setup

Mounted API prefixes:

- `/api/auth`
- `/api/home`
- `/api/users`
- `/api/provence`
- `/api/city`
- `/api/area`
- `/api/subarea`
- `/api/party`
- `/api/slides`
- `/api/quote`
- `/api/invoice`

Common backend file groups:

- Models: `slides/slides-be/src/models`
- Controllers: `slides/slides-be/src/controllers`
- Routes: `slides/slides-be/src/routes`
- Startup wiring: `slides/slides-be/src/startup`
- Shared response helpers: `slides/slides-be/src/helpers/responseHelper.js`,
  `slides/slides-be/src/composer/*`

Typical backend feature flow:

1. Define or extend Mongoose model in `src/models`
2. Add controller logic in `src/controllers`
3. Add route definitions in `src/routes`
4. Register the route in `src/startup/routes.js`
5. Add service/helper layer only if the controller is getting too large or the logic is reused

## Best Existing Reference Slice

The clearest full-stack example is the slides feature:

- Frontend screen: `slides/slides-fe/src/features/slides/create.slides.jsx`
- Frontend API client: `slides/slides-fe/src/services/apis/slideService.js`
- Frontend state: `slides/slides-fe/src/features/slides/slice/slideSlice.js`
- Backend routes: `slides/slides-be/src/routes/slides.js`
- Backend controller: `slides/slides-be/src/controllers/slidesController.js`
- Backend model: `slides/slides-be/src/models/slide.model.js`

If you are adding a new resource, mirroring this structure is the fastest path.

## Auth and Access Model

Frontend:

- Route guards use `src/routes/components/*RouteValidator.jsx`
- Current auth behavior is mostly local-storage based
- `src/services/apis/authService.js` currently uses static credentials for development: `admin/admin`
- `ProtectedRouteValidator` allows `admin` and `manager`
- `PrivateRouteValidator` intends to allow `user` and `admin`, but its null
  check condition is fragile because it can read `currentUser.role` when
  `currentUser` is falsy

Backend:

- `src/routes/auth.js` contains a real login path against MongoDB users
- `src/middleware/auth.js` currently does not enforce JWT validation because the token checks are commented out

Practical impact:

- New features can be added without a hard backend auth dependency right now
- If we later harden auth, both frontend token handling and backend middleware will need cleanup together

## Important Quirks To Know Before Adding Features

Frontend quirks:

- `src/services/axios.js` uses `VITE_APP_API_BASE_URL`, while `src/config/constants.js` uses `VITE_API_BASE_URL`
- `src/services/axios.js` sends a hard-coded token value
- `slides/slides-fe/src/main.jsx` imports `AppRoutes` but does not use it
- `src/features/slides/slice/slideSlice.js` writes `currentUser/loggedIn` instead of slide-specific state in one reducer, which looks accidental
- `src/App.jsx` now hides the navbar on `/login`; older notes or assumptions
  that it always renders are stale
- Some feature API services use the shared `src/services/axios.js`, while newer
  ones such as `slideService.js` create their own Axios instance from
  `src/config/constants.js`

Backend quirks:

- Some service files are thin or out of sync with controller behavior
- Slide delete route is defined as `/delete/:id`, but the frontend service currently calls `/slides/${id}`
- Upload response builds image URLs with hard-coded `http://localhost:3500`
- `src/startup/db.js` uses older Mongoose connection options
- `slidesController.updateSlide` takes `:id` in the route but uses
  `req.body.data._id` for the update lookup
- `slidesController.deleteSlideById` calls `successResponse` with the message as
  the payload, which may not match the expected helper signature

These are worth keeping in mind so new feature work does not copy unstable patterns blindly.

## Recommended Pattern For New Features

For a new CRUD-style feature:

1. Create backend model, controller, and route
2. Register route in `slides-be/src/startup/routes.js`
3. Add frontend API service module under `slides-fe/src/services/apis`
4. Add page/component under `slides-fe/src/features/<feature>`
5. Add route registration
6. Add Redux slice only if selection state, current record state, or cross-page state is needed
7. Add menu wiring if the feature should be reachable from the navbar

For a small UI-only feature:

1. Start in the owning feature folder
2. Reuse existing shared controls from `slides-fe/src/components`
3. Avoid adding Redux unless local component state is no longer enough

## Good Files To Open First

- `slides/slides-fe/src/main.jsx`
- `slides/slides-fe/src/routes/index.jsx`
- `slides/slides-fe/src/store/rootReducer.js`
- `slides/slides-fe/src/services/apis/slideService.js`
- `slides/slides-fe/src/features/slides/create.slides.jsx`
- `slides/slides-be/index.js`
- `slides/slides-be/src/startup/routes.js`
- `slides/slides-be/src/controllers/slidesController.js`
- `slides/slides-be/src/models/slide.model.js`

## Suggested Next Step

Before building the next feature, choose whether we want to:

- follow the current lightweight patterns for speed, or
- first normalize auth, API base URLs, and a couple of broken service calls to reduce future friction

Either approach is workable, but the first is faster while the second will make later feature work smoother.
