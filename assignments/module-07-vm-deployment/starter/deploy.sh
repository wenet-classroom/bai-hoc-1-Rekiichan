#!/bin/bash
# Module 07: VM Deployment Script
# Complete the TODOs to create a working deployment

set -e

echo "Starting deployment..."

# TODO 1: Define variables
APP_DIR="____"
COMPOSE_FILE="docker-compose.yml"
PROD_FILE="____"

# TODO 2: Pull latest code
echo "Pulling latest changes..."
____

# TODO 3: Build and start services with production config
echo "Building and starting services..."
____

# TODO 4: Wait for services to be ready
echo "Waiting for services..."
sleep ____

# TODO 5: Health check
echo "Running health check..."
____

echo "Deployment complete!"
