#!/usr/bin/env node

/**
 * Test Runner for TimelineX
 * Runs unit, integration, and E2E tests
 */

const { execSync } = require('child_process');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${colors.bold}${colors.blue}Running: ${description}${colors.reset}`);
  log(`${colors.yellow}Command: ${command}${colors.reset}\n`);
  
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`${colors.green}✓ ${description} completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    log(`${colors.red}✗ ${description} failed${colors.reset}`);
    log(`${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function main() {
  log(`${colors.bold}${colors.blue}TimelineX Test Suite${colors.reset}`);
  log(`${colors.yellow}========================${colors.reset}\n`);

  const results = {
    unit: false,
    integration: false,
    e2e: false,
  };

  // Run unit tests
  results.unit = runCommand(
    'npm run test -- --testPathPattern="__tests__" --passWithNoTests',
    'Unit Tests'
  );

  // Run integration tests
  results.integration = runCommand(
    'npm run test -- --testPathPattern="Integration" --passWithNoTests',
    'Integration Tests'
  );

  // Run E2E tests
  results.e2e = runCommand(
    'npm run test:e2e',
    'End-to-End Tests'
  );

  // Summary
  log(`\n${colors.bold}${colors.blue}Test Results Summary${colors.reset}`);
  log(`${colors.yellow}====================${colors.reset}`);
  
  Object.entries(results).forEach(([type, passed]) => {
    const status = passed ? `${colors.green}✓ PASSED${colors.reset}` : `${colors.red}✗ FAILED${colors.reset}`;
    log(`${type.charAt(0).toUpperCase() + type.slice(1)} Tests: ${status}`);
  });

  const allPassed = Object.values(results).every(Boolean);
  
  if (allPassed) {
    log(`\n${colors.green}${colors.bold}🎉 All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    log(`\n${colors.red}${colors.bold}❌ Some tests failed${colors.reset}`);
    process.exit(1);
  }
}

main().catch((error) => {
  log(`${colors.red}Test runner error: ${error.message}${colors.reset}`);
  process.exit(1);
});

