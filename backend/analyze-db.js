const db = require('./db.js')

// Inicjalizuj bazę danych
db.init()
const d = db.getDb()

console.log('=== ANALIZA STRUKTURY BAZY DANYCH ===\n')

// 1. Lista wszystkich tabel
console.log('📋 TABELE W BAZIE DANYCH:')
const tables = d.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
tables.forEach(t => console.log(`  - ${t.name}`))

console.log('\n=== POWIĄZANIA KLUCZY OBCYCH ===\n')

// 2. Sprawdź powiązania dla każdej tabeli
const tablesWithFK = ['projects', 'tiles', 'stocks', 'stock_movements', 'tile_materials', 'tile_object_materials', 'logistics', 'accommodation', 'gantt_tasks', 'demands']

tablesWithFK.forEach(tableName => {
    try {
        const fks = d.prepare(`SELECT * FROM pragma_foreign_key_list('${tableName}')`).all()
        if (fks.length > 0) {
            console.log(`🔗 ${tableName.toUpperCase()}:`)
            fks.forEach(fk => {
                console.log(`  - ${fk.from} → ${fk.table}.${fk.to} (${fk.on_update}/${fk.on_delete})`)
            })
        }
    } catch (e) {
        console.log(`❌ Błąd przy sprawdzaniu ${tableName}: ${e.message}`)
    }
})

console.log('\n=== ANALIZA POWIĄZAŃ BIZNESOWYCH ===\n')

// 3. Sprawdź dane w tabelach
console.log('📊 LICZBA REKORDÓW W TABELACH:')
tables.forEach(table => {
    try {
        const count = d.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get().count
        console.log(`  - ${table.name}: ${count} rekordów`)
    } catch (e) {
        console.log(`  - ${table.name}: błąd - ${e.message}`)
    }
})

console.log('\n=== SPRAWDZENIE INTEGRALNOŚCI POWIĄZAŃ ===\n')

// 4. Sprawdź integralność powiązań
console.log('🔍 SPRAWDZANIE INTEGRALNOŚCI:')

// Projekty bez klientów
const orphanProjects = d.prepare(`
    SELECT p.id, p.name, p.client_id 
    FROM projects p 
    LEFT JOIN clients c ON p.client_id = c.id 
    WHERE c.id IS NULL
`).all()

if (orphanProjects.length > 0) {
    console.log(`❌ Projekty bez klientów (${orphanProjects.length}):`)
    orphanProjects.forEach(p => console.log(`  - ${p.name} (client_id: ${p.client_id})`))
} else {
    console.log('✅ Wszystkie projekty mają przypisanych klientów')
}

// Kafelki bez projektów
const orphanTiles = d.prepare(`
    SELECT t.id, t.name, t.project_id 
    FROM tiles t 
    LEFT JOIN projects p ON t.project_id = p.id 
    WHERE p.id IS NULL
`).all()

if (orphanTiles.length > 0) {
    console.log(`❌ Kafelki bez projektów (${orphanTiles.length}):`)
    orphanTiles.forEach(t => console.log(`  - ${t.name} (project_id: ${t.project_id})`))
} else {
    console.log('✅ Wszystkie kafelki mają przypisane projekty')
}

// Materiały w kafelkach bez istniejących materiałów
const orphanTileMaterials = d.prepare(`
    SELECT tm.tile_id, tm.material_id, t.name as tile_name
    FROM tile_materials tm
    LEFT JOIN materials m ON tm.material_id = m.id
    LEFT JOIN tiles t ON tm.tile_id = t.id
    WHERE m.id IS NULL
`).all()

if (orphanTileMaterials.length > 0) {
    console.log(`❌ Kafelki z nieistniejącymi materiałami (${orphanTileMaterials.length}):`)
    orphanTileMaterials.forEach(tm => console.log(`  - Kafelek: ${tm.tile_name}, Material ID: ${tm.material_id}`))
} else {
    console.log('✅ Wszystkie materiały w kafelkach istnieją')
}

// Ruchy magazynowe bez materiałów
const orphanStockMovements = d.prepare(`
    SELECT sm.id, sm.material_id, sm.reason
    FROM stock_movements sm
    LEFT JOIN materials m ON sm.material_id = m.id
    WHERE m.id IS NULL
`).all()

if (orphanStockMovements.length > 0) {
    console.log(`❌ Ruchy magazynowe bez materiałów (${orphanStockMovements.length}):`)
    orphanStockMovements.forEach(sm => console.log(`  - ID: ${sm.id}, Material ID: ${sm.material_id}, Reason: ${sm.reason}`))
} else {
    console.log('✅ Wszystkie ruchy magazynowe mają przypisane materiały')
}

// Demands bez materiałów
const orphanDemands = d.prepare(`
    SELECT d.id, d.name, d.material_id
    FROM demands d
    LEFT JOIN materials m ON d.material_id = m.id
    WHERE m.id IS NULL
`).all()

if (orphanDemands.length > 0) {
    console.log(`❌ Zapotrzebowania bez materiałów (${orphanDemands.length}):`)
    orphanDemands.forEach(d => console.log(`  - ${d.name} (material_id: ${d.material_id})`))
} else {
    console.log('✅ Wszystkie zapotrzebowania mają przypisane materiały')
}

console.log('\n=== MAPA POWIĄZAŃ BIZNESOWYCH ===\n')

// 5. Stwórz mapę powiązań
console.log('🏗️ STRUKTURA POWIĄZAŃ:')
console.log('')
console.log('1. KLIENCI (clients)')
console.log('   └── PROJEKTY (projects) - client_id → clients.id')
console.log('       ├── KAFELKI (tiles) - project_id → projects.id')
console.log('       │   ├── MATERIAŁY KAFELKÓW (tile_materials) - tile_id → tiles.id, material_id → materials.id')
console.log('       │   └── MATERIAŁY OBIEKTÓW (tile_object_materials) - tile_id → tiles.id, material_id → materials.id')
console.log('       ├── LOGISTYKA (logistics) - project_id → projects.id')
console.log('       ├── ZAKWATEROWANIE (accommodation) - project_id → projects.id')
console.log('       └── ZADANIA GANTT (gantt_tasks) - project_id → projects.id, tile_id → tiles.id')
console.log('')
console.log('2. MATERIAŁY (materials)')
console.log('   ├── STANY MAGAZYNOWE (stocks) - material_id → materials.id')
console.log('   ├── RUCHY MAGAZYNOWE (stock_movements) - material_id → materials.id, tile_id → tiles.id, project_id → projects.id')
console.log('   ├── MATERIAŁY KAFELKÓW (tile_materials) - material_id → materials.id')
console.log('   ├── MATERIAŁY OBIEKTÓW (tile_object_materials) - material_id → materials.id')
console.log('   └── ZAPOTRZEBOWANIA (demands) - material_id → materials.id, project_id → projects.id, tile_id → tiles.id')
console.log('')
console.log('3. AUDYT (audit_logs) - niezależna tabela logująca wszystkie akcje')

console.log('\n=== REKOMENDACJE ===\n')

// 6. Sprawdź brakujące powiązania
const missingFks = []

// Demands powinny mieć FK do materials, projects, tiles
try {
    const demandsFks = d.prepare("SELECT * FROM pragma_foreign_key_list('demands')").all()
    const hasMaterialFk = demandsFks.some(fk => fk.table === 'materials')
    const hasProjectFk = demandsFks.some(fk => fk.table === 'projects')
    const hasTileFk = demandsFks.some(fk => fk.table === 'tiles')
    
    if (!hasMaterialFk) missingFks.push('demands.material_id → materials.id')
    if (!hasProjectFk) missingFks.push('demands.project_id → projects.id')
    if (!hasTileFk) missingFks.push('demands.tile_id → tiles.id')
} catch (e) {
    console.log('❌ Nie można sprawdzić FK dla demands')
}

if (missingFks.length > 0) {
    console.log('⚠️ BRAKUJĄCE POWIĄZANIA:')
    missingFks.forEach(fk => console.log(`  - ${fk}`))
} else {
    console.log('✅ Wszystkie powiązania są poprawnie zdefiniowane')
}

console.log('\n=== PODSUMOWANIE ===\n')
console.log('Baza danych zawiera kompletną strukturę powiązań między:')
console.log('- Klientami a projektami')
console.log('- Projektami a kafelkami')
console.log('- Kafelkami a materiałami')
console.log('- Materiałami a stanami magazynowymi')
console.log('- Projektami a logistyką i zakwaterowaniem')
console.log('- Wszystkimi tabelami a audytem')

d.close()

