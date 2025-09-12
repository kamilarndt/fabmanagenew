const db = require('./db.js')

try {
    db.init()
    const d = db.getDb()
    
    console.log('=== SPRAWDZENIE BRAKUJĄCYCH POWIĄZAŃ ===\n')
    
    // Sprawdź demands - powinna mieć FK do materials, projects, tiles
    console.log('🔍 SPRAWDZANIE TABELI DEMANDS:')
    const demandsFks = d.prepare("SELECT * FROM pragma_foreign_key_list('demands')").all()
    console.log('Obecne FK:', demandsFks)
    
    if (demandsFks.length === 0) {
        console.log('❌ Tabela demands NIE MA żadnych kluczy obcych!')
        console.log('   Powinna mieć:')
        console.log('   - material_id → materials.id')
        console.log('   - project_id → projects.id') 
        console.log('   - tile_id → tiles.id')
    }
    
    // Sprawdź czy demands ma odpowiednie kolumny
    console.log('\n📋 KOLUMNY W DEMANDS:')
    const demandsColumns = d.prepare("PRAGMA table_info(demands)").all()
    demandsColumns.forEach(col => console.log(`  - ${col.name} (${col.type})`))
    
    // Sprawdź integralność danych
    console.log('\n🔍 SPRAWDZENIE INTEGRALNOŚCI:')
    
    // Demands bez materiałów
    const orphanDemands = d.prepare(`
        SELECT d.id, d.name, d.material_id
        FROM demands d
        LEFT JOIN materials m ON d.material_id = m.id
        WHERE m.id IS NULL AND d.material_id IS NOT NULL
    `).all()
    
    if (orphanDemands.length > 0) {
        console.log(`❌ Demands z nieistniejącymi materiałami: ${orphanDemands.length}`)
    } else {
        console.log('✅ Wszystkie demands mają poprawne materiały')
    }
    
    // Sprawdź inne potencjalne problemy
    console.log('\n🔍 INNE SPRAWDZENIA:')
    
    // Projekty bez klientów
    const orphanProjects = d.prepare(`
        SELECT p.id, p.name, p.client_id 
        FROM projects p 
        LEFT JOIN clients c ON p.client_id = c.id 
        WHERE c.id IS NULL
    `).all()
    
    if (orphanProjects.length > 0) {
        console.log(`❌ Projekty bez klientów: ${orphanProjects.length}`)
    } else {
        console.log('✅ Wszystkie projekty mają klientów')
    }
    
    // Kafelki bez projektów
    const orphanTiles = d.prepare(`
        SELECT t.id, t.name, t.project_id 
        FROM tiles t 
        LEFT JOIN projects p ON t.project_id = p.id 
        WHERE p.id IS NULL
    `).all()
    
    if (orphanTiles.length > 0) {
        console.log(`❌ Kafelki bez projektów: ${orphanTiles.length}`)
    } else {
        console.log('✅ Wszystkie kafelki mają projekty')
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
        console.log(`❌ Kafelki z nieistniejącymi materiałami: ${orphanTileMaterials.length}`)
    } else {
        console.log('✅ Wszystkie materiały w kafelkach istnieją')
    }
    
    console.log('\n=== REKOMENDACJE ===\n')
    
    if (demandsFks.length === 0) {
        console.log('🔧 NALEŻY DODAĆ KLUCZE OBCE DO DEMANDS:')
        console.log('   ALTER TABLE demands ADD CONSTRAINT fk_demands_material FOREIGN KEY (material_id) REFERENCES materials(id)')
        console.log('   ALTER TABLE demands ADD CONSTRAINT fk_demands_project FOREIGN KEY (project_id) REFERENCES projects(id)')
        console.log('   ALTER TABLE demands ADD CONSTRAINT fk_demands_tile FOREIGN KEY (tile_id) REFERENCES tiles(id)')
    }
    
    d.close()
} catch (error) {
    console.error('❌ Błąd:', error.message)
}

