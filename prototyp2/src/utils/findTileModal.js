// Script to find TileEditModal usage in ProjektDetail.tsx
const fs = require('fs');

const content = fs.readFileSync('/components/sections/ProjektDetail.tsx', 'utf8');
const lines = content.split('\n');
const modalLines = lines.filter((line, index) => 
  line.includes('TileEditModal') || line.includes('materials='));

modalLines.forEach((line, index) => {
  console.log(`Line: ${line.trim()}`);
});