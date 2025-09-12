#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing FabManage Component Generator Plugin...\n');

// Test configuration
const tests = [
    {
        name: 'Manifest Validation',
        test: () => {
            const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
            const requiredFields = ['name', 'id', 'api', 'main', 'ui'];

            for (const field of requiredFields) {
                if (!manifest[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }

            return 'Valid manifest.json';
        }
    },
    {
        name: 'Code.js Syntax Check',
        test: () => {
            const code = fs.readFileSync('code.js', 'utf8');

            // Basic syntax checks
            if (!code.includes('figma.ui.onmessage')) {
                throw new Error('Missing message handler');
            }

            if (!code.includes('FigmaComponentGenerator')) {
                throw new Error('Missing main class');
            }

            if (!code.includes('generateComponents')) {
                throw new Error('Missing main method');
            }

            return 'Valid code.js structure';
        }
    },
    {
        name: 'UI.html Structure Check',
        test: () => {
            const ui = fs.readFileSync('ui.html', 'utf8');

            // Check for required elements
            const requiredElements = [
                'file-input',
                'generate-btn',
                'component-list',
                'status'
            ];

            for (const element of requiredElements) {
                if (!ui.includes(`id="${element}"`)) {
                    throw new Error(`Missing required UI element: ${element}`);
                }
            }

            return 'Valid UI structure';
        }
    },
    {
        name: 'Sample SVG Validation',
        test: () => {
            const sampleSvg = fs.readFileSync('examples/sample-components.svg', 'utf8');

            // Check for required SVG structure
            if (!sampleSvg.includes('<g id=')) {
                throw new Error('Missing group elements with IDs');
            }

            if (!sampleSvg.includes('project-card')) {
                throw new Error('Missing test organism');
            }

            if (!sampleSvg.includes('status-badge')) {
                throw new Error('Missing test atom');
            }

            return 'Valid sample SVG';
        }
    },
    {
        name: 'Plugin Dependencies Check',
        test: () => {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

            if (!packageJson.name) {
                throw new Error('Missing package name');
            }

            if (!packageJson.figma) {
                throw new Error('Missing Figma configuration');
            }

            return 'Valid package.json';
        }
    }
];

// Run tests
let passed = 0;
let failed = 0;

console.log('Running tests...\n');

for (const test of tests) {
    try {
        const result = test.test();
        console.log(`✅ ${test.name}: ${result}`);
        passed++;
    } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
        failed++;
    }
}

console.log(`\n📊 Test Results:`);
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed > 0) {
    console.log('\n❌ Some tests failed. Please fix the issues before using the plugin.');
    process.exit(1);
} else {
    console.log('\n🎉 All tests passed! Plugin is ready to use.');
}

// Additional checks
console.log('\n🔍 Additional Checks...');

// Check file sizes
const files = ['manifest.json', 'code.js', 'ui.html'];
for (const file of files) {
    const stats = fs.statSync(file);
    const sizeInKB = Math.round(stats.size / 1024);
    console.log(`📁 ${file}: ${sizeInKB} KB`);

    if (sizeInKB > 1000) {
        console.log(`⚠️  Warning: ${file} is quite large (${sizeInKB} KB)`);
    }
}

// Check for common issues
console.log('\n🔍 Checking for common issues...');

// Check if code.js has proper error handling
const code = fs.readFileSync('code.js', 'utf8');
if (!code.includes('try') || !code.includes('catch')) {
    console.log('⚠️  Warning: Code might be missing error handling');
}

// Check if UI has proper event listeners
const ui = fs.readFileSync('ui.html', 'utf8');
if (!ui.includes('addEventListener')) {
    console.log('⚠️  Warning: UI might be missing event listeners');
}

console.log('\n✨ Plugin testing completed!');
console.log('\n🚀 Ready to install and use the plugin!');
