const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'fabmanage.db');
const db = new Database(DB_PATH);

console.log('📦 Updating material stock levels...');

// Get all materials and update their stocks
const updateStock = db.prepare('UPDATE stocks SET quantity = ?, reserved = ? WHERE material_id = ?');
const allMaterials = db.prepare('SELECT id FROM materials').all();

console.log(`Found ${allMaterials.length} materials to update`);

for (const material of allMaterials) {
    const quantity = Math.round((Math.random() * 200 + 50) * 100) / 100; // 50-250 units
    const reserved = Math.round((Math.random() * quantity * 0.2) * 100) / 100; // 0-20% reserved

    updateStock.run(quantity, reserved, material.id);
}

// Generate tiles for existing projects
console.log('🎯 Generating tiles for existing projects...');

const projects = db.prepare('SELECT * FROM projects').all();
const insTile = db.prepare('INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

const tileStages = ['design', 'cnc', 'finishing', 'assembly', 'qc', 'done'];
const tileTemplates = [
    { name: 'Panel dekoracyjny główny', desc: 'Centralny element scenografii', dims: [2000, 3000, 18] },
    { name: 'Ramka informacyjna', desc: 'Panel z tekstem i grafikami', dims: [1200, 800, 10] },
    { name: 'Postument wystawowy', desc: 'Podstawa pod eksponat', dims: [600, 600, 40] },
    { name: 'Tło sceniczne', desc: 'Większy panel tła', dims: [3000, 2400, 12] },
    { name: 'Element interaktywny', desc: 'Panel z wbudowaną elektroniką', dims: [800, 1200, 25] },
    { name: 'Listwa LED', desc: 'Obudowa na oświetlenie', dims: [2000, 50, 30] },
    { name: 'Ściana działowa', desc: 'Element konstrukcyjny', dims: [2400, 2400, 18] },
    { name: 'Skrzynia transportowa', desc: 'Opakowanie na elementy', dims: [1000, 600, 400] }
];

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const now = new Date().toISOString();
let totalTiles = 0;

for (const project of projects) {
    const tilesCount = Math.floor(Math.random() * 8) + 5; // 5-12 tiles per project

    for (let j = 0; j < tilesCount; j++) {
        const template = tileTemplates[j % tileTemplates.length];
        const tile = {
            id: uuid(),
            project_id: project.id,
            code: `${(project.project_type || 'PR').substr(0, 2).toUpperCase()}-${(j + 1).toString().padStart(3, '0')}`,
            name: template.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            stage: tileStages[Math.floor(Math.random() * tileStages.length)],
            width_mm: template.dims[0] + Math.floor(Math.random() * 400 - 200),
            height_mm: template.dims[1] + Math.floor(Math.random() * 400 - 200),
            thickness_mm: template.dims[2] + Math.floor(Math.random() * 10 - 5),
            description: template.desc
        };

        insTile.run(tile.id, tile.project_id, tile.code, tile.name, tile.quantity, tile.stage, tile.width_mm, tile.height_mm, tile.thickness_mm, tile.description, now);
        totalTiles++;
    }
}

console.log(`✅ Updated ${allMaterials.length} material stocks`);
console.log(`✅ Generated ${totalTiles} tiles for ${projects.length} projects`);

db.close();
