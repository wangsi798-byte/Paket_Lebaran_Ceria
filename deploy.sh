#!/bin/bash

# Exit on any error
set -e

# Variabel
APP_NAME="sipale"
DOCKER_REPO="muji-docker"

# Build images
echo "🏗️ Building Docker Images..."
docker-compose build

# Tag images
echo "🏷️ Tagging Images..."
docker tag ${APP_NAME}-backend:latest ${DOCKER_REPO}/${APP_NAME}-backend:latest
docker tag ${APP_NAME}-frontend:latest ${DOCKER_REPO}/${APP_NAME}-frontend:latest

# Push images
echo "☁️ Pushing Images..."
docker push ${DOCKER_REPO}/${APP_NAME}-backend:latest
docker push ${DOCKER_REPO}/${APP_NAME}-frontend:latest

# Deployment info
echo "✅ Deployment Completed!"
echo "Backend: http://backend.sipale.com"
echo "Frontend: http://sipale.com"