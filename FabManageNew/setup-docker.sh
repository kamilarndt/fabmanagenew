#!/bin/bash

# FabManageNew Docker Setup Script
# This script helps you set up and run the application with Docker

set -e

echo "🚀 FabManageNew Docker Setup"
echo "=============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Supabase Configuration (optional)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Environment
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Function to show menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Start development environment (hot reload)"
    echo "2) Start production environment"
    echo "3) Stop all containers"
    echo "4) View logs"
    echo "5) Clean up (remove containers, images, volumes)"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
}

# Function to start development
start_dev() {
    echo "🔧 Starting development environment..."
    echo "📱 Application will be available at: http://localhost:3002"
    echo "🔄 Hot reload enabled"
    echo ""
    echo "Press Ctrl+C to stop"
    npm run docker:dev
}

# Function to start production
start_prod() {
    echo "🚀 Starting production environment..."
    echo "📱 Application will be available at: http://localhost:3000"
    echo "🌐 Nginx reverse proxy enabled"
    echo ""
    echo "Press Ctrl+C to stop"
    npm run docker:prod
}

# Function to stop containers
stop_containers() {
    echo "🛑 Stopping all containers..."
    npm run docker:stop
    echo "✅ Containers stopped"
}

# Function to view logs
view_logs() {
    echo "📋 Showing logs (Press Ctrl+C to exit)..."
    npm run docker:logs
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    echo "⚠️  This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        npm run docker:clean
        echo "✅ Cleanup completed"
    else
        echo "❌ Cleanup cancelled"
    fi
}

# Main menu loop
while true; do
    show_menu
    case $choice in
        1)
            start_dev
            ;;
        2)
            start_prod
            ;;
        3)
            stop_containers
            ;;
        4)
            view_logs
            ;;
        5)
            cleanup
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter a number between 1-6."
            ;;
    esac
    
    if [ $choice -eq 1 ] || [ $choice -eq 2 ]; then
        break
    fi
done
