#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Building FabManage Component Generator Plugin...\n');

// Check if required files exist
const requiredFiles = [
    'manifest.json',
    'code.js',
    'ui.html'
];

console.log('📋 Checking required files...');
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`❌ Missing required file: ${file}`);
        process.exit(1);
    }
    console.log(`✅ ${file}`);
}

// Validate manifest.json
console.log('\n📋 Validating manifest.json...');
try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    const requiredFields = ['name', 'id', 'api', 'main', 'ui'];
    for (const field of requiredFields) {
        if (!manifest[field]) {
            console.error(`❌ Missing required field in manifest.json: ${field}`);
            process.exit(1);
        }
    }

    console.log('✅ manifest.json is valid');
} catch (error) {
    console.error('❌ Invalid manifest.json:', error.message);
    process.exit(1);
}

// Create build directory
const buildDir = 'dist';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log(`✅ Created build directory: ${buildDir}`);
}

// Copy files to build directory
console.log('\n📋 Copying files to build directory...');
const filesToCopy = ['manifest.json', 'code.js', 'ui.html'];

for (const file of filesToCopy) {
    const sourcePath = file;
    const destPath = path.join(buildDir, file);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
}

// Create package
console.log('\n📦 Creating plugin package...');
try {
    const packageName = 'fabmanage-component-generator.zip';

    // Remove existing package
    if (fs.existsSync(packageName)) {
        fs.unlinkSync(packageName);
    }

    // Create zip package (Windows compatible)
    try {
        execSync(`cd ${buildDir} && powershell Compress-Archive -Path * -DestinationPath ../${packageName}`, { stdio: 'inherit' });
    } catch (error) {
        // Fallback: create a simple tar archive
        console.log('⚠️  Using fallback method to create package...');
        execSync(`cd ${buildDir} && tar -czf ../${packageName.replace('.zip', '.tar.gz')} .`, { stdio: 'inherit' });
        console.log('📦 Created .tar.gz package instead of .zip');
    }

    console.log(`✅ Created package: ${packageName}`);

    // Get package size
    const stats = fs.statSync(packageName);
    const sizeInKB = Math.round(stats.size / 1024);
    console.log(`📊 Package size: ${sizeInKB} KB`);

} catch (error) {
    console.error('❌ Error creating package:', error.message);
    process.exit(1);
}

// Create installation instructions
console.log('\n📋 Creating installation instructions...');
const installInstructions = `# Installation Instructions

## Quick Install:
1. Open Figma Desktop App
2. Go to Plugins → Development → Import plugin from file
3. Select: fabmanage-component-generator.zip
4. Click "Import"

## Usage:
1. Open the plugin in Figma
2. Import your SVG files
3. Configure settings
4. Click "Generate Components in Figma"

## Requirements:
- Figma Desktop App (required)
- SVG files with proper structure
- Components with id attributes

## Support:
- Check README.md for detailed documentation
- Use examples/sample-components.svg for testing
`;

fs.writeFileSync('INSTALL.txt', installInstructions);
console.log('✅ Created INSTALL.txt');

console.log('\n🎉 Build completed successfully!');
console.log('\n📁 Files created:');
console.log('  - fabmanage-component-generator.zip (plugin package)');
console.log('  - dist/ (build directory)');
console.log('  - INSTALL.txt (installation instructions)');

console.log('\n🚀 Next steps:');
console.log('  1. Install the plugin in Figma using the .zip file');
console.log('  2. Test with examples/sample-components.svg');
console.log('  3. Import your own SVG components');
console.log('  4. Generate components in Figma!');

console.log('\n✨ Happy Component Generating!');
