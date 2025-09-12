#!/bin/bash

# FabManage - Optimized Development Environment
# This script starts the optimized Docker environment with Supabase

echo "🚀 Starting FabManage Optimized Development Environment..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Clean up unused images and containers
echo "🧹 Cleaning up Docker resources..."
docker system prune -f

# Start the optimized environment
echo "🏗️ Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "🎉 FabManage is ready!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:3001"
echo "Supabase DB: localhost:54322"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"

