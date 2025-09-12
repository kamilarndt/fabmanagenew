#!/bin/bash

# FabManage Demo Data Generator
# Bash script to generate comprehensive demo data

echo "🎬 FABMANAGE DEMO DATA GENERATOR"
echo "================================="
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if we're in the right directory
if [ ! -f "generate-demo-library.js" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

echo "🚀 Starting demo data generation..."
echo ""

# Run the demo data generator
if node generate-demo-library.js; then
    echo ""
    echo "✅ Demo data generation completed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Start the backend server: npm start"
    echo "   2. Open the frontend application"
    echo "   3. Explore the demo data in the UI"
    echo ""
    echo "📊 Available demo scenarios:"
    echo "   • Teatr Narodowy - Scenografia 'Wesele'"
    echo "   • Orange Festival - Scena główna"
    echo "   • Muzeum Łazienki - Wystawa"
    echo "   • IKEA Showroom - Kuchnia demonstracyjna"
    echo "   • Zarządzanie magazynem - Alerty stanów"
    echo ""
else
    echo "❌ Error generating demo data"
    exit 1
fi

