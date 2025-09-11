const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

// --- Projects root resolution (shared convention with server.js) ---
const SETTINGS_JSON = path.join(__dirname, 'projects-config.json')
const KNOWN_WINDOWS_ROOTS = ['Z:/_NoweRozdanie', 'Z:\\_NoweRozdanie']
const FALLBACK_LOCAL_ROOT = path.join(__dirname, '..', 'PROJECTS_FILES')

function resolveProjectsRoot() {
    let root = process.env.PROJECTS_ROOT_DIR
    try {
        if (!root && fs.existsSync(SETTINGS_JSON)) {
            const cfg = JSON.parse(fs.readFileSync(SETTINGS_JSON, 'utf8'))
            if (cfg && typeof cfg.projectsRootDir === 'string') root = cfg.projectsRootDir
        }
    } catch { /* ignore */ }
    if (!root) {
        const existing = KNOWN_WINDOWS_ROOTS.find(p => {
            try { return fs.existsSync(p) } catch { return false }
        })
        root = existing || FALLBACK_LOCAL_ROOT
    }
    try { if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true }) } catch { /* ignore */ }
    return root
}

// Database resolution: prefer primary file near backend; fallback to hidden file under projects root
const DB_PRIMARY = path.join(__dirname, 'fabmanage.db')
const PROJECTS_ROOT_DIR = resolveProjectsRoot()
const OFFLINE_DIR = path.join(PROJECTS_ROOT_DIR, '.fabmanage')
const DB_FALLBACK = path.join(OFFLINE_DIR, 'fabmanage.db')

let currentDbPath = DB_PRIMARY
let db

function tryOpenDatabase(dbPath) {
    const instance = new Database(dbPath)
    instance.pragma('journal_mode = WAL')
    return instance
}

function ensureFallbackDir() {
    try { if (!fs.existsSync(OFFLINE_DIR)) fs.mkdirSync(OFFLINE_DIR, { recursive: true }) } catch { /* ignore */ }
}

function getDb() {
    if (!db) {
        try {
            db = tryOpenDatabase(DB_PRIMARY)
            currentDbPath = DB_PRIMARY
        } catch (primaryErr) {
            // Fallback to offline DB under projects root
            ensureFallbackDir()
            try {
                db = tryOpenDatabase(DB_FALLBACK)
                currentDbPath = DB_FALLBACK
                console.warn(`[db] Primary DB unavailable, using fallback at ${DB_FALLBACK}`)
            } catch (fallbackErr) {
                // Last resort: attempt to create fallback
                try {
                    ensureFallbackDir()
                    db = tryOpenDatabase(DB_FALLBACK)
                    currentDbPath = DB_FALLBACK
                } catch (e) {
                    throw primaryErr
                }
            }
        }
    }
    return db
}

function getCurrentDbPath() {
    return currentDbPath
}

function addMissingColumns() {
    const d = getDb()
    try {
        // Sprawdź czy kolumna supplier istnieje
        const columns = d.prepare("PRAGMA table_info(materials)").all()
        const existingColumns = columns.map(col => col.name)

        if (!existingColumns.includes('supplier')) {
            d.exec('ALTER TABLE materials ADD COLUMN supplier TEXT')
        }
        if (!existingColumns.includes('location')) {
            d.exec('ALTER TABLE materials ADD COLUMN location TEXT')
        }
        if (!existingColumns.includes('min_quantity')) {
            d.exec('ALTER TABLE materials ADD COLUMN min_quantity REAL DEFAULT 10')
        }
        if (!existingColumns.includes('max_quantity')) {
            d.exec('ALTER TABLE materials ADD COLUMN max_quantity REAL DEFAULT 100')
        }

        console.log('✅ Missing columns added to materials table')

        // Sprawdź i dodaj kolumny do tabeli stocks
        const stocksColumns = d.prepare("PRAGMA table_info(stocks)").all()
        const existingStocksColumns = stocksColumns.map(col => col.name)

        if (!existingStocksColumns.includes('min_quantity')) {
            d.exec('ALTER TABLE stocks ADD COLUMN min_quantity REAL DEFAULT 10')
        }
        if (!existingStocksColumns.includes('max_quantity')) {
            d.exec('ALTER TABLE stocks ADD COLUMN max_quantity REAL DEFAULT 100')
        }
        if (!existingStocksColumns.includes('location')) {
            d.exec('ALTER TABLE stocks ADD COLUMN location TEXT')
        }

        console.log('✅ Missing columns added to stocks table')

        // Add missing columns to projects table
        const projectsColumns = d.prepare("PRAGMA table_info(projects)").all()
        const existingProjectsColumns = projectsColumns.map(col => col.name)

        if (!existingProjectsColumns.includes('location')) {
            d.exec('ALTER TABLE projects ADD COLUMN location TEXT')
        }
        if (!existingProjectsColumns.includes('project_type')) {
            d.exec('ALTER TABLE projects ADD COLUMN project_type TEXT')
        }
        if (!existingProjectsColumns.includes('priority')) {
            d.exec('ALTER TABLE projects ADD COLUMN priority TEXT DEFAULT \'Średni\'')
        }
        if (!existingProjectsColumns.includes('modules')) {
            d.exec('ALTER TABLE projects ADD COLUMN modules TEXT')
        }
        if (!existingProjectsColumns.includes('description')) {
            d.exec('ALTER TABLE projects ADD COLUMN description TEXT')
        }

        console.log('✅ Missing columns added to projects table')

        // Add missing columns to tiles table
        const tilesColumns = d.prepare("PRAGMA table_info(tiles)").all()
        const existingTilesColumns = tilesColumns.map(col => col.name)

        if (!existingTilesColumns.includes('deadline')) {
            d.exec('ALTER TABLE tiles ADD COLUMN deadline TEXT')
        }
        if (!existingTilesColumns.includes('assigned_designer')) {
            d.exec('ALTER TABLE tiles ADD COLUMN assigned_designer TEXT')
        }
        if (!existingTilesColumns.includes('priority')) {
            d.exec('ALTER TABLE tiles ADD COLUMN priority TEXT DEFAULT \'Średni\'')
        }
        if (!existingTilesColumns.includes('progress_percent')) {
            d.exec('ALTER TABLE tiles ADD COLUMN progress_percent REAL DEFAULT 0')
        }
        if (!existingTilesColumns.includes('group_id')) {
            d.exec('ALTER TABLE tiles ADD COLUMN group_id TEXT')
        }
        if (!existingTilesColumns.includes('speckle_object_ids')) {
            d.exec('ALTER TABLE tiles ADD COLUMN speckle_object_ids TEXT')
        }
        if (!existingTilesColumns.includes('dxf_file_path')) {
            d.exec('ALTER TABLE tiles ADD COLUMN dxf_file_path TEXT')
        }
        if (!existingTilesColumns.includes('assembly_drawing_path')) {
            d.exec('ALTER TABLE tiles ADD COLUMN assembly_drawing_path TEXT')
        }
        if (!existingTilesColumns.includes('labor_cost')) {
            d.exec('ALTER TABLE tiles ADD COLUMN labor_cost REAL DEFAULT 0')
        }
        if (!existingTilesColumns.includes('material_cost')) {
            d.exec('ALTER TABLE tiles ADD COLUMN material_cost REAL DEFAULT 0')
        }
        if (!existingTilesColumns.includes('total_cost')) {
            d.exec('ALTER TABLE tiles ADD COLUMN total_cost REAL DEFAULT 0')
        }
        if (!existingTilesColumns.includes('status')) {
            d.exec('ALTER TABLE tiles ADD COLUMN status TEXT DEFAULT \'new\'')
        }
        if (!existingTilesColumns.includes('notes')) {
            d.exec('ALTER TABLE tiles ADD COLUMN notes TEXT')
        }
        if (!existingTilesColumns.includes('updated_at')) {
            d.exec('ALTER TABLE tiles ADD COLUMN updated_at TEXT')
        }

        console.log('✅ Missing columns added to tiles table')
    } catch (error) {
        console.warn('⚠️ Column migration warning:', error.message)
    }
}

function migrate() {
    const d = getDb()
    d.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            tax_id TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            deadline TEXT,
            archived_at TEXT,
            created_at TEXT NOT NULL,
            location TEXT,
            project_type TEXT,
            priority TEXT DEFAULT 'Średni',
            modules TEXT,
            description TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
        CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

        CREATE TABLE IF NOT EXISTS tiles (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            code TEXT,
            name TEXT NOT NULL,
            quantity REAL NOT NULL DEFAULT 1,
            stage TEXT NOT NULL,
            width_mm INTEGER,
            height_mm INTEGER,
            thickness_mm INTEGER,
            description TEXT,
            created_at TEXT NOT NULL,
            -- Additional fields for enhanced tile management
            deadline TEXT,
            assigned_designer TEXT,
            priority TEXT DEFAULT 'Średni',
            progress_percent REAL DEFAULT 0,
            group_id TEXT,
            speckle_object_ids TEXT, -- JSON array of 3D object IDs
            dxf_file_path TEXT,
            assembly_drawing_path TEXT,
            labor_cost REAL DEFAULT 0,
            material_cost REAL DEFAULT 0,
            total_cost REAL DEFAULT 0,
            status TEXT DEFAULT 'new', -- new, design, cnc, assembly, done
            notes TEXT,
            updated_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_tiles_project ON tiles(project_id);
        CREATE INDEX IF NOT EXISTS idx_tiles_stage ON tiles(stage);

        CREATE TABLE IF NOT EXISTS materials (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            type TEXT NOT NULL,
            name TEXT,
            thickness_mm REAL,
            format_raw TEXT,
            base_uom TEXT NOT NULL,
            price_per_uom REAL NOT NULL,
            pricing_uom TEXT NOT NULL,
            supplier TEXT,
            location TEXT,
            min_quantity REAL DEFAULT 10,
            max_quantity REAL DEFAULT 100,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS stocks (
            material_id TEXT PRIMARY KEY REFERENCES materials(id) ON DELETE CASCADE,
            quantity REAL NOT NULL DEFAULT 0,
            reserved REAL NOT NULL DEFAULT 0,
            min_quantity REAL DEFAULT 10,
            max_quantity REAL DEFAULT 100,
            location TEXT
        );

        CREATE TABLE IF NOT EXISTS stock_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
            change_qty REAL NOT NULL,
            reason TEXT NOT NULL,
            tile_id TEXT REFERENCES tiles(id) ON DELETE SET NULL,
            project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
            note TEXT,
            created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_movements_material ON stock_movements(material_id);
        CREATE INDEX IF NOT EXISTS idx_movements_reason ON stock_movements(reason);


        CREATE TABLE IF NOT EXISTS tile_materials (
            tile_id TEXT NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
            material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
            quantity REAL NOT NULL,
            waste_percent REAL NOT NULL DEFAULT 0,
            PRIMARY KEY (tile_id, material_id)
        );

        -- Mapping of individual 3D object ids to materials for a tile
        CREATE TABLE IF NOT EXISTS tile_object_materials (
            tile_id TEXT NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
            object_id TEXT NOT NULL,
            material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
            quantity_per_object REAL NOT NULL DEFAULT 1,
            unit TEXT,
            area REAL,
            volume REAL,
            created_at TEXT NOT NULL,
            PRIMARY KEY (tile_id, object_id)
        );

        CREATE TABLE IF NOT EXISTS demands (
            id TEXT PRIMARY KEY,
            material_id TEXT NOT NULL,
            name TEXT NOT NULL,
            required_qty REAL NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL,
            project_id TEXT,
            tile_id TEXT
        );
        
        CREATE TABLE IF NOT EXISTS logistics (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            transport_type TEXT NOT NULL, -- 'truck', 'van', 'courier'
            departure_location TEXT NOT NULL,
            arrival_location TEXT NOT NULL,
            scheduled_date TEXT NOT NULL,
            estimated_cost REAL,
            status TEXT NOT NULL, -- 'planned', 'booked', 'in_transit', 'delivered'
            driver_name TEXT,
            vehicle_info TEXT,
            notes TEXT,
            created_at TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS accommodation (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            team_size INTEGER NOT NULL,
            location TEXT NOT NULL,
            check_in_date TEXT NOT NULL,
            check_out_date TEXT NOT NULL,
            hotel_name TEXT,
            cost_per_night REAL,
            total_cost REAL,
            status TEXT NOT NULL, -- 'planned', 'booked', 'confirmed', 'cancelled'
            contact_person TEXT,
            notes TEXT,
            created_at TEXT NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_logistics_project ON logistics(project_id);
        CREATE INDEX IF NOT EXISTS idx_accommodation_project ON accommodation(project_id);
        
        -- Audit logs to persist every action/change
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT NOT NULL,
            actor TEXT,
            action TEXT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            payload TEXT,
            ip TEXT,
            user_agent TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_logs(ts);
        CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
    `)
}

// --- Backups ---
const BACKUP_DIR = path.join(PROJECTS_ROOT_DIR, '_db_backups')
function ensureBackupDir() {
    try { if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true }) } catch { /* ignore */ }
}

function timestamp() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

function backupDatabase() {
    try {
        ensureBackupDir()
        const src = getCurrentDbPath()
        if (!fs.existsSync(src)) return { ok: false, error: 'db_not_found', src }

        const baseName = 'fabmanage'
        const destLatest = path.join(BACKUP_DIR, `${baseName}.latest.db`)
        const destStamp = path.join(BACKUP_DIR, `${baseName}.${timestamp()}.db`)

        // Create backup with proper file permissions
        fs.copyFileSync(src, destLatest)
        fs.copyFileSync(src, destStamp)

        // Clean up old backups (keep only last 30 days)
        cleanupOldBackups()

        return {
            ok: true,
            latest: destLatest,
            stamped: destStamp,
            size: fs.statSync(src).size,
            timestamp: new Date().toISOString()
        }
    } catch (e) {
        return { ok: false, error: e.message }
    }
}

function cleanupOldBackups() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) return

        const files = fs.readdirSync(BACKUP_DIR)
        const backupFiles = files
            .filter(f => f.startsWith('fabmanage.') && f.endsWith('.db') && f !== 'fabmanage.latest.db')
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                stat: fs.statSync(path.join(BACKUP_DIR, f))
            }))
            .sort((a, b) => b.stat.mtime - a.stat.mtime)

        // Keep only last 30 backups (approximately 30 days with hourly backups)
        const toDelete = backupFiles.slice(30)
        for (const file of toDelete) {
            try {
                fs.unlinkSync(file.path)
                console.log(`[backup] Cleaned up old backup: ${file.name}`)
            } catch (e) {
                console.warn(`[backup] Failed to delete old backup ${file.name}:`, e.message)
            }
        }
    } catch (e) {
        console.warn('[backup] Cleanup failed:', e.message)
    }
}

// Schedule periodic backups (every 60 minutes)
let backupTimer
function scheduleBackups() {
    try { if (backupTimer) clearInterval(backupTimer) } catch { /* ignore */ }
    backupTimer = setInterval(() => {
        try {
            const result = backupDatabase()
            if (result.ok) {
                console.log(`[backup] Scheduled backup completed: ${result.stamped}`)
            } else {
                console.warn(`[backup] Scheduled backup failed: ${result.error}`)
            }
        } catch (e) {
            console.error('[backup] Scheduled backup error:', e.message)
        }
    }, 60 * 60 * 1000)

    // Initial backup on startup
    setTimeout(() => {
        try {
            const result = backupDatabase()
            if (result.ok) {
                console.log(`[backup] Initial backup completed: ${result.stamped}`)
            }
        } catch (e) {
            console.warn('[backup] Initial backup failed:', e.message)
        }
    }, 5000) // 5 seconds after startup
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function parseCsvLine(line) {
    // Prosty split po przecinku, CSV nie wygląda na quoted
    // rodzaj,typ,grubosc,wielkosc_formatki,cena
    const parts = line.split(',')
    if (parts.length < 5) return null
    const [rodzaj, typ, grubosc, wielkosc, cena] = parts.map(p => p.trim())
    const id = `${rodzaj}::${typ}::${grubosc}::${wielkosc}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    // cena np. 85zl/m2, 120zl/mb, 150zl/kg, 1.2zl/szt
    const m = cena.match(/([0-9]+(?:\.[0-9]+)?)\s*zl\/(m2|mb|kg|szt)/i)
    const price = m ? parseFloat(m[1]) : 0
    const pricingUom = m ? m[2].toLowerCase() : 'szt'
    const baseUom = pricingUom
    const thicknessMatch = grubosc.match(/([0-9]+(?:\.[0-9]+)?)\s*mm/i)
    const thickness = thicknessMatch ? parseFloat(thicknessMatch[1]) : null
    return { id, category: rodzaj, type: typ, name: null, thickness_mm: thickness, format_raw: wielkosc, base_uom: baseUom, price_per_uom: price, pricing_uom: pricingUom }
}

function seedMaterialsFromCsv() {
    const d = getDb()
    const csvPath = path.join(__dirname, '..', 'baza_materialow_magazyn.csv')
    if (!fs.existsSync(csvPath)) return
    const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean)
    if (lines.length <= 1) return
    const header = lines[0]
    if (!/rodzaj\s*,\s*typ\s*,\s*grubosc\s*,\s*wielkosc_formatki\s*,\s*cena/i.test(header)) return
    const insertMat = d.prepare(`
        INSERT OR IGNORE INTO materials (id, category, type, name, thickness_mm, format_raw, base_uom, price_per_uom, pricing_uom, created_at)
        VALUES (@id, @category, @type, @name, @thickness_mm, @format_raw, @base_uom, @price_per_uom, @pricing_uom, @created_at)
    `)
    const upsertStock = d.prepare(`
        INSERT INTO stocks (material_id, quantity, reserved) VALUES (@material_id, @quantity, @reserved)
        ON CONFLICT(material_id) DO NOTHING
    `)
    const now = new Date().toISOString()
    const tx = d.transaction(() => {
        for (let i = 1; i < lines.length; i++) {
            const parsed = parseCsvLine(lines[i])
            if (!parsed) continue
            insertMat.run({ ...parsed, created_at: now })
            upsertStock.run({ material_id: parsed.id, quantity: 0, reserved: 0 })
        }
    })
    tx()
}

function seedSyntheticBusinessData() {
    const d = getDb()
    const countClients = d.prepare('SELECT COUNT(*) AS n FROM clients').get().n
    if (countClients > 0) return
    const now = new Date().toISOString()

    const insClient = d.prepare('INSERT INTO clients (id, name, email, phone, tax_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    const insProject = d.prepare('INSERT INTO projects (id, client_id, name, status, deadline, archived_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    const insTile = d.prepare('INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')

    const clients = Array.from({ length: 6 }).map((_, i) => ({ id: uuid(), name: `Client ${i + 1}`, email: `client${i + 1}@example.com`, phone: `+48 600 000 10${i}`, tax_id: `PL99999910${i}`, created_at: now }))
    const projects = []
    const tiles = []

    for (const c of clients) {
        insClient.run(c.id, c.name, c.email, c.phone, c.tax_id, c.created_at)
        const perClient = Math.floor(Math.random() * 3) + 2
        for (let j = 0; j < perClient; j++) {
            const pid = uuid()
            const statusArr = ['new', 'active', 'on_hold', 'done', 'archived']
            const status = statusArr[Math.floor(Math.random() * statusArr.length)]
            const deadline = new Date(Date.now() + (Math.random() * 60 + 10) * 24 * 3600 * 1000).toISOString().slice(0, 10)
            const archived_at = status === 'archived' ? now : null
            const pname = `${c.name} – Project ${j + 1}`
            projects.push({ id: pid, client_id: c.id, name: pname, status, deadline, archived_at, created_at: now })
            insProject.run(pid, c.id, pname, status, deadline, archived_at, now)

            const tilesCount = Math.floor(Math.random() * 6) + 4
            for (let k = 0; k < tilesCount; k++) {
                const tid = uuid()
                const stages = ['cnc', 'finishing', 'assembly', 'qc', 'done']
                const stage = stages[Math.floor(Math.random() * stages.length)]
                const tname = `TILE-${j + 1}-${k + 1}`
                insTile.run(tid, pid, `C${j + 1}-${k + 1}`, tname, Math.floor(Math.random() * 5) + 1, stage, 600 + Math.floor(Math.random() * 400), 600 + Math.floor(Math.random() * 400), 10 + Math.floor(Math.random() * 20), '', now)
                tiles.push({ id: tid, project_id: pid })
            }
        }
    }
}

function generateRealisticProductionData() {
    const d = getDb()

    // Sprawdź czy już mamy realistyczne dane
    const existingCount = d.prepare('SELECT COUNT(*) AS n FROM projects').get().n
    const tilesCount = d.prepare('SELECT COUNT(*) AS n FROM tiles').get().n
    console.log(`📊 Current project count: ${existingCount}, tiles count: ${tilesCount}`)

    // Sprawdź czy mamy projekty z kompletną strukturą (kafelki + lokalizacja)
    const completeProjects = d.prepare('SELECT COUNT(*) AS n FROM projects WHERE location IS NOT NULL AND project_type IS NOT NULL').get().n
    console.log(`📊 Complete projects count: ${completeProjects}`)

    if (completeProjects >= 9 && tilesCount > 50) {
        console.log('✅ Production data already exists with complete structure, skipping generation')
        return
    }

    console.log('🎬 Generating realistic production data...')

    // Czyść istniejące dane testowe
    d.exec(`
        DELETE FROM tile_materials;
        DELETE FROM tiles;
        DELETE FROM projects;
        DELETE FROM clients;
    `)

    const now = new Date().toISOString()

    // Realistyczni klienci
    const clients = [
        { id: uuid(), name: 'Teatr Narodowy', email: 'biuro@teatrnarodowy.pl', phone: '+48 22 692 0600', tax_id: 'PL5260003010', city: 'Warszawa' },
        { id: uuid(), name: 'Muzeum Łazienki Królewskie', email: 'kontakt@lazienki-krolewskie.pl', phone: '+48 22 506 0024', tax_id: 'PL7010001454', city: 'Warszawa' },
        { id: uuid(), name: 'Orange Warsaw Festival', email: 'produkcja@orange-festival.pl', phone: '+48 22 336 4455', tax_id: 'PL1132220303', city: 'Warszawa' },
        { id: uuid(), name: 'Hotel Bristol', email: 'events@bristol.pl', phone: '+48 22 551 1000', tax_id: 'PL1260001234', city: 'Warszawa' },
        { id: uuid(), name: 'Centrum Nauki Kopernik', email: 'wystawy@kopernik.org.pl', phone: '+48 22 596 4100', tax_id: 'PL1133445566', city: 'Warszawa' },
        { id: uuid(), name: 'TVP - Telewizja Polska', email: 'scenografia@tvp.pl', phone: '+48 22 547 7000', tax_id: 'PL5260250274', city: 'Warszawa' },
        { id: uuid(), name: 'Galeria Mokotów', email: 'marketing@galeriamokotow.pl', phone: '+48 22 542 2100', tax_id: 'PL9512345678', city: 'Warszawa' },
        { id: uuid(), name: 'IKEA Polska', email: 'wystawy@ikea.pl', phone: '+48 801 400 400', tax_id: 'PL6422682896', city: 'Kraków' },
        { id: uuid(), name: 'Philharmonic Kraków', email: 'dyrekcja@filharmonia.krakow.pl', phone: '+48 12 619 8700', tax_id: 'PL6762305048', city: 'Kraków' }
    ]

    // Realistyczne projekty
    const projectTemplates = [
        { name: 'Scenografia „Wesele" - Teatr Narodowy', type: 'Teatr', modules: ['koncepcja', 'wycena', 'logistyka'], priority: 'Wysoki' },
        { name: 'Wystawa „Łazienki przez wieki"', type: 'Muzeum', modules: ['koncepcja', 'wycena'], priority: 'Średni' },
        { name: 'Scena główna Orange Festival 2025', type: 'Event', modules: ['koncepcja', 'wycena', 'logistyka', 'zakwaterowanie'], priority: 'Wysoki' },
        { name: 'Odnowienie Sali Balowej - Hotel Bristol', type: 'Wnętrza', modules: ['koncepcja', 'wycena'], priority: 'Średni' },
        { name: 'Wystawa „Kosmiczne odkrycia"', type: 'Muzeum', modules: ['koncepcja', 'wycena', 'logistyka'], priority: 'Średni' },
        { name: 'Studio TVP „Panorama"', type: 'TV', modules: ['koncepcja', 'wycena'], priority: 'Wysoki' },
        { name: 'Przestrzeń eventowa Galeria Mokotów', type: 'Retail', modules: ['koncepcja', 'wycena'], priority: 'Niski' },
        { name: 'Showroom IKEA - strefa kuchenna', type: 'Retail', modules: ['koncepcja', 'wycena', 'logistyka'], priority: 'Średni' },
        { name: 'Scenografia koncertu „Beethoven 9"', type: 'Koncert', modules: ['koncepcja', 'wycena', 'logistyka', 'zakwaterowanie'], priority: 'Wysoki' }
    ]

    const locations = [
        'Warszawa, Teatr Narodowy, ul. Krakowskie Przedmieście 3',
        'Warszawa, Łazienki Królewskie, ul. Agrykoli 1',
        'Warszawa, Lotnisko Bemowo, ul. Księcia Bolesława 2',
        'Warszawa, Hotel Bristol, ul. Krakowskie Przedmieście 42/44',
        'Warszawa, Centrum Nauki Kopernik, ul. Wybrzeże Kościuszkowskie 20',
        'Warszawa, TVP, ul. Woronicza 17',
        'Warszawa, Galeria Mokotów, ul. Wołoska 12',
        'Kraków, IKEA, ul. Opolska 100',
        'Kraków, Filharmonia, ul. Zwierzyniecka 1'
    ]

    const statuses = ['new', 'active', 'on_hold', 'done']

    // Wstawianie klientów
    const insClient = d.prepare('INSERT INTO clients (id, name, email, phone, tax_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    for (const client of clients) {
        insClient.run(client.id, client.name, client.email, client.phone, client.tax_id, now)
    }

    // Generowanie projektów
    const insProject = d.prepare('INSERT INTO projects (id, client_id, name, status, deadline, archived_at, created_at, location, project_type, priority, modules, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const projects = []

    for (let i = 0; i < projectTemplates.length; i++) {
        const template = projectTemplates[i]
        const client = clients[i]
        const project = {
            id: uuid(),
            client_id: client.id,
            name: template.name,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            deadline: new Date(Date.now() + (Math.random() * 120 + 30) * 24 * 3600 * 1000).toISOString().slice(0, 10),
            location: locations[i],
            project_type: template.type,
            modules: JSON.stringify(template.modules),
            priority: template.priority,
            description: `Profesjonalna realizacja dla ${client.name}. Projekt obejmuje ${template.modules.join(', ')}.`
        }
        projects.push(project)

        const archived_at = project.status === 'done' ? now : null
        insProject.run(project.id, project.client_id, project.name, project.status, project.deadline, archived_at, now, project.location, project.project_type, project.priority, project.modules, project.description)
    }

    // Generowanie kafelków dla każdego projektu
    const insTile = d.prepare('INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const tileStages = ['design', 'cnc', 'finishing', 'assembly', 'qc', 'done']
    const tiles = []

    const tileTemplates = [
        { name: 'Panel dekoracyjny główny', desc: 'Centralny element scenografii', dims: [2000, 3000, 18] },
        { name: 'Ramka informacyjna', desc: 'Panel z tekstem i grafikami', dims: [1200, 800, 10] },
        { name: 'Postument wystawowy', desc: 'Podstawa pod eksponat', dims: [600, 600, 40] },
        { name: 'Tło sceniczne', desc: 'Większy panel tła', dims: [3000, 2400, 12] },
        { name: 'Element interaktywny', desc: 'Panel z wbudowaną elektroniką', dims: [800, 1200, 25] },
        { name: 'Listwa LED', desc: 'Obudowa na oświetlenie', dims: [2000, 50, 30] },
        { name: 'Ściana działowa', desc: 'Element konstrukcyjny', dims: [2400, 2400, 18] },
        { name: 'Skrzynia transportowa', desc: 'Opakowanie na elementy', dims: [1000, 600, 400] }
    ]

    for (const project of projects) {
        const tilesCount = Math.floor(Math.random() * 8) + 5 // 5-12 kafelków
        for (let j = 0; j < tilesCount; j++) {
            const template = tileTemplates[j % tileTemplates.length]
            const tile = {
                id: uuid(),
                project_id: project.id,
                code: `${project.type.substr(0, 2).toUpperCase()}-${(j + 1).toString().padStart(3, '0')}`,
                name: template.name,
                quantity: Math.floor(Math.random() * 3) + 1,
                stage: tileStages[Math.floor(Math.random() * tileStages.length)],
                width_mm: template.dims[0] + Math.floor(Math.random() * 400 - 200),
                height_mm: template.dims[1] + Math.floor(Math.random() * 400 - 200),
                thickness_mm: template.dims[2] + Math.floor(Math.random() * 10 - 5),
                description: template.desc
            }
            tiles.push(tile)
            insTile.run(tile.id, tile.project_id, tile.code, tile.name, tile.quantity, tile.stage, tile.width_mm, tile.height_mm, tile.thickness_mm, tile.description, now)
        }
    }

    // Przypisywanie materiałów do kafelków
    const materials = d.prepare('SELECT id, category, type FROM materials LIMIT 50').all()
    const insTileMaterial = d.prepare('INSERT INTO tile_materials (tile_id, material_id, quantity, waste_percent) VALUES (?, ?, ?, ?)')

    for (const tile of tiles) {
        const materialsCount = Math.floor(Math.random() * 4) + 2 // 2-5 materiałów na kafelek
        const usedMaterials = new Set()

        for (let k = 0; k < materialsCount; k++) {
            const material = materials[Math.floor(Math.random() * materials.length)]
            if (usedMaterials.has(material.id)) continue
            usedMaterials.add(material.id)

            const area = (tile.width_mm / 1000) * (tile.height_mm / 1000) * tile.quantity
            const requiredQty = area * (Math.random() * 2 + 0.5) // Losowa ilość z marginesem

            insTileMaterial.run(
                tile.id,
                material.id,
                Math.round(requiredQty * 100) / 100,
                0
            )
        }
    }

    // Generowanie danych logistycznych
    const insLogistics = d.prepare('INSERT INTO logistics (id, project_id, transport_type, departure_location, arrival_location, scheduled_date, estimated_cost, status, driver_name, vehicle_info, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const transportTypes = ['truck', 'van', 'courier']
    const logisticsStatuses = ['planned', 'booked', 'in_transit', 'delivered']
    const drivers = ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski', 'Katarzyna Wójcik']

    for (const project of projects) {
        const projectModules = typeof project.modules === 'string' ? JSON.parse(project.modules) : project.modules
        if (projectModules.includes('logistyka')) {
            const logistics = {
                id: uuid(),
                project_id: project.id,
                transport_type: transportTypes[Math.floor(Math.random() * transportTypes.length)],
                departure_location: 'Warszawa, ul. Fabryczna 15', // Główny magazyn
                arrival_location: project.location,
                scheduled_date: new Date(Date.now() + Math.random() * 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
                estimated_cost: Math.round((Math.random() * 3000 + 500) * 100) / 100,
                status: logisticsStatuses[Math.floor(Math.random() * logisticsStatuses.length)],
                driver_name: drivers[Math.floor(Math.random() * drivers.length)],
                vehicle_info: `Pojazd ${Math.floor(Math.random() * 999) + 100}`,
                notes: `Transport elementów scenograficznych do ${project.location.split(',')[0]}`
            }

            insLogistics.run(logistics.id, logistics.project_id, logistics.transport_type, logistics.departure_location, logistics.arrival_location, logistics.scheduled_date, logistics.estimated_cost, logistics.status, logistics.driver_name, logistics.vehicle_info, logistics.notes, now)
        }
    }

    // Generowanie danych zakwaterowania
    const insAccommodation = d.prepare('INSERT INTO accommodation (id, project_id, team_size, location, check_in_date, check_out_date, hotel_name, cost_per_night, total_cost, status, contact_person, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const accommodationStatuses = ['planned', 'booked', 'confirmed', 'cancelled']
    const hotels = [
        'Hotel Marriott', 'Hotel Hilton', 'Hotel Bristol', 'Hotel Europejski',
        'Hotel Sofitel', 'Hotel Regent', 'Holiday Inn', 'Hotel Mercure'
    ]
    const contacts = ['Anna Recepcja', 'Piotr Manager', 'Katarzyna Bookings', 'Tomasz Events']

    for (const project of projects) {
        const projectModules = typeof project.modules === 'string' ? JSON.parse(project.modules) : project.modules
        if (projectModules.includes('zakwaterowanie')) {
            const teamSize = Math.floor(Math.random() * 6) + 3 // 3-8 osób
            const costPerNight = Math.round((Math.random() * 200 + 150) * 100) / 100 // 150-350 PLN
            const nights = Math.floor(Math.random() * 5) + 2 // 2-6 nocy

            const accommodation = {
                id: uuid(),
                project_id: project.id,
                team_size: teamSize,
                location: project.location.split(',')[0], // Miasto
                check_in_date: new Date(Date.now() + Math.random() * 60 * 24 * 3600 * 1000).toISOString().slice(0, 10),
                check_out_date: new Date(Date.now() + (Math.random() * 60 + nights) * 24 * 3600 * 1000).toISOString().slice(0, 10),
                hotel_name: hotels[Math.floor(Math.random() * hotels.length)],
                cost_per_night: costPerNight,
                total_cost: Math.round(costPerNight * teamSize * nights * 100) / 100,
                status: accommodationStatuses[Math.floor(Math.random() * accommodationStatuses.length)],
                contact_person: contacts[Math.floor(Math.random() * contacts.length)],
                notes: `Zakwaterowanie ${teamSize} członków zespołu montażowego`
            }

            insAccommodation.run(accommodation.id, accommodation.project_id, accommodation.team_size, accommodation.location, accommodation.check_in_date, accommodation.check_out_date, accommodation.hotel_name, accommodation.cost_per_night, accommodation.total_cost, accommodation.status, accommodation.contact_person, accommodation.notes, now)
        }
    }

    // Aktualizuj stany magazynowe materiałów
    console.log('📦 Updating material stock levels...')
    const updateStock = d.prepare('UPDATE stocks SET quantity = ?, reserved = ? WHERE material_id = ?')
    const allMaterials = d.prepare('SELECT id FROM materials').all()

    for (const material of allMaterials) {
        const quantity = Math.round((Math.random() * 200 + 10) * 100) / 100 // 10-210 jednostek
        const reserved = Math.round((Math.random() * quantity * 0.3) * 100) / 100 // 0-30% zarezerwowane
        updateStock.run(quantity, reserved, material.id)
    }

    console.log(`✅ Generated realistic data:`)
    console.log(`   - ${clients.length} clients`)
    console.log(`   - ${projects.length} projects`)
    console.log(`   - ${tiles.length} tiles`)
    console.log(`   - Updated ${allMaterials.length} material stock levels`)
    console.log(`   - Assigned materials to all tiles`)
    console.log(`   - Added logistics for projects with logistics module`)
    console.log(`   - Added accommodation for projects with accommodation module`)
}

function forceRegenerateTestData() {
    const d = getDb()
    console.log('🗑️ Force clearing all test data...')

    // Czyść wszystkie dane
    d.exec(`
        DELETE FROM accommodation;
        DELETE FROM logistics;
        DELETE FROM tile_materials;
        DELETE FROM tiles;
        DELETE FROM projects;
        DELETE FROM clients;
    `)

    // Wymuś regenerację
    generateRealisticProductionData()
}

function init() {
    migrate()
    addMissingColumns()
    seedMaterialsFromCsv()

    // Check if we need test data
    const d = getDb()
    const projectCount = d.prepare('SELECT COUNT(*) AS n FROM projects').get().n
    const tileCount = d.prepare('SELECT COUNT(*) AS n FROM tiles').get().n

    console.log(`📊 Current data: ${projectCount} projects, ${tileCount} tiles`)

    if (tileCount === 0) {
        console.log('🎯 No tiles found, forcing complete regeneration...')
        forceRegenerateTestData()
    } else if (projectCount > 0 && tileCount > 0) {
        console.log('✅ Using existing complete test data')
        // Update material stocks even if we don't regenerate everything  
        const updateStock = getDb().prepare('UPDATE stocks SET quantity = ?, reserved = ? WHERE material_id = ?')
        const allMaterials = getDb().prepare('SELECT material_id as id FROM stocks WHERE quantity = 0').all() // Get from stocks table

        if (allMaterials.length > 0) {
            console.log(`📦 Updating ${allMaterials.length} materials with zero stock...`)
            for (const material of allMaterials) {
                const quantity = Math.round((Math.random() * 200 + 10) * 100) / 100
                const reserved = Math.round((Math.random() * quantity * 0.3) * 100) / 100
                updateStock.run(quantity, reserved, material.id)
            }
        }
    } else {
        console.log('🎯 Incomplete data found, regenerating...')
        forceRegenerateTestData()
    }
    // Start periodic backups
    scheduleBackups()
}

function auditLog({ action, entityType, entityId, payload, actor, ip, userAgent }) {
    try {
        const d = getDb()
        const ts = new Date().toISOString()
        const stmt = d.prepare(`INSERT INTO audit_logs (ts, actor, action, entity_type, entity_id, payload, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        stmt.run(ts, actor || null, action, entityType || null, entityId || null, payload ? JSON.stringify(payload) : null, ip || null, userAgent || null)
    } catch (e) {
        try { console.warn('[audit] failed:', e.message) } catch { }
    }
}

module.exports = { getDb, migrate, init, generateRealisticProductionData, forceRegenerateTestData, backupDatabase, getCurrentDbPath, auditLog, cleanupOldBackups }


