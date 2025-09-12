#!/bin/bash
# Bash script to start only backend (Linux/Mac)

echo "Starting FabManage backend only..."

# Stop any existing backend containers
echo "Stopping existing backend..."
docker compose -f docker/docker-compose.dev.yml stop backend
docker compose -f docker/docker-compose.dev.yml rm -f backend

# Start only backend
echo "Starting backend container..."
docker compose -f docker/docker-compose.dev.yml up -d --build backend

# Show status
echo "Backend started!"
echo "Backend: http://localhost:3001"
echo ""
echo "To view logs: docker compose -f docker/docker-compose.dev.yml logs -f backend"
echo "To stop: docker compose -f docker/docker-compose.dev.yml stop backend"

