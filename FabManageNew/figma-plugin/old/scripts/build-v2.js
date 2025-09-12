#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building FabManage Advanced Component Generator V2...\n');

// Check if required files exist
const requiredFiles = [
    'manifest-v2.json',
    'code-v2.js',
    'ui-v2.html'
];

console.log('📋 Checking required files...');
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`❌ Missing required file: ${file}`);
        process.exit(1);
    }
    console.log(`✅ ${file}`);
}

// Validate manifest-v2.json
console.log('\n📋 Validating manifest-v2.json...');
try {
    const manifest = JSON.parse(fs.readFileSync('manifest-v2.json', 'utf8'));

    const requiredFields = ['name', 'id', 'api', 'main', 'ui'];
    for (const field of requiredFields) {
        if (!manifest[field]) {
            console.error(`❌ Missing required field in manifest-v2.json: ${field}`);
            process.exit(1);
        }
    }

    console.log('✅ manifest-v2.json is valid');
} catch (error) {
    console.error('❌ Invalid manifest-v2.json:', error.message);
    process.exit(1);
}

// Create build directory
const buildDir = 'dist-v2';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log(`✅ Created build directory: ${buildDir}`);
}

// Copy files to build directory (rename to standard names)
console.log('\n📋 Copying files to build directory...');
const filesToCopy = [
    { source: 'manifest-v2.json', dest: 'manifest.json' },
    { source: 'code-v2.js', dest: 'code.js' },
    { source: 'ui-v2.html', dest: 'ui.html' }
];

for (const file of filesToCopy) {
    const sourcePath = file.source;
    const destPath = path.join(buildDir, file.dest);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file.source} → ${file.dest}`);
}

// Create package
console.log('\n📦 Creating plugin package...');
try {
    const packageName = 'fabmanage-advanced-generator.zip';

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
const installInstructions = `# Installation Instructions - Advanced Generator V2

## Quick Install:
1. Open Figma Desktop App
2. Go to Plugins → Development → Import plugin from file
3. Select: fabmanage-advanced-generator.zip
4. Click "Import"

## Usage:
1. Open the plugin in Figma
2. Import your SVG files
3. Configure advanced settings
4. Click "Generate Advanced Components"

## New Features V2:
- ✅ Only atoms as components
- ✅ Molecules/organisms as frames
- ✅ Intelligent duplicate detection
- ✅ Tokens Studio integration
- ✅ Fixed empty components issue
- ✅ Advanced statistics and monitoring

## Requirements:
- Figma Desktop App (required)
- SVG files with proper structure
- Components with id attributes

## Support:
- Check README-v2.md for detailed documentation
- Use examples/sample-components.svg for testing
- Advanced features: Tokens Studio integration

## Key Improvements:
- 🚀 Scalable component architecture
- 🎨 Design tokens extraction
- 🔍 Duplicate detection and grouping
- 📊 Advanced statistics
- 🛠️ Fixed component generation issues
`;

fs.writeFileSync('INSTALL-v2.txt', installInstructions);
console.log('✅ Created INSTALL-v2.txt');

console.log('\n🎉 Advanced Build completed successfully!');
console.log('\n📁 Files created:');
console.log('  - fabmanage-advanced-generator.zip (advanced plugin package)');
console.log('  - dist-v2/ (build directory)');
console.log('  - INSTALL-v2.txt (installation instructions)');

console.log('\n🚀 Next steps:');
console.log('  1. Install the advanced plugin in Figma using the .zip file');
console.log('  2. Test with examples/sample-components.svg');
console.log('  3. Experience the new atomic design approach');
console.log('  4. Generate Tokens Studio JSON');
console.log('  5. Integrate with your design system!');

console.log('\n✨ Advanced Component Generation Ready!');
console.log('🎯 Atoms as Components • Molecules/Organisms as Frames • Tokens Studio Integration');
