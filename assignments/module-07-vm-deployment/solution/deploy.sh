#!/bin/bash
# Module 07: Deployment Script - Solution
set -e

echo "Starting deployment..."

APP_DIR="/app"
COMPOSE_FILE="docker-compose.yml"
PROD_FILE="docker-compose.prod.yml"

echo "Pulling latest changes..."
cd "$APP_DIR"
git pull origin main

echo "Building and starting services..."
docker compose -f "$COMPOSE_FILE" -f "$PROD_FILE" up -d --build

echo "Waiting for services to start..."
sleep 30

echo "Running health checks..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "Health check passed"
else
  echo "Health check failed (HTTP $HTTP_CODE)"
  docker compose logs
  exit 1
fi

echo "Checking all services..."
docker compose ps

echo "Deployment complete!"
