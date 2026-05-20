# 🐳 Docker Setup Guide - ParkEase Parking Application

## Prerequisites
- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Build and Run with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Navigate to project directory
cd /path/to/Parkingfinal

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the Docker image
docker build -t parking-app:latest .

# Run the container
docker run -d \
  --name parking-app \
  -p 80:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  parking-app:latest

# View logs
docker logs -f parking-app

# Stop the container
docker stop parking-app
docker rm parking-app
```

## Access the Application

Once running, access the application at:
- **Local**: `http://localhost`
- **Remote Server**: `http://<server-ip>`

## Default Login Credentials

- **Email**: `demo@parkease.com`
- **Password**: `demo123`

## Container Details

### Image
- **Base**: `nginx:alpine` (lightweight web server)
- **Size**: ~40-50 MB

### Ports
- **HTTP**: 80 (mapped to container port 80)
- **HTTPS**: 443 (available for SSL/TLS setup)

### Features
- ✅ Health check enabled
- ✅ Gzip compression
- ✅ Security headers configured
- ✅ Static asset caching
- ✅ Auto-restart on failure
- ✅ Volume mounting for live updates

## Environment Variables

Currently, none are required. The application uses client-side storage (localStorage) for data persistence.

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
# Change "80:80" to "8080:80" for example
docker-compose down
docker-compose up -d
```

### View Container Logs
```bash
docker-compose logs -f parkingapp
```

### Access Container Shell
```bash
docker-compose exec parkingapp sh
```

### Check Container Status
```bash
docker-compose ps
docker stats
```

## Production Considerations

### SSL/TLS Setup
1. Add your SSL certificates to a `certs/` directory
2. Update `nginx.conf` to include SSL configuration
3. Map the certs volume in `docker-compose.yml`

### Database Integration
If you plan to add a backend:
```yaml
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: parking_db
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - parking-network

volumes:
  db_data:
```

### Reverse Proxy (Traefik/Nginx)
Place behind a reverse proxy for:
- Load balancing
- SSL termination
- Virtual hosting

## Deployment Options

### Docker Hub
```bash
# Tag image
docker tag parking-app:latest username/parking-app:latest

# Push to Docker Hub
docker push username/parking-app:latest
```

### Kubernetes
See `k8s-deployment.yaml` for Kubernetes deployment setup.

### Cloud Platforms
- **AWS**: Use ECS or Fargate
- **Azure**: Use Container Instances or App Service
- **Google Cloud**: Use Cloud Run or Kubernetes Engine
- **DigitalOcean**: Use App Platform

## Health Check

The container includes an automated health check that verifies the application is running:
```
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove unused images
docker image prune

# Remove all containers and images
docker-compose down --rmi all
```

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Verify file permissions
- Ensure ports are not blocked by firewall
- Check Docker daemon is running
