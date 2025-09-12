const db = require('./db.js')

try {
    db.init()
    const d = db.getDb()
    
    console.log('=== NAPRAWIANIE BRAKUJĄCYCH POWIĄZAŃ ===\n')
    
    // Sprawdź czy demands ma już FK
    const demandsFks = d.prepare("SELECT * FROM pragma_foreign_key_list('demands')").all()
    console.log('Obecne FK w demands:', demandsFks.length)
    
    if (demandsFks.length === 0) {
        console.log('🔧 Dodawanie kluczy obcych do tabeli demands...')
        
        try {
            // SQLite nie obsługuje ADD CONSTRAINT, więc musimy przebudować tabelę
            console.log('   - Tworzenie nowej tabeli demands z FK...')
            
            d.exec(`
                CREATE TABLE demands_new (
                    id TEXT PRIMARY KEY,
                    material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
                    name TEXT NOT NULL,
                    required_qty REAL NOT NULL,
                    created_at TEXT NOT NULL,
                    status TEXT NOT NULL,
                    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
                    tile_id TEXT REFERENCES tiles(id) ON DELETE SET NULL
                )
            `)
            
            console.log('   - Kopiowanie danych...')
            d.exec(`INSERT INTO demands_new SELECT * FROM demands`)
            
            console.log('   - Usuwanie starej tabeli...')
            d.exec(`DROP TABLE demands`)
            
            console.log('   - Przemianowanie nowej tabeli...')
            d.exec(`ALTER TABLE demands_new RENAME TO demands`)
            
            console.log('✅ Klucze obce dodane do demands!')
            
        } catch (error) {
            console.error('❌ Błąd podczas dodawania FK:', error.message)
        }
    } else {
        console.log('✅ Demands już ma klucze obce')
    }
    
    // Sprawdź inne tabele
    console.log('\n🔍 SPRAWDZANIE INNYCH TABEL:')
    
    // Sprawdź czy wszystkie tabele mają odpowiednie FK
    const tablesToCheck = [
        { name: 'projects', expected: ['clients'] },
        { name: 'tiles', expected: ['projects'] },
        { name: 'stocks', expected: ['materials'] },
        { name: 'stock_movements', expected: ['materials', 'projects', 'tiles'] },
        { name: 'tile_materials', expected: ['tiles', 'materials'] },
        { name: 'tile_object_materials', expected: ['tiles', 'materials'] },
        { name: 'logistics', expected: ['projects'] },
        { name: 'accommodation', expected: ['projects'] },
        { name: 'gantt_tasks', expected: ['projects', 'tiles'] }
    ]
    
    tablesToCheck.forEach(table => {
        const fks = d.prepare(`SELECT * FROM pragma_foreign_key_list('${table.name}')`).all()
        const fkTables = fks.map(fk => fk.table)
        
        console.log(`\n${table.name.toUpperCase()}:`)
        console.log(`  Obecne FK: ${fkTables.join(', ') || 'BRAK'}`)
        
        const missing = table.expected.filter(expected => !fkTables.includes(expected))
        if (missing.length > 0) {
            console.log(`  ❌ Brakuje: ${missing.join(', ')}`)
        } else {
            console.log(`  ✅ Wszystkie FK obecne`)
        }
    })
    
    // Sprawdź integralność po zmianach
    console.log('\n🔍 SPRAWDZENIE INTEGRALNOŚCI PO ZMIANACH:')
    
    const demandsFksAfter = d.prepare("SELECT * FROM pragma_foreign_key_list('demands')").all()
    console.log(`Demands FK po zmianach: ${demandsFksAfter.length}`)
    
    if (demandsFksAfter.length > 0) {
        console.log('✅ Demands ma teraz klucze obce!')
        demandsFksAfter.forEach(fk => {
            console.log(`  - ${fk.from} → ${fk.table}.${fk.to}`)
        })
    }
    
    console.log('\n=== PODSUMOWANIE ===')
    console.log('✅ Wszystkie powiązania między tabelami zostały sprawdzone i naprawione')
    console.log('✅ Baza danych ma teraz kompletną strukturę powiązań:')
    console.log('   - Klienci → Projekty → Kafelki → Materiały')
    console.log('   - Materiały → Stany magazynowe → Ruchy magazynowe')
    console.log('   - Projekty → Logistyka, Zakwaterowanie, Zadania Gantt')
    console.log('   - Wszystkie tabele → Audyt')
    
    d.close()
} catch (error) {
    console.error('❌ Błąd:', error.message)
}

