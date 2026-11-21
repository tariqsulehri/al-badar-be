# Slides Production Deployment (`slides-prod`)

Production environment folder for target VM `167.86.122.141`.

## Ports & Architecture
- **Frontend Container**: `slides-prod-frontend` &rarr; `127.0.0.1:3000:80`
- **Backend Container**: `slides-prod-backend` &rarr; `127.0.0.1:3500:3500`
- **Database**: Local host MongoDB `mongodb://host.docker.internal:27017/abdata`
- **Uploads**: `./uploads` &rarr; `/app/public/uploads/slides/images`

## Commands
```bash
./deploy.sh                # Deploy latest production build
./deploy.sh status         # Check container health and status
./deploy.sh logs backend   # Tail backend logs
./deploy.sh backup         # Run manual MongoDB backup
./deploy.sh restart        # Restart containers
./deploy.sh stop           # Stop containers
```
