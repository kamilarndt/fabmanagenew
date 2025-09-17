#!/bin/bash

# FabManage Setup Verification Script
# This script verifies that all components are properly set up and working

set -e

echo "🔍 FabManage Setup Verification"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a file exists
file_exists() {
    [ -f "$1" ]
}

# Function to check if a directory exists
dir_exists() {
    [ -d "$1" ]
}

OVERALL_STATUS=0

echo "🔧 Checking system requirements..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_status "SUCCESS" "Node.js installed: $NODE_VERSION"
    
    # Check version
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_status "SUCCESS" "Node.js version is compatible (18+)"
    else
        print_status "ERROR" "Node.js version 18+ required, found: $NODE_VERSION"
        OVERALL_STATUS=1
    fi
else
    print_status "ERROR" "Node.js is not installed"
    OVERALL_STATUS=1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_status "SUCCESS" "npm installed: $NPM_VERSION"
else
    print_status "ERROR" "npm is not installed"
    OVERALL_STATUS=1
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_status "SUCCESS" "Git installed: $GIT_VERSION"
else
    print_status "WARNING" "Git is not installed (optional for development)"
fi

echo ""
echo "📁 Checking project structure..."

# Check essential files
ESSENTIAL_FILES=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "index.html"
    "src/main.tsx"
    "src/App.tsx"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if file_exists "$file"; then
        print_status "SUCCESS" "Found: $file"
    else
        print_status "ERROR" "Missing: $file"
        OVERALL_STATUS=1
    fi
done

# Check essential directories
ESSENTIAL_DIRS=(
    "src"
    "src/components"
    "src/pages"
    "src/stores"
    "src/types"
    "src/hooks"
    "src/utils"
)

for dir in "${ESSENTIAL_DIRS[@]}"; do
    if dir_exists "$dir"; then
        print_status "SUCCESS" "Found directory: $dir"
    else
        print_status "ERROR" "Missing directory: $dir"
        OVERALL_STATUS=1
    fi
done

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exists
if dir_exists "node_modules"; then
    print_status "SUCCESS" "Dependencies installed (node_modules exists)"
    
    # Check for key dependencies
    KEY_DEPENDENCIES=(
        "react"
        "react-dom"
        "antd"
        "@ant-design/icons"
        "react-router-dom"
        "@tanstack/react-query"
        "zustand"
    )
    
    for dep in "${KEY_DEPENDENCIES[@]}"; do
        if dir_exists "node_modules/$dep"; then
            print_status "SUCCESS" "Dependency installed: $dep"
        else
            print_status "ERROR" "Missing dependency: $dep"
            OVERALL_STATUS=1
        fi
    done
else
    print_status "WARNING" "Dependencies not installed (run: npm install)"
    OVERALL_STATUS=1
fi

echo ""
echo "🧪 Checking test setup..."

# Check test configuration files
TEST_FILES=(
    "vitest.config.ts"
    "playwright.config.ts"
)

for file in "${TEST_FILES[@]}"; do
    if file_exists "$file"; then
        print_status "SUCCESS" "Test config found: $file"
    else
        print_status "WARNING" "Test config missing: $file"
    fi
done

# Check if test directories exist
if dir_exists "src/test"; then
    print_status "SUCCESS" "Test directory exists: src/test"
else
    print_status "WARNING" "Test directory missing: src/test"
fi

if dir_exists "tests"; then
    print_status "SUCCESS" "E2E test directory exists: tests"
else
    print_status "WARNING" "E2E test directory missing: tests"
fi

echo ""
echo "🚀 Checking deployment setup..."

# Check deployment files
DEPLOYMENT_FILES=(
    "Dockerfile.production"
    "k8s/namespace.yaml"
    "k8s/deployment.yaml"
    "k8s/service.yaml"
    "k8s/ingress.yaml"
    "scripts/deploy-production.sh"
)

for file in "${DEPLOYMENT_FILES[@]}"; do
    if file_exists "$file"; then
        print_status "SUCCESS" "Deployment file found: $file"
    else
        print_status "WARNING" "Deployment file missing: $file"
    fi
done

# Check monitoring setup
if dir_exists "monitoring"; then
    print_status "SUCCESS" "Monitoring configuration exists"
else
    print_status "WARNING" "Monitoring configuration missing"
fi

echo ""
echo "📊 Checking module implementations..."

# Check if all module pages exist
MODULE_PAGES=(
    "src/pages/Materials.tsx"
    "src/pages/Tiles.tsx"
    "src/pages/Pricing.tsx"
    "src/pages/Logistics.tsx"
    "src/pages/Accommodation.tsx"
    "src/pages/Files.tsx"
    "src/pages/Concepts.tsx"
    "src/pages/Documents.tsx"
    "src/pages/Messaging.tsx"
)

for page in "${MODULE_PAGES[@]}"; do
    if file_exists "$page"; then
        print_status "SUCCESS" "Module page found: $(basename $page)"
    else
        print_status "ERROR" "Module page missing: $(basename $page)"
        OVERALL_STATUS=1
    fi
done

# Check if all stores exist
STORE_FILES=(
    "src/stores/materialsStore.ts"
    "src/stores/tilesStore.ts"
    "src/stores/pricingStore.ts"
    "src/stores/logisticsStore.ts"
    "src/stores/accommodationStore.ts"
    "src/stores/filesStore.ts"
    "src/stores/conceptStore.ts"
    "src/stores/documentsStore.ts"
    "src/stores/messagingStore.ts"
)

for store in "${STORE_FILES[@]}"; do
    if file_exists "$store"; then
        print_status "SUCCESS" "Store found: $(basename $store)"
    else
        print_status "ERROR" "Store missing: $(basename $store)"
        OVERALL_STATUS=1
    fi
done

echo ""
echo "🎯 Final Verification Summary"
echo "============================="

if [ $OVERALL_STATUS -eq 0 ]; then
    print_status "SUCCESS" "All checks passed! 🎉"
    echo ""
    echo "🚀 Your FabManage setup is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Start development: ./scripts/start-dev.sh"
    echo "2. Run tests: ./scripts/test-all.sh"
    echo "3. Build for production: npm run build"
    echo "4. Deploy: ./scripts/deploy-production.sh"
else
    print_status "ERROR" "Some checks failed. Please fix the issues above."
    echo ""
    echo "🔧 Common fixes:"
    echo "1. Install dependencies: npm install"
    echo "2. Check file paths and structure"
    echo "3. Verify all required files are present"
    echo "4. Run setup again after fixes"
fi

echo ""
echo "📚 For more information:"
echo "• README.md - Project overview and setup"
echo "• PRODUCTION-DEPLOYMENT-GUIDE.md - Deployment instructions"
echo "• tests/README.md - Testing guide"

exit $OVERALL_STATUS
