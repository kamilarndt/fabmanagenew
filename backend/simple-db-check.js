const db = require('./db.js')

try {
    db.init()
    const d = db.getDb()
    
    console.log('=== ANALIZA BAZY DANYCH FABMANAGE ===\n')
    
    // Lista tabel
    console.log('📋 TABELE:')
    const tables = d.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
    tables.forEach(t => console.log(`  - ${t.name}`))
    
    console.log('\n📊 LICZBA REKORDÓW:')
    tables.forEach(table => {
        try {
            const count = d.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get().count
            console.log(`  - ${table.name}: ${count}`)
        } catch (e) {
            console.log(`  - ${table.name}: błąd`)
        }
    })
    
    console.log('\n🔗 POWIĄZANIA:')
    
    // Sprawdź klucze obce
    const fkTables = ['projects', 'tiles', 'stocks', 'stock_movements', 'tile_materials', 'logistics', 'accommodation', 'gantt_tasks']
    
    fkTables.forEach(tableName => {
        try {
            const fks = d.prepare(`SELECT * FROM pragma_foreign_key_list('${tableName}')`).all()
            if (fks.length > 0) {
                console.log(`\n${tableName.toUpperCase()}:`)
                fks.forEach(fk => {
                    console.log(`  ${fk.from} → ${fk.table}.${fk.to}`)
                })
            }
        } catch (e) {
            // Ignoruj błędy
        }
    })
    
    console.log('\n✅ ANALIZA ZAKOŃCZONA')
    
    d.close()
} catch (error) {
    console.error('❌ Błąd:', error.message)
}

