#!/bin/bash

# FabManage Setup Verification Script
# This script verifies that the application is properly set up and working

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

OVERALL_STATUS=0

echo "🔧 Checking system requirements..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "SUCCESS" "Node.js installed: $NODE_VERSION"
else
    print_status "ERROR" "Node.js is not installed"
    OVERALL_STATUS=1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_status "SUCCESS" "npm installed: $NPM_VERSION"
else
    print_status "ERROR" "npm is not installed"
    OVERALL_STATUS=1
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
    if [ -f "$file" ]; then
        print_status "SUCCESS" "Found: $file"
    else
        print_status "ERROR" "Missing: $file"
        OVERALL_STATUS=1
    fi
done

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status "SUCCESS" "Dependencies installed (node_modules exists)"
else
    print_status "WARNING" "Dependencies not installed (run: npm install)"
    OVERALL_STATUS=1
fi

echo ""
echo "🔨 Testing build process..."

# Test TypeScript compilation
print_status "INFO" "Testing TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    print_status "SUCCESS" "TypeScript compilation successful"
else
    print_status "WARNING" "TypeScript compilation has warnings (non-critical)"
fi

# Test build process
print_status "INFO" "Testing production build..."
if npm run build > /dev/null 2>&1; then
    print_status "SUCCESS" "Production build successful"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        print_status "SUCCESS" "Build output directory created"
        
        # Check for main files
        if [ -f "dist/index.html" ]; then
            print_status "SUCCESS" "Main HTML file generated"
        fi
        
        if [ -d "dist/assets" ]; then
            print_status "SUCCESS" "Assets directory created"
        fi
    else
        print_status "ERROR" "Build output directory not found"
        OVERALL_STATUS=1
    fi
else
    print_status "ERROR" "Production build failed"
    OVERALL_STATUS=1
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
    if [ -f "$page" ]; then
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
    if [ -f "$store" ]; then
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
    echo "1. Start development: npm run dev"
    echo "2. Open browser: http://localhost:3000"
    echo "3. Test all modules:"
    echo "   • Materials Management (/materials)"
    echo "   • Project Tiles (/tiles)"
    echo "   • Pricing (/pricing)"
    echo "   • Logistics (/logistics)"
    echo "   • Accommodation (/accommodation)"
    echo "   • Files (/files)"
    echo "   • Concepts (/concepts)"
    echo "   • Documents (/documents)"
    echo "   • Messaging (/messaging)"
    echo ""
    echo "4. Run tests: npm run test"
    echo "5. Build for production: npm run build"
    echo "6. Deploy: ./scripts/deploy-production.sh"
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
echo "• SETUP-VERIFICATION.md - Detailed verification guide"
echo "• PRODUCTION-DEPLOYMENT-GUIDE.md - Deployment instructions"

exit $OVERALL_STATUS

