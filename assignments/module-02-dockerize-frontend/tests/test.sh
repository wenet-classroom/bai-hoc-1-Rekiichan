#!/bin/bash
set -e

echo "Testing Module 02: Dockerize Frontend"

echo "Building Docker image..."
docker build -t module-02-test .

echo "Starting container..."
CONTAINER_ID=$(docker run -d -p 8081:80 module-02-test)
sleep 5

echo "Testing HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/)

echo "Checking image size..."
IMAGE_SIZE=$(docker image inspect module-02-test --format='{{.Size}}')
IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))
echo "Image size: ${IMAGE_SIZE_MB}MB"

echo "Cleaning up..."
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID
docker rmi module-02-test

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "PASSED: Frontend accessible (HTTP $HTTP_CODE)"
  exit 0
else
  echo "FAILED: Frontend returned HTTP $HTTP_CODE"
  exit 1
fi
