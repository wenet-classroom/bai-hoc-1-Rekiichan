#!/bin/bash
set -e

echo "Testing Module 07: VM Deployment"

echo "Checking deploy.sh exists..."
[ -f "starter/deploy.sh" ] || { echo "FAILED: deploy.sh not found"; exit 1; }

echo "Checking docker-compose.prod.yml exists..."
[ -f "starter/docker-compose.prod.yml" ] || { echo "FAILED: docker-compose.prod.yml not found"; exit 1; }

echo "Checking deploy.sh contains docker commands..."
grep -q "docker" starter/deploy.sh || { echo "FAILED: No docker commands in deploy.sh"; exit 1; }

echo "Checking production config..."
grep -qi "production\|prod" starter/docker-compose.prod.yml || echo "WARNING: No production indicators"

echo "PASSED: Deployment files validated"
exit 0
