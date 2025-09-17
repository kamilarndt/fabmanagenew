#!/bin/bash

# FabManage Development Startup Script
# This script sets up and starts the development environment

set -e

echo "🚀 Starting FabManage Development Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# FabManage Environment Variables
VITE_APP_NAME=FabManage
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Development settings
VITE_DEBUG=true
VITE_MOCK_API=true
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
fi

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check
echo "✅ Type checking passed"

# Run linting
echo "🔍 Running ESLint..."
npm run lint
echo "✅ Linting passed"

# Start development server
echo "🌐 Starting development server..."
echo "Application will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
