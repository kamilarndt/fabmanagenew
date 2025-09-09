const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const multer = require('multer');

const app = express();
// DB init
let dbReady = false;
try {
    const db = require('./db');
    db.init();
    dbReady = true;
    console.log('[db] initialized')
} catch (e) {
    console.warn('[db] init failed, backend will run without DB:', e.message)
}

const PORT = process.env.PORT || 3001;
const RHINO_TXT = path.join(__dirname, 'rhino.txt');
const STOCKS_JSON = path.join(__dirname, 'stocks.json');
const DEMANDS_JSON = path.join(__dirname, 'demands.json');
const TILES_JSON = path.join(__dirname, 'tiles.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json());
app.use('/files', express.static(UPLOADS_DIR));

// Ensure required data files and directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TILES_JSON)) fs.writeFileSync(TILES_JSON, JSON.stringify([], null, 2));

app.get('/health', (_req, res) => res.status(200).json({ ok: true, db: dbReady }));

// --- Materials parsing from rhino.txt ---
let materialsFlat = [];
let stocks = {};
let demands = [];
let tiles = [];

function parseRhinoTxtToMaterials(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`[materials] File not found: ${filePath}`)
        return []
    }

    const text = fs.readFileSync(filePath, 'utf8')
    console.log(`[materials] File content length: ${text.length}`)
    console.log(`[materials] First 200 chars: ${text.substring(0, 200)}`)

    const lines = text.split(/\r?\n/)
    console.log(`[materials] Total lines: ${lines.length}`)

    const materials = []

    // Stack do śledzenia hierarchii
    const stack = []
    const pathStack = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Oblicz poziom wcięcia (liczba spacji/tabulatorów na początku)
        const originalLine = lines[i]
        const indentLevel = originalLine.length - originalLine.trimStart().length

        // Usuń elementy ze stacka które są na wyższym poziomie
        while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
            stack.pop()
            pathStack.pop()
        }

        // Dodaj nowy element do stacka
        const item = {
            name: line,
            indent: indentLevel,
            level: stack.length
        }
        stack.push(item)
        pathStack.push(line)

        // Debug: pokaż ścieżkę dla każdej linii
        if (i < 10) { // Pokaż pierwsze 10 linii
            console.log(`[materials] Line ${i}: indent=${indentLevel}, path=${pathStack.join('::')}`)
        }

        // Jeśli to materiał (nie kategoria), dodaj do listy
        if (line.startsWith('M-') || line.includes('mm') || line.includes('MM') ||
            line === 'DO_GIECIA' || line === 'TRUDNOPALNA' || line === 'LAMINOWANA' ||
            line === 'SUROWA' || line === 'KATOWNIKI' || line === 'KOMOROWY 10MM') {

            // Zbuduj pełną ścieżkę
            const fullPath = pathStack.join('::')
            const id = fullPath.toLowerCase().replace(/[^a-z0-9]+/g, '-')

            // Określ typ materiału
            let materialType = 'category'
            if (line.startsWith('M-')) materialType = 'material'
            else if (line.includes('mm') || line.includes('MM')) materialType = 'thickness'
            else if (['DO_GIECIA', 'TRUDNOPALNA', 'LAMINOWANA', 'SUROWA'].includes(line)) materialType = 'variant'

            // Określ kategorię
            const category = pathStack.slice(1) // Bez _MATERIAL

            const material = {
                id,
                name: line,
                fullPath,
                materialType,
                category,
                level: pathStack.length - 1
            }

            materials.push(material)
            console.log(`[materials] Added material: ${JSON.stringify(material)}`)
        }
    }

    console.log(`[materials] Parsed ${materials.length} material entries from rhino.txt`)
    return materials
}

function loadMaterials() {
    try {
        materialsFlat = parseRhinoTxtToMaterials(RHINO_TXT);
        console.log(`[materials] Loaded ${materialsFlat.length} entries from rhino.txt`);
    } catch (e) {
        console.error('[materials] Failed to load:', e.message);
        materialsFlat = [];
    }
}

function loadStocks() {
    try {
        if (!fs.existsSync(STOCKS_JSON)) {
            // Generuj bazę materiałów w magazynie na podstawie rhino.txt
            const seed = {};

            materialsFlat.forEach(m => {
                if (m.materialType === 'variant' || m.materialType === 'thickness') {
                    // Dla wariantów i grubości generuj materiał magazynowy
                    const stockData = {
                        stock: Math.floor(Math.random() * 50) + 10, // Losowy stock 10-60
                        minStock: Math.floor(Math.random() * 10) + 5, // Losowy minStock 5-15
                        name: m.fullPath,
                        materialType: m.materialType,
                        category: m.category,
                        unit: m.materialType === 'thickness' ? 'arkusz' : 'sztuka',
                        price: Math.floor(Math.random() * 100) + 20, // Losowa cena 20-120
                        supplier: getRandomSupplier(m.category[0]),
                        location: generateLocation(m.category[0], m.category[1])
                    };
                    seed[m.id] = stockData;
                }
            });

            fs.writeFileSync(STOCKS_JSON, JSON.stringify(seed, null, 2));
            console.log(`[stocks] Generated ${Object.keys(seed).length} material entries for warehouse`);
        }
        stocks = JSON.parse(fs.readFileSync(STOCKS_JSON, 'utf8'));
        console.log(`[stocks] Loaded ${Object.keys(stocks).length} entries`);
    } catch (e) {
        console.error('[stocks] Failed to load:', e.message);
        stocks = {};
    }
}

// Funkcje pomocnicze do generowania danych magazynowych
function getRandomSupplier(materialType) {
    const suppliers = {
        'MDF': ['Kronopol', 'Pfleiderer', 'Egger'],
        'SKLEJKA': ['Paged', 'Kronopol', 'Egger'],
        'WIOROWA': ['Egger', 'Kronopol', 'Pfleiderer'],
        'ALUMINIUM': ['AluMetal', 'Alumet', 'AluTech'],
        'PLEXI': ['PlastPro', 'PlexiTech', 'AcrylicPro'],
        'GK': ['Gyproc', 'Rigips', 'Knauf'],
        'HDF': ['Kronopol', 'Egger', 'Pfleiderer']
    };

    const materialSuppliers = suppliers[materialType] || ['Standard Supplier'];
    return materialSuppliers[Math.floor(Math.random() * materialSuppliers.length)];
}

function generateLocation(materialType, thickness) {
    const sections = {
        'MDF': 'A',
        'SKLEJKA': 'B',
        'WIOROWA': 'C',
        'ALUMINIUM': 'D',
        'PLEXI': 'E',
        'GK': 'F',
        'HDF': 'G'
    };

    const section = sections[materialType] || 'X';
    const row = Math.floor(Math.random() * 5) + 1;
    const col = Math.floor(Math.random() * 10) + 1;

    return `${section}${row}-${col.toString().padStart(2, '0')}`;
}

function saveStocks() {
    fs.writeFileSync(STOCKS_JSON, JSON.stringify(stocks, null, 2));
}

function loadDemands() {
    try {
        if (!fs.existsSync(DEMANDS_JSON)) fs.writeFileSync(DEMANDS_JSON, JSON.stringify([], null, 2));
        demands = JSON.parse(fs.readFileSync(DEMANDS_JSON, 'utf8'));
    } catch (e) {
        console.error('[demands] Failed to load:', e.message);
        demands = [];
    }
}

function saveDemands() {
    fs.writeFileSync(DEMANDS_JSON, JSON.stringify(demands, null, 2));
}

function loadTiles() {
    try {
        if (!fs.existsSync(TILES_JSON)) fs.writeFileSync(TILES_JSON, JSON.stringify([], null, 2));
        const raw = fs.readFileSync(TILES_JSON, 'utf8');
        tiles = JSON.parse(raw);
        if (!Array.isArray(tiles)) tiles = [];
    } catch (e) {
        console.error('[tiles] Failed to load:', e.message);
        tiles = [];
    }
}

function saveTiles() {
    try {
        fs.writeFileSync(TILES_JSON, JSON.stringify(tiles, null, 2));
    } catch (e) {
        console.error('[tiles] Failed to save:', e.message);
    }
}

// Helper: hydrate materials from stocks if materialsFlat is empty
function hydrateMaterialsFromStocksIfEmpty() {
    try {
        if (materialsFlat.length > 0) return;
        const keys = Object.keys(stocks || {});
        const next = [];
        for (const id of keys) {
            const s = stocks[id];
            if (!s) continue;
            const fullPath = typeof s.name === 'string' ? s.name : undefined;
            if (!fullPath || !fullPath.startsWith('_MATERIAL::')) continue;
            const parts = fullPath.split('::');
            const level = parts.length - 1;
            let materialType = 'category';
            if (parts.length === 2) materialType = 'material';
            else if (parts.length === 3) materialType = 'thickness';
            else if (parts.length >= 4) materialType = 'variant';
            next.push({
                id,
                name: parts[parts.length - 1],
                fullPath,
                materialType,
                category: parts.slice(1),
                level
            });
        }
        if (next.length) {
            materialsFlat = next;
            console.log(`[materials] Hydrated ${materialsFlat.length} materials from stocks.json`);
        }
    } catch (e) {
        console.warn('[materials] hydrate from stocks failed:', e.message);
    }
}

// Wire up initial load
loadMaterials();
loadStocks();
loadDemands();
loadTiles();
// If for any reason materialsFlat is empty, try to hydrate from stocks
hydrateMaterialsFromStocksIfEmpty();

// Watch for changes
try {
    chokidar.watch([RHINO_TXT, STOCKS_JSON], { ignoreInitial: true }).on('all', (event, p) => {
        if (p && p.endsWith('rhino.txt')) {
            loadMaterials();
            // Ensure stocks has entries for new materials
            let changed = false;
            for (const m of materialsFlat) if (!stocks[m.id]) { stocks[m.id] = { stock: 0, minStock: 0, name: m.fullPath }; changed = true; }
            if (changed) saveStocks();
        }
        if (p && p.endsWith('stocks.json')) {
            loadStocks();
            hydrateMaterialsFromStocksIfEmpty();
        }
    });
} catch (e) {
    console.warn('[watch] disabled:', e.message);
}

// Manual reload endpoint (useful for Dockerized runtime)
app.post('/api/materials/reload', (_req, res) => {
    try {
        loadMaterials();
        loadStocks();
        hydrateMaterialsFromStocksIfEmpty();
        return res.json({ ok: true, materials: materialsFlat.length, stocks: Object.keys(stocks).length });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e.message });
    }
});

// GET materials list (flat) from DB
app.get('/api/materials', (_req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare(`
            SELECT m.id, m.category, m.type, COALESCE(m.name, '') AS name,
                   m.base_uom AS unit, m.price_per_uom AS unitCost,
                   m.format_raw, m.pricing_uom,
                   COALESCE(s.quantity, 0) AS quantity,
                   COALESCE(s.reserved, 0) AS reserved
            FROM materials m
            LEFT JOIN stocks s ON s.material_id = m.id
            ORDER BY m.category, m.type, m.thickness_mm
        `).all()
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// GET flat materials for backward compatibility
app.get('/api/materials/flat', (_req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare(`
            SELECT m.id, (m.category||'::'||m.type||'::'||COALESCE(m.name,'')||'::'||COALESCE(m.format_raw,'')) AS name,
                   COALESCE(s.quantity,0) AS stock,
                   COALESCE(s.reserved,0) AS minStock
            FROM materials m LEFT JOIN stocks s ON s.material_id = m.id
        `).all()
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// POST set stock/minStock for a material
app.post('/api/materials/:id/stock', (req, res) => {
    const id = req.params.id;
    const { stock, minStock } = req.body || {};
    if (!stocks[id]) stocks[id] = { stock: 0, minStock: 0, name: id };
    if (typeof stock === 'number') stocks[id].stock = stock;
    if (typeof minStock === 'number') stocks[id].minStock = minStock;
    saveStocks();
    res.json({ ok: true, id, ...stocks[id] });
});

// Demands endpoints
app.get('/api/demands', (req, res) => {
    try {
        const { projectId, tileId } = req.query || {}
        const { getDb } = require('./db')
        const d = getDb()
        let sql = 'SELECT * FROM demands WHERE 1=1'
        const params = {}
        if (projectId) { sql += ' AND project_id = @projectId'; params.projectId = projectId }
        if (tileId) { sql += ' AND tile_id = @tileId'; params.tileId = tileId }
        const rows = d.prepare(sql).all(params)
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.post('/api/demands', (req, res) => {
    try {
        const { materialId, name, requiredQty, projectId, tileId } = req.body || {}
        if (!materialId || typeof requiredQty !== 'number') return res.status(400).json({ error: 'materialId and requiredQty are required' })
        const { getDb } = require('./db')
        const d = getDb()
        const id = `dem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const createdAt = new Date().toISOString()
        const rec = { id, material_id: materialId, name: name || materialId, required_qty: requiredQty, created_at: createdAt, status: 'New', project_id: projectId || null, tile_id: tileId || null }
        d.prepare(`INSERT INTO demands (id, material_id, name, required_qty, created_at, status, project_id, tile_id) VALUES (@id,@material_id,@name,@required_qty,@created_at,@status,@project_id,@tile_id)`).run(rec)
        res.json({ id, materialId, name: rec.name, requiredQty, createdAt, status: 'New', projectId: projectId || null, tileId: tileId || null })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Attach demand to a specific tile (element) — used when updating element from Rhino
// POST /api/tiles/:tileId/demands { materialId, requiredQty, projectId?, name? }
app.post('/api/tiles/:tileId/demands', (req, res) => {
    try {
        const tileId = req.params.tileId
        const { materialId, requiredQty, projectId, name } = req.body || {}
        if (!tileId || !materialId || typeof requiredQty !== 'number') return res.status(400).json({ error: 'tileId, materialId and requiredQty are required' })
        const { getDb } = require('./db')
        const d = getDb()
        const id = `dem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const createdAt = new Date().toISOString()
        const rec = { id, material_id: materialId, name: name || materialId, required_qty: requiredQty, created_at: createdAt, status: 'New', project_id: projectId || null, tile_id: tileId }
        d.prepare(`INSERT INTO demands (id, material_id, name, required_qty, created_at, status, project_id, tile_id) VALUES (@id,@material_id,@name,@required_qty,@created_at,@status,@project_id,@tile_id)`).run(rec)
        res.json({ id, materialId, name: rec.name, requiredQty, createdAt, status: 'New', projectId: projectId || null, tileId })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Rhino snapshot endpoint: accept list of material paths and optional consumptions to create demands
// Payload example:
// {
//   materials: ["_MATERIAL::MDF::18mm", "_MATERIAL::PLEXI::4mm::opal"],
//   consumptions: [{ fullPath: "_MATERIAL::MDF::18mm", requiredQty: 6.5 }]
// }
app.post('/api/rhino/snapshot', (req, res) => {
    try {
        const { materials: materialPaths, consumptions } = req.body || {};
        if (!Array.isArray(materialPaths)) return res.status(400).json({ error: 'materials must be an array' });

        // Update materialsFlat from provided paths
        const next = [];
        for (const line of materialPaths) {
            if (typeof line !== 'string') continue;
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('_MATERIAL::')) continue;
            const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const parts = trimmed.split('::');
            const level = parts.length - 1;
            let materialType = 'category';
            if (parts.length === 2) materialType = 'material';
            else if (parts.length === 3) materialType = 'thickness';
            else if (parts.length >= 4) materialType = 'variant';
            next.push({ id, name: parts[parts.length - 1], fullPath: trimmed, materialType, category: parts.slice(1), level });
            if (!stocks[id]) stocks[id] = { stock: 0, minStock: 0, name: trimmed };
        }
        materialsFlat = next;
        saveStocks();

        // Optionally create demands
        const created = [];
        if (Array.isArray(consumptions)) {
            for (const c of consumptions) {
                const fullPath = c.fullPath || c.name;
                const materialId = c.materialId || (typeof fullPath === 'string' ? fullPath.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
                const requiredQty = Number(c.requiredQty);
                if (!materialId || !Number.isFinite(requiredQty)) continue;

                // If stock exists and would drop below min, create a demand
                const s = stocks[materialId] || { stock: 0, minStock: 0, name: fullPath || materialId };
                const willBeShort = s.stock - requiredQty < s.minStock;
                if (willBeShort || c.force === true) {
                    const id = `dem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
                    const item = { id, materialId, name: s.name || fullPath || materialId, requiredQty, createdAt: new Date().toISOString(), status: 'New' };
                    demands.push(item);
                    created.push(item);
                }
            }
            if (created.length) saveDemands();
        }

        return res.json({ ok: true, materials: materialsFlat.length, createdDemands: created.length });
    } catch (e) {
        console.error('snapshot error', e);
        return res.status(500).json({ error: 'internal_error' });
    }
});

app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'fabryka-backend' });
});

// --- Clients & Projects (DB) ---
app.get('/api/clients', (_req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare('SELECT * FROM clients ORDER BY created_at DESC').all()
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.get('/api/projects', (req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const { clientId, status } = req.query || {}
        let sql = 'SELECT * FROM projects WHERE 1=1'
        const params = {}
        if (clientId) { sql += ' AND client_id=@clientId'; params.clientId = clientId }
        if (status) { sql += ' AND status=@status'; params.status = status }
        sql += ' ORDER BY created_at DESC'
        const rows = d.prepare(sql).all(params)
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.post('/api/projects', (req, res) => {
    try {
        const { client_id, name, status, deadline } = req.body || {}
        if (!client_id || !name) return res.status(400).json({ error: 'client_id and name are required' })
        const { getDb } = require('./db')
        const d = getDb()
        const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const now = new Date().toISOString()
        d.prepare('INSERT INTO projects (id, client_id, name, status, deadline, archived_at, created_at) VALUES (?,?,?,?,?,?,?)')
            .run(id, client_id, name, status || 'new', deadline || null, null, now)
        const created = d.prepare('SELECT * FROM projects WHERE id = ?').get(id)
        res.json(created)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.put('/api/projects/:id', (req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const id = req.params.id
        const exist = d.prepare('SELECT * FROM projects WHERE id = ?').get(id)
        if (!exist) return res.status(404).json({ error: 'not_found' })
        const patch = req.body || {}
        const next = { ...exist, ...patch }
        d.prepare('UPDATE projects SET client_id=@client_id, name=@name, status=@status, deadline=@deadline, archived_at=@archived_at WHERE id=@id')
            .run({ id, client_id: next.client_id, name: next.name, status: next.status, deadline: next.deadline, archived_at: next.archived_at })
        const updated = d.prepare('SELECT * FROM projects WHERE id = ?').get(id)
        res.json(updated)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// --- Tiles CRUD ---
// Data model (minimal): { id, name, quantity?, material?, status, project?, files?, description? }
// Statuses: 'do_review' | 'zaakceptowany' | 'w_produkcji' | 'gotowy'

function sanitizeStatus(s) {
    const allowed = ['do_review', 'zaakceptowany', 'w_produkcji', 'gotowy'];
    return allowed.includes(s) ? s : 'do_review';
}

app.get('/api/tiles', (req, res) => {
    try {
        const { projectId } = req.query || {}
        const { getDb } = require('./db')
        const d = getDb()
        let sql = 'SELECT * FROM tiles WHERE 1=1'
        const params = {}
        if (projectId) { sql += ' AND project_id = @projectId'; params.projectId = projectId }
        const rows = d.prepare(sql).all(params)
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.post('/api/tiles', (req, res) => {
    try {
        const { id, name, quantity, project, description } = req.body || {}
        if (!name) return res.status(400).json({ error: 'name is required' })
        const tileId = id && typeof id === 'string' ? id : `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const { getDb } = require('./db')
        const d = getDb()
        const now = new Date().toISOString()
        d.prepare(`INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at)
                   VALUES (@id, @project_id, @code, @name, @quantity, @stage, @width_mm, @height_mm, @thickness_mm, @description, @created_at)`).run({
            id: tileId,
            project_id: project || null,
            code: null,
            name,
            quantity: Number.isFinite(quantity) ? Number(quantity) : 1,
            stage: 'cnc',
            width_mm: null,
            height_mm: null,
            thickness_mm: null,
            description: description || '',
            created_at: now
        })
        res.json({ id: tileId, project_id: project || null, name, quantity: Number.isFinite(quantity) ? Number(quantity) : 1, stage: 'cnc', description: description || '', created_at: now })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.put('/api/tiles/:id', (req, res) => {
    try {
        const id = req.params.id
        const patch = req.body || {}
        const { getDb } = require('./db')
        const d = getDb()
        const existing = d.prepare('SELECT * FROM tiles WHERE id = ?').get(id)
        if (!existing) return res.status(404).json({ error: 'not_found' })
        const next = { ...existing, ...patch }
        d.prepare(`UPDATE tiles SET project_id=@project_id, code=@code, name=@name, quantity=@quantity, stage=@stage, width_mm=@width_mm, height_mm=@height_mm, thickness_mm=@thickness_mm, description=@description WHERE id=@id`).run({
            id,
            project_id: next.project_id ?? next.project ?? null,
            code: next.code ?? null,
            name: next.name,
            quantity: Number.isFinite(next.quantity) ? Number(next.quantity) : 1,
            stage: next.stage || existing.stage,
            width_mm: next.width_mm ?? null,
            height_mm: next.height_mm ?? null,
            thickness_mm: next.thickness_mm ?? null,
            description: next.description ?? ''
        })
        const updated = d.prepare('SELECT * FROM tiles WHERE id = ?').get(id)
        res.json(updated)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.delete('/api/tiles/:id', (req, res) => {
    try {
        const id = req.params.id
        const { getDb } = require('./db')
        const d = getDb()
        const info = d.prepare('DELETE FROM tiles WHERE id = ?').run(id)
        if (info.changes === 0) return res.status(404).json({ error: 'not_found' })
        res.json({ ok: true, id })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// --- File uploads ---
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const base = path.basename(file.originalname);
        const safe = base.replace(/[^a-zA-Z0-9._-]+/g, '_');
        const prefix = req.query && typeof req.query.tileId === 'string' ? `${req.query.tileId}__` : '';
        const name = `${prefix}${Date.now()}_${safe}`;
        cb(null, name);
    }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'file_required' });
        const publicPath = `/files/${req.file.filename}`;
        const tileId = typeof req.query.tileId === 'string' ? req.query.tileId : null;
        // Optionally attach file to tile
        if (tileId) {
            const t = tiles.find(tt => tt.id === tileId);
            if (t) {
                const f = { name: req.file.originalname, path: publicPath, mime: req.file.mimetype, size: req.file.size };
                t.files = Array.isArray(t.files) ? [...t.files, f] : [f];
                saveTiles();
            }
        }
        res.json({ ok: true, path: publicPath, name: req.file.originalname, mime: req.file.mimetype, size: req.file.size });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// BOM consolidation via backend (fallback for view)
app.get('/api/materials/bom', (req, res) => {
    try {
        const { projectId } = req.query || {}
        const pid = typeof projectId === 'string' ? projectId : null
        const rows = []
        if (pid) {
            const projectTiles = tiles.filter(t => t.project === pid)
            const map = new Map()
            for (const t of projectTiles) {
                const bom = Array.isArray(t.bom) ? t.bom : []
                for (const bi of bom) {
                    const key = `${bi.name}||${bi.unit}`
                    const prev = map.get(key) || 0
                    map.set(key, prev + (Number(bi.quantity) || 0))
                }
            }
            for (const [key, qty] of map.entries()) {
                const [name, unit] = key.split('||')
                rows.push({ project_id: pid, name, unit, quantity: qty })
            }
        }
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Concept and Estimate endpoints remain (omitted here for brevity in this file excerpt)

app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
});


