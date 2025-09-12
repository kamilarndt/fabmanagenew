#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Build configuration
const config = {
    srcDir: __dirname + '/..',
    distDir: __dirname + '/../dist',
    pluginName: 'fabmanage-advanced-generator',
    version: '2.0.0'
};

// Ensure dist directory exists
if (!fs.existsSync(config.distDir)) {
    fs.mkdirSync(config.distDir, { recursive: true });
}

console.log('🚀 Building FabManage Advanced Component Generator V2...');

// Copy plugin files to dist
const filesToCopy = [
    'code.js',
    'ui.html',
    'manifest.json',
    'package.json',
    'README.md'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(config.srcDir, file);
    const distPath = path.join(config.distDir, file);

    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, distPath);
        console.log(`✅ Copied ${file}`);
    } else {
        console.warn(`⚠️  File not found: ${file}`);
    }
});

// Create ZIP package
const zipPath = path.join(config.srcDir, `${config.pluginName}-v${config.version}.zip`);
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`📦 Created plugin package: ${config.pluginName}-v${config.version}.zip`);
    console.log(`📁 Size: ${archive.pointer()} bytes`);
    console.log('🎉 Build complete!');
});

archive.on('error', (err) => {
    console.error('❌ Archive error:', err);
    process.exit(1);
});

archive.pipe(output);

// Add files to archive
filesToCopy.forEach(file => {
    const filePath = path.join(config.distDir, file);
    if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
    }
});

archive.finalize();
