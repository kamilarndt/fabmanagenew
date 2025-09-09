const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_PATH = path.join(__dirname, 'fabmanage.db')

let db

function getDb() {
    if (!db) {
        db = new Database(DB_PATH)
        db.pragma('journal_mode = WAL')
    }
    return db
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
            created_at TEXT NOT NULL
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
            created_at TEXT NOT NULL
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
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS stocks (
            material_id TEXT PRIMARY KEY REFERENCES materials(id) ON DELETE CASCADE,
            quantity REAL NOT NULL DEFAULT 0,
            reserved REAL NOT NULL DEFAULT 0
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
    `)
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

function init() {
    migrate()
    seedMaterialsFromCsv()
    seedSyntheticBusinessData()
}

module.exports = { getDb, migrate, init }


