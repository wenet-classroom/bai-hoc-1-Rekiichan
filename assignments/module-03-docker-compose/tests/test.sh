#!/bin/bash
set -e

echo "Testing Module 03: Docker Compose"

echo "Validating docker-compose.yml syntax..."
docker compose -f starter/docker-compose.yml config > /dev/null 2>&1 || {
  echo "FAILED: docker-compose.yml has syntax errors"
  exit 1
}

SERVICES=$(docker compose -f starter/docker-compose.yml config --services 2>/dev/null)

echo "Checking required services..."
echo "$SERVICES" | grep -q "postgres" || { echo "FAILED: Missing postgres service"; exit 1; }
echo "$SERVICES" | grep -q "backend" || { echo "FAILED: Missing backend service"; exit 1; }
echo "$SERVICES" | grep -q "frontend" || { echo "FAILED: Missing frontend service"; exit 1; }

echo "Checking for volumes..."
docker compose -f starter/docker-compose.yml config | grep -q "volumes:" || {
  echo "WARNING: No volumes defined"
}

echo "PASSED: Docker Compose configuration is valid"
exit 0
