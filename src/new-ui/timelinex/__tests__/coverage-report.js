#!/usr/bin/env node

/**
 * Coverage Report Generator for TimelineX
 * Generates detailed coverage reports and analysis
 */

const fs = require('fs');
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

function generateCoverageReport() {
  log(`${colors.bold}${colors.blue}TimelineX Coverage Report${colors.reset}`);
  log(`${colors.yellow}============================${colors.reset}\n`);

  const coverageDir = path.join(process.cwd(), 'coverage');
  const coverageFile = path.join(coverageDir, 'coverage-summary.json');

  if (!fs.existsSync(coverageFile)) {
    log(`${colors.red}Coverage file not found. Run tests with coverage first.${colors.reset}`);
    return;
  }

  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
  const total = coverage.total;

  log(`${colors.bold}Overall Coverage:${colors.reset}`);
  log(`  Lines: ${formatPercentage(total.lines.pct)}`);
  log(`  Functions: ${formatPercentage(total.functions.pct)}`);
  log(`  Branches: ${formatPercentage(total.branches.pct)}`);
  log(`  Statements: ${formatPercentage(total.statements.pct)}\n`);

  // Check coverage thresholds
  const thresholds = {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  };

  let allThresholdsMet = true;

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const actual = total[metric].pct;
    const status = actual >= threshold ? 
      `${colors.green}✓ PASSED${colors.reset}` : 
      `${colors.red}✗ FAILED${colors.reset}`;
    
    log(`${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${formatPercentage(actual)} (threshold: ${threshold}%) ${status}`);
    
    if (actual < threshold) {
      allThresholdsMet = false;
    }
  });

  // File-by-file analysis
  log(`\n${colors.bold}File-by-File Coverage:${colors.reset}`);
  log(`${colors.yellow}=====================${colors.reset}`);

  Object.entries(coverage).forEach(([filePath, metrics]) => {
    if (filePath === 'total') return;

    const relativePath = filePath.replace(process.cwd(), '');
    const lines = formatPercentage(metrics.lines.pct);
    const functions = formatPercentage(metrics.functions.pct);
    const branches = formatPercentage(metrics.branches.pct);
    const statements = formatPercentage(metrics.statements.pct);

    log(`\n${colors.blue}${relativePath}${colors.reset}`);
    log(`  Lines: ${lines}, Functions: ${functions}, Branches: ${branches}, Statements: ${statements}`);

    // Highlight low coverage files
    if (metrics.lines.pct < 70) {
      log(`  ${colors.red}⚠️  Low coverage detected${colors.reset}`);
    }
  });

  // Recommendations
  log(`\n${colors.bold}${colors.blue}Recommendations:${colors.reset}`);
  log(`${colors.yellow}===============${colors.reset}`);

  if (!allThresholdsMet) {
    log(`${colors.red}• Increase test coverage to meet thresholds${colors.reset}`);
  }

  if (total.lines.pct < 90) {
    log(`${colors.yellow}• Consider adding more unit tests for better coverage${colors.reset}`);
  }

  if (total.branches.pct < 80) {
    log(`${colors.yellow}• Add tests for edge cases and conditional branches${colors.reset}`);
  }

  if (total.functions.pct < 90) {
    log(`${colors.yellow}• Ensure all functions are tested${colors.reset}`);
  }

  log(`\n${colors.green}Coverage report generated successfully!${colors.reset}`);
}

function formatPercentage(value) {
  const color = value >= 80 ? colors.green : value >= 60 ? colors.yellow : colors.red;
  return `${color}${value.toFixed(1)}%${colors.reset}`;
}

generateCoverageReport();

