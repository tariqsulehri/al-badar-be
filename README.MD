# Slides Deployment

This repo has two Docker images:

- `tariqsulehri/slides-fe:latest`
- `tariqsulehri/slides-be:latest`

## Build the images

Run these from the repo root:

```bash
docker build -t tariqsulehri/slides-fe:latest ./slides/slides-fe
docker build -t tariqsulehri/slides-be:latest ./slides/slides-be
```

## Push the images

```bash
docker push tariqsulehri/slides-fe:latest
docker push tariqsulehri/slides-be:latest
```

## Start the stack

Use the root `docker-compose.yml` to bring up MongoDB, the backend, and the frontend:

```bash
docker compose up -d
```

## Notes

- The backend connects to MongoDB at `mongodb://mongo:27017/abdata`.
- The frontend is built with `VITE_APP_API_BASE_URL=http://localhost:3500/api`.
- If you deploy behind a domain or reverse proxy, update the frontend API base URL before building the image.
