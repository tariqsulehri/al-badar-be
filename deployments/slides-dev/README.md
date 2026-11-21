# Slides Development Deployment (`slides-dev`)

Development environment folder for target VM `167.86.122.141`.

## Ports & Architecture
- **Frontend Container**: `slides-dev-frontend` &rarr; `127.0.0.1:3001:80`
- **Backend Container**: `slides-dev-backend` &rarr; `127.0.0.1:3501:3500`
- **Database**: Local host MongoDB `mongodb://host.docker.internal:27017/abdata_dev`
- **Uploads**: `./uploads` &rarr; `/app/public/uploads/slides/images`

> Note: Running on ports 3001 and 3501 allows both `slides-dev` and `slides-prod` to run simultaneously on the same VM with zero port conflicts.

## Commands
```bash
./deploy.sh                # Deploy latest dev build
./deploy.sh status         # Check container health and status
./deploy.sh logs backend   # Tail dev backend logs
./deploy.sh restart        # Restart containers
./deploy.sh stop           # Stop containers
```
