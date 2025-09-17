#!/bin/bash

# FabManage Comprehensive Testing Script
# This script runs all types of tests to verify the application

set -e

echo "🧪 FabManage Comprehensive Testing"
echo "=================================="

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

# Function to run tests with error handling
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo ""
    print_status "INFO" "Running $test_name..."
    
    if eval "$test_command"; then
        print_status "SUCCESS" "$test_name passed"
        return 0
    else
        print_status "ERROR" "$test_name failed"
        return 1
    fi
}

# Track overall test results
OVERALL_RESULT=0

echo "🔍 Pre-test checks..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "WARNING" "Dependencies not installed. Installing..."
    npm install
fi

# Check if build works
print_status "INFO" "Checking if application builds..."
if npm run build; then
    print_status "SUCCESS" "Build successful"
else
    print_status "ERROR" "Build failed"
    exit 1
fi

echo ""
echo "🧪 Running all test suites..."
echo "=============================="

# 1. Type checking
run_test "TypeScript Type Checking" "npm run type-check" || OVERALL_RESULT=1

# 2. Linting
run_test "ESLint Code Quality" "npm run lint" || OVERALL_RESULT=1

# 3. Unit and Integration Tests
run_test "Unit & Integration Tests" "npm run test" || OVERALL_RESULT=1

# 4. Test Coverage
print_status "INFO" "Running test coverage..."
if npm run test:coverage; then
    print_status "SUCCESS" "Test coverage generated"
else
    print_status "WARNING" "Test coverage failed (non-critical)"
fi

# 5. End-to-End Tests (if Playwright is available)
if command -v npx &> /dev/null && npx playwright --version &> /dev/null; then
    run_test "End-to-End Tests" "npm run test:e2e" || OVERALL_RESULT=1
else
    print_status "WARNING" "Playwright not available, skipping E2E tests"
fi

# 6. Bundle Analysis
print_status "INFO" "Analyzing bundle size..."
if npm run analyze; then
    print_status "SUCCESS" "Bundle analysis completed"
else
    print_status "WARNING" "Bundle analysis failed (non-critical)"
fi

# 7. Security Audit
print_status "INFO" "Running security audit..."
if npm audit --audit-level=moderate; then
    print_status "SUCCESS" "No security vulnerabilities found"
else
    print_status "WARNING" "Security vulnerabilities found (check npm audit)"
fi

echo ""
echo "📊 Test Results Summary"
echo "======================="

if [ $OVERALL_RESULT -eq 0 ]; then
    print_status "SUCCESS" "All critical tests passed! 🎉"
    echo ""
    echo "🚀 The application is ready for:"
    echo "   • Development: npm run dev"
    echo "   • Production: npm run build"
    echo "   • Deployment: ./scripts/deploy-production.sh"
else
    print_status "ERROR" "Some tests failed. Please review the output above."
    echo ""
    echo "🔧 Common fixes:"
    echo "   • Fix TypeScript errors: npm run type-check"
    echo "   • Fix linting issues: npm run lint:fix"
    echo "   • Fix test failures: npm run test"
    echo "   • Update dependencies: npm update"
fi

echo ""
echo "📈 Next Steps:"
echo "   1. Review any warnings or errors above"
echo "   2. Fix critical issues before deployment"
echo "   3. Run individual test suites as needed:"
echo "      • npm run test (unit tests)"
echo "      • npm run test:e2e (E2E tests)"
echo "      • npm run lint (code quality)"
echo "      • npm run type-check (type safety)"

exit $OVERALL_RESULT
