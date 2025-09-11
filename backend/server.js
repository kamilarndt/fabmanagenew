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
// Global projects files root directory
// Prefer env PROJECTS_ROOT_DIR (e.g., /mnt/projects in Docker) or fall back to common Windows path Z:\\_NoweRozdanie
const KNOWN_WINDOWS_ROOTS = ['Z:/_NoweRozdanie', 'Z:\\_NoweRozdanie'];
const FALLBACK_LOCAL_ROOT = path.join(__dirname, '..', 'PROJECTS_FILES');
let PROJECTS_ROOT_DIR = process.env.PROJECTS_ROOT_DIR;
// Load persisted settings if present (env still takes precedence)
try {
    if (!PROJECTS_ROOT_DIR && fs.existsSync(SETTINGS_JSON)) {
        const cfg = JSON.parse(fs.readFileSync(SETTINGS_JSON, 'utf8'));
        if (cfg && typeof cfg.projectsRootDir === 'string') {
            PROJECTS_ROOT_DIR = cfg.projectsRootDir;
        }
    }
} catch (e) {
    console.warn('[fs] Failed to read settings file:', e.message);
}
if (!PROJECTS_ROOT_DIR) {
    // Try known Windows paths
    const existing = KNOWN_WINDOWS_ROOTS.find(p => {
        try { return fs.existsSync(p); } catch { return false; }
    });
    PROJECTS_ROOT_DIR = existing || FALLBACK_LOCAL_ROOT;
}

// Ensure fallback local root exists if selected
try {
    if (!fs.existsSync(PROJECTS_ROOT_DIR) && PROJECTS_ROOT_DIR === FALLBACK_LOCAL_ROOT) {
        fs.mkdirSync(PROJECTS_ROOT_DIR, { recursive: true });
    }
} catch (e) {
    console.warn('[fs] Unable to ensure projects root directory:', PROJECTS_ROOT_DIR, e.message);
}
const RHINO_TXT = path.join(__dirname, 'rhino.txt');
const SETTINGS_JSON = path.join(__dirname, 'projects-config.json');
const STOCKS_JSON = path.join(__dirname, 'stocks.json');
const DEMANDS_JSON = path.join(__dirname, 'demands.json');
const TILES_JSON = path.join(__dirname, 'tiles.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: dbReady ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        projectsRoot: PROJECTS_ROOT_DIR,
        version: '1.0.0'
    });
});
app.use('/files', express.static(UPLOADS_DIR));

// Ensure required data files and directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TILES_JSON)) fs.writeFileSync(TILES_JSON, JSON.stringify([], null, 2));

app.get('/health', (_req, res) => res.status(200).json({ ok: true, db: dbReady }));

// ---------- Filesystem helpers for per-project folder structure ----------
/** Sanitize a name for filesystem usage */
function sanitizeName(name) {
    if (!name) return 'unnamed';
    // Replace illegal characters on Windows and Unix, trim dots/spaces
    const replaced = String(name)
        .replace(/[\\/:*?"<>|]/g, '_')
        .replace(/\s+/g, ' ')
        .trim();
    return replaced.replace(/\.+$/g, '');
}

function canWriteDir(dirPath) {
    try {
        const testFile = path.join(dirPath, `.perm_test_${Date.now()}.tmp`);
        fs.writeFileSync(testFile, 'ok');
        fs.unlinkSync(testFile);
        return true;
    } catch {
        return false;
    }
}

// Settings endpoints
app.get('/api/settings/files-root', (_req, res) => {
    const current = PROJECTS_ROOT_DIR;
    let exists = false, writable = false;
    try { exists = fs.existsSync(current); } catch { exists = false; }
    if (exists) writable = canWriteDir(current);
    res.json({ path: current, exists, writable });
});

app.post('/api/settings/files-root', (req, res) => {
    try {
        const { path: newPath } = req.body || {};
        if (!newPath || typeof newPath !== 'string') return res.status(400).json({ error: 'path_required' });
        const normalized = newPath.replace(/^"|"$/g, '');
        if (!fs.existsSync(normalized)) {
            fs.mkdirSync(normalized, { recursive: true });
        }
        if (!canWriteDir(normalized)) return res.status(400).json({ error: 'not_writable', path: normalized });
        PROJECTS_ROOT_DIR = normalized;
        fs.writeFileSync(SETTINGS_JSON, JSON.stringify({ projectsRootDir: PROJECTS_ROOT_DIR }, null, 2));
        try { const { auditLog } = require('./db'); auditLog({ action: 'settings.update_root', entityType: 'settings', entityId: 'files-root', payload: { path: PROJECTS_ROOT_DIR } }) } catch { }
        res.json({ ok: true, path: PROJECTS_ROOT_DIR });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Manual filesystem sync endpoint
// Accepts either identifiers (clientId, projectId) or explicit names (clientName, projectName)
// Body: { clientId?, projectId?, clientName?, projectName?, modules?: string[]|string, hasClientMaterials?: boolean }
app.post('/api/fs-sync', async (req, res) => {
    try {
        let { clientId, projectId, clientName, projectName, modules, hasClientMaterials } = req.body || {}

        // Resolve names from DB if ids are provided and DB is available
        if ((!clientName || !projectName) && dbReady) {
            try {
                const { getDb } = require('./db')
                const d = getDb()
                if (clientId && !clientName) {
                    const c = d.prepare('SELECT name FROM clients WHERE id = ?').get(clientId)
                    if (c && c.name) clientName = c.name
                }
                if (projectId && !projectName) {
                    const p = d.prepare('SELECT name, client_id, modules FROM projects WHERE id = ?').get(projectId)
                    if (p) {
                        projectName = projectName || p.name
                        // Prefer modules stored in DB if not provided
                        if (modules == null && p.modules) {
                            try { modules = JSON.parse(p.modules) } catch { /* ignore */ }
                        }
                        if (!clientId && p.client_id) clientId = p.client_id
                        if (!clientName && clientId) {
                            const c = d.prepare('SELECT name FROM clients WHERE id = ?').get(clientId)
                            if (c && c.name) clientName = c.name
                        }
                    }
                }
            } catch (e) {
                // ignore db lookup errors and continue with provided data
            }
        }

        if (!clientName || !projectName) {
            return res.status(400).json({ error: 'clientName_and_projectName_required' })
        }

        const mods = Array.isArray(modules)
            ? modules
            : (typeof modules === 'string' ? (() => { try { return JSON.parse(modules) } catch { return [] } })() : [])
        const hasClientMats = typeof hasClientMaterials === 'boolean'
            ? hasClientMaterials
            : mods.includes('materialy')

        const result = ensureProjectFolders({
            clientName,
            projectName,
            modules: mods,
            hasClientMaterials: hasClientMats
        })

        try { const { auditLog } = require('./db'); auditLog({ action: 'fs.sync', entityType: 'project', entityId: projectId || projectName, payload: { clientName, projectName, modules: mods, hasClientMaterials: hasClientMats, result } }) } catch { }
        if (result && !result.error) return res.json({ ok: true, ...result })
        return res.status(500).json({ ok: false, error: result?.error || 'fs_sync_failed' })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

/**
 * Ensure folder structure exists for a project under PROJECTS_ROOT_DIR:
 * <root>/<Client Name>/<Project Name>/[wycena|koncepcja|materialy_od_klienta|produkcja/elementy/{pdf,dxf,preview}]
 */
function ensureProjectFolders({ clientName, projectName, modules, hasClientMaterials }) {
    try {
        const clientDir = path.join(PROJECTS_ROOT_DIR, sanitizeName(clientName || 'Klient'));
        const projectDir = path.join(clientDir, sanitizeName(projectName || 'Projekt'));
        const created = [];

        const ensure = (p) => {
            if (!fs.existsSync(p)) {
                fs.mkdirSync(p, { recursive: true });
                created.push(p);
            }
            return p;
        };

        ensure(clientDir);
        ensure(projectDir);

        const mods = Array.isArray(modules)
            ? modules
            : (typeof modules === 'string' ? (() => { try { return JSON.parse(modules); } catch { return []; } })() : []);

        if (mods.includes('wycena')) {
            ensure(path.join(projectDir, 'wycena'));
        }
        if (mods.includes('koncepcja')) {
            ensure(path.join(projectDir, 'koncepcja'));
        }
        if (hasClientMaterials) {
            ensure(path.join(projectDir, 'materialy_od_klienta'));
        }
        if (mods.includes('produkcja')) {
            const prod = ensure(path.join(projectDir, 'produkcja'));
            const elements = ensure(path.join(prod, 'elementy'));
            ensure(path.join(elements, 'pdf'));
            ensure(path.join(elements, 'dxf'));
            ensure(path.join(elements, 'preview'));
        }

        return { root: PROJECTS_ROOT_DIR, clientDir, projectDir, created };
    } catch (e) {
        console.warn('[fs] ensureProjectFolders failed:', e.message);
        return { error: e.message, root: PROJECTS_ROOT_DIR };
    }
}

// Admin endpoint to regenerate realistic data
app.post('/admin/regenerate-data', (_req, res) => {
    if (!dbReady) {
        return res.status(500).json({ error: 'Database not available' });
    }

    try {
        const { getDb, generateRealisticProductionData } = require('./db');
        const d = getDb();

        // Force regeneration by clearing existing data
        console.log('🗑️ Clearing existing data for fresh regeneration...');
        d.exec(`
            DELETE FROM accommodation;
            DELETE FROM logistics;
            DELETE FROM tile_materials;
            DELETE FROM tiles;
            DELETE FROM projects;
            DELETE FROM clients;
        `);

        console.log('🎬 Calling generateRealisticProductionData...');
        generateRealisticProductionData();
        res.json({ success: true, message: 'Realistic production data regenerated successfully' });
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin endpoint to generate comprehensive demo library
app.post('/admin/generate-demo-library', (_req, res) => {
    if (!dbReady) {
        return res.status(500).json({ error: 'Database not available' });
    }

    try {
        const { generateCompleteDemoLibrary } = require('./generate-demo-library');

        console.log('🎬 Starting comprehensive demo library generation...');
        generateCompleteDemoLibrary();

        res.json({
            success: true,
            message: 'Comprehensive demo library generated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error generating demo library:', error);
        res.status(500).json({ error: error.message });
    }
});

// DB status and backup endpoints
app.get('/admin/db-status', (_req, res) => {
    try {
        const { getCurrentDbPath } = require('./db');
        const p = getCurrentDbPath();
        let exists = false;
        let size = 0;
        let lastModified = null;
        try {
            exists = fs.existsSync(p)
            if (exists) {
                const stat = fs.statSync(p)
                size = stat.size
                lastModified = stat.mtime.toISOString()
            }
        } catch { exists = false }

        res.json({
            path: p,
            exists,
            size,
            lastModified,
            projectsRoot: PROJECTS_ROOT_DIR,
            writable: canWriteDir(PROJECTS_ROOT_DIR)
        })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Filesystem status endpoint
app.get('/admin/fs-status', (_req, res) => {
    try {
        const backupDir = path.join(PROJECTS_ROOT_DIR, '_db_backups');
        const offlineDir = path.join(PROJECTS_ROOT_DIR, '.fabmanage');

        const status = {
            projectsRoot: PROJECTS_ROOT_DIR,
            projectsRootExists: fs.existsSync(PROJECTS_ROOT_DIR),
            projectsRootWritable: canWriteDir(PROJECTS_ROOT_DIR),
            backupDir: backupDir,
            backupDirExists: fs.existsSync(backupDir),
            offlineDir: offlineDir,
            offlineDirExists: fs.existsSync(offlineDir),
            timestamp: new Date().toISOString()
        };

        // Count projects in filesystem
        try {
            if (fs.existsSync(PROJECTS_ROOT_DIR)) {
                const clients = fs.readdirSync(PROJECTS_ROOT_DIR, { withFileTypes: true })
                    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
                let projectCount = 0;
                for (const client of clients) {
                    const clientPath = path.join(PROJECTS_ROOT_DIR, client.name);
                    const projects = fs.readdirSync(clientPath, { withFileTypes: true })
                        .filter(d => d.isDirectory())
                    projectCount += projects.length;
                }
                status.filesystemProjects = projectCount;
            }
        } catch (e) {
            status.filesystemProjects = 0;
        }

        res.json(status);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

app.post('/admin/db-backup', (_req, res) => {
    try {
        const { backupDatabase } = require('./db');
        const result = backupDatabase();
        if (!result.ok) return res.status(500).json(result);
        res.json(result)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// List available backups
app.get('/admin/db-backups', (_req, res) => {
    try {
        const { cleanupOldBackups } = require('./db');
        const backupDir = path.join(PROJECTS_ROOT_DIR, '_db_backups');

        if (!fs.existsSync(backupDir)) {
            return res.json({ backups: [], totalSize: 0 });
        }

        const files = fs.readdirSync(backupDir);
        const backupFiles = files
            .filter(f => f.startsWith('fabmanage.') && f.endsWith('.db'))
            .map(f => {
                const fullPath = path.join(backupDir, f);
                const stat = fs.statSync(fullPath);
                return {
                    name: f,
                    path: fullPath,
                    size: stat.size,
                    created: stat.mtime.toISOString(),
                    isLatest: f === 'fabmanage.latest.db'
                };
            })
            .sort((a, b) => new Date(b.created) - new Date(a.created));

        const totalSize = backupFiles.reduce((sum, f) => sum + f.size, 0);

        res.json({
            backups: backupFiles,
            totalSize,
            count: backupFiles.length,
            backupDir
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Restore from backup
app.post('/admin/db-restore', (req, res) => {
    try {
        const { backupName } = req.body || {};
        if (!backupName) return res.status(400).json({ error: 'backupName required' });

        const backupDir = path.join(PROJECTS_ROOT_DIR, '_db_backups');
        const backupPath = path.join(backupDir, backupName);

        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ error: 'backup not found' });
        }

        const { getCurrentDbPath } = require('./db');
        const currentDbPath = getCurrentDbPath();

        // Create a backup of current DB before restore
        const { backupDatabase } = require('./db');
        const preRestoreBackup = backupDatabase();

        // Copy backup to current DB location
        fs.copyFileSync(backupPath, currentDbPath);

        res.json({
            ok: true,
            restored: backupName,
            preRestoreBackup: preRestoreBackup.ok ? preRestoreBackup.stamped : null
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Simple endpoint to check data status
app.get('/admin/data-status', (_req, res) => {
    if (!dbReady) {
        return res.status(500).json({ error: 'Database not available' });
    }

    try {
        const { getDb } = require('./db');
        const d = getDb();

        const projects = d.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
        const clients = d.prepare('SELECT COUNT(*) AS count FROM clients').get().count;
        const tiles = d.prepare('SELECT COUNT(*) AS count FROM tiles').get().count;
        const materials = d.prepare('SELECT COUNT(*) AS count FROM materials').get().count;

        res.json({ projects, clients, tiles, materials });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

// GET materials list with server-side filtering, sorting, and pagination
app.get('/api/materials', (req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()

        // Extract query parameters
        const {
            page = '1',
            limit = '20',
            search = '',
            category = '',
            supplier = '',
            status = '',
            sortBy = 'category',
            sortOrder = 'asc'
        } = req.query

        // Validate parameters
        const pageNum = parseInt(page, 10) || 1
        const limitNum = Math.min(parseInt(limit, 10) || 20, 100) // Max 100 items per page
        const offset = (pageNum - 1) * limitNum

        // Build WHERE conditions
        let whereConditions = []
        let params = []

        if (search) {
            whereConditions.push(`(
                LOWER(m.name) LIKE LOWER(?) OR 
                LOWER(m.category) LIKE LOWER(?) OR 
                LOWER(m.type) LIKE LOWER(?) OR
                LOWER(m.id) LIKE LOWER(?)
            )`)
            const searchParam = `%${search}%`
            params.push(searchParam, searchParam, searchParam, searchParam)
        }

        if (category) {
            whereConditions.push('m.category = ?')
            params.push(category)
        }

        if (supplier) {
            whereConditions.push('m.supplier = ?')
            params.push(supplier)
        }

        // Status filtering based on stock ratios
        if (status) {
            // Use COALESCE defaults so logic works even if min/max columns are not present
            // Default min_quantity=10 and max_quantity=100
            const denomMin = 'NULLIF(COALESCE(s.min_quantity, 10), 0)'
            const denomMax = 'NULLIF(COALESCE(s.max_quantity, 100), 0)'
            const ratioMin = `(COALESCE(s.quantity, 0) / ${denomMin})`
            const ratioMax = `(COALESCE(s.quantity, 0) / ${denomMax})`
            switch (status) {
                case 'critical':
                    whereConditions.push(`${ratioMin} < 0.5`)
                    break
                case 'low':
                    whereConditions.push(`${ratioMin} >= 0.5 AND ${ratioMin} < 1`)
                    break
                case 'normal':
                    whereConditions.push(`${ratioMin} >= 1 AND ${ratioMax} <= 1`)
                    break
                case 'excess':
                    whereConditions.push(`${ratioMax} > 1`)
                    break
            }
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''

        // Build ORDER BY clause
        let orderByClause = 'ORDER BY '
        switch (sortBy) {
            case 'name':
                orderByClause += 'm.name'
                break
            case 'price':
                orderByClause += 'm.price_per_uom'
                break
            case 'stock':
                orderByClause += 's.quantity'
                break
            case 'category':
            default:
                orderByClause += 'm.category, m.type'
                break
        }
        orderByClause += sortOrder === 'desc' ? ' DESC' : ' ASC'

        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(*) as total
            FROM materials m
            LEFT JOIN stocks s ON s.material_id = m.id
            ${whereClause}
        `
        const totalResult = d.prepare(countQuery).get(...params)
        const total = totalResult.total

        // Get paginated results
        const dataQuery = `
            SELECT m.id, m.category, m.type, COALESCE(m.name, '') AS name,
                   m.base_uom AS unit, m.price_per_uom AS unitCost,
                   m.format_raw, m.pricing_uom, m.thickness_mm,
                   m.supplier,
                   COALESCE(s.quantity, 0) AS quantity,
                   COALESCE(s.reserved, 0) AS reserved,
                   COALESCE(s.min_quantity, 10) AS min_quantity,
                   COALESCE(s.max_quantity, 100) AS max_quantity,
                   s.location
            FROM materials m
            LEFT JOIN stocks s ON s.material_id = m.id
            ${whereClause}
            ${orderByClause}
            LIMIT ? OFFSET ?
        `

        const rows = d.prepare(dataQuery).all(...params, limitNum, offset)

        // Calculate pagination info
        const totalPages = Math.ceil(total / limitNum)
        const hasNext = pageNum < totalPages
        const hasPrev = pageNum > 1

        res.json({
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        })
    } catch (e) {
        console.error('Error in /api/materials:', e)
        res.status(500).json({ error: e.message })
    }
});

// GET available categories
app.get('/api/materials/categories', (_req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare(`
            SELECT DISTINCT m.category, COUNT(*) as count
            FROM materials m
            GROUP BY m.category
            ORDER BY m.category
        `).all()
        res.json(rows)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// GET available suppliers
app.get('/api/materials/suppliers', (_req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare(`
            SELECT DISTINCT m.supplier, COUNT(*) as count
            FROM materials m
            WHERE m.supplier IS NOT NULL AND m.supplier != ''
            GROUP BY m.supplier
            ORDER BY count DESC, m.supplier
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

app.post('/api/clients', (req, res) => {
    try {
        const { name, email, phone, tax_id } = req.body || {}
        if (!name) return res.status(400).json({ error: 'name_required' })
        const { getDb } = require('./db')
        const d = getDb()
        const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const now = new Date().toISOString()
        d.prepare('INSERT INTO clients (id, name, email, phone, tax_id, created_at) VALUES (?,?,?,?,?,?)')
            .run(id, name, email || null, phone || null, tax_id || null, now)
        const created = d.prepare('SELECT * FROM clients WHERE id = ?').get(id)
        try { const { auditLog } = require('./db'); auditLog({ action: 'client.create', entityType: 'client', entityId: id, payload: created }) } catch { }
        res.json(created)
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
        const { client_id, name, status, deadline, modules, hasClientMaterials } = req.body || {}
        if (!client_id || !name) return res.status(400).json({ error: 'client_id and name are required' })
        const { getDb } = require('./db')
        const d = getDb()
        const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const now = new Date().toISOString()
        const modulesStr = Array.isArray(modules) ? JSON.stringify(modules) : (typeof modules === 'string' ? modules : null)
        d.prepare('INSERT INTO projects (id, client_id, name, status, deadline, archived_at, created_at, modules) VALUES (?,?,?,?,?,?,?,?)')
            .run(id, client_id, name, status || 'new', deadline || null, null, now, modulesStr)
        const created = d.prepare('SELECT * FROM projects WHERE id = ?').get(id)
        // Ensure filesystem structure for this project under the configured root
        try {
            const client = d.prepare('SELECT name FROM clients WHERE id = ?').get(client_id)
            const modulesArray = Array.isArray(modules) ? modules : (typeof modules === 'string' ? (() => { try { return JSON.parse(modules) } catch { return [] } })() : [])
            const hasClientMats = typeof hasClientMaterials === 'boolean' ? hasClientMaterials : modulesArray.includes('materialy')

            const fsResult = ensureProjectFolders({
                clientName: client?.name || 'Klient',
                projectName: name,
                modules: modulesArray,
                hasClientMaterials: hasClientMats
            })

            if (fsResult && !fsResult.error) {
                console.log(`[fs] Project folders created: ${fsResult.created?.length || 0} directories`)
                // Update project with filesystem info
                d.prepare('UPDATE projects SET location = ? WHERE id = ?').run(fsResult.projectDir, id)
            } else {
                console.warn('[fs] Project folder creation failed:', fsResult?.error)
            }
        } catch (e) {
            console.warn('[fs] ensureProjectFolders on create failed:', e.message)
        }
        try { const { auditLog } = require('./db'); auditLog({ action: 'project.create', entityType: 'project', entityId: id, payload: created }) } catch { }
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
        // If name or client changed, try to ensure folders exist (no destructive rename to avoid risks)
        try {
            const client = d.prepare('SELECT name FROM clients WHERE id = ?').get(updated.client_id)
            ensureProjectFolders({
                clientName: client?.name || 'Klient',
                projectName: updated.name,
                modules: (() => { try { return JSON.parse(updated.modules || '[]') } catch { return [] } })(),
                hasClientMaterials: false
            })
        } catch (e) { console.warn('[fs] ensureProjectFolders on update failed:', e.message) }
        try { const { auditLog } = require('./db'); auditLog({ action: 'project.update', entityType: 'project', entityId: id, payload: patch }) } catch { }
        res.json(updated)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Delete project: remove from DB and record audit; do NOT delete filesystem data automatically
app.delete('/api/projects/:id', (req, res) => {
    try {
        const { getDb } = require('./db')
        const d = getDb()
        const id = req.params.id
        const exist = d.prepare('SELECT * FROM projects WHERE id = ?').get(id)
        if (!exist) return res.status(404).json({ error: 'not_found' })
        // Will cascade delete tiles via FK
        const info = d.prepare('DELETE FROM projects WHERE id = ?').run(id)
        try { const { auditLog } = require('./db'); auditLog({ action: 'project.delete', entityType: 'project', entityId: id, payload: exist }) } catch { }
        res.json({ ok: info.changes > 0, id })
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

function mapBackendStageToUiStatus(stage) {
    const s = String(stage || '').toLowerCase()
    switch (s) {
        case 'design':
            return 'Projektowanie'
        case 'cnc':
        case 'finishing':
        case 'assembly':
        case 'qc':
            return 'W produkcji CNC'
        case 'done':
            return 'Gotowy do montażu'
        default:
            return 'Do akceptacji'
    }
}

function mapUiStatusToBackendStage(status) {
    const s = String(status || '').toLowerCase()
    if (s.includes('projekt')) return 'design'
    if (s.includes('produkcji') || s.includes('cięcia')) return 'cnc'
    if (s.includes('gotowy') || s.includes('zakoń')) return 'done'
    if (s.includes('zaakcept')) return 'cnc'
    return 'design'
}

function buildBomForTile(d, tileId) {
    try {
        const rows = d.prepare(`
            SELECT tm.material_id, tm.quantity, tm.waste_percent,
                   m.category, m.type, m.name as mname, m.base_uom, m.price_per_uom,
                   COALESCE(s.quantity, 0) as stock
            FROM tile_materials tm
            LEFT JOIN materials m ON m.id = tm.material_id
            LEFT JOIN stocks s ON s.material_id = tm.material_id
            WHERE tm.tile_id = ?
        `).all(tileId)
        return rows.map((r) => ({
            id: `${tileId}__${r.material_id}`,
            type: 'Materiał surowy',
            name: r.mname || `${r.category || ''} ${r.type || ''}`.trim(),
            quantity: Number(r.quantity) || 0,
            unit: r.base_uom || 'szt',
            supplier: undefined,
            status: (r.stock >= (Number(r.quantity) || 0)) ? 'Na stanie' : 'Do zamówienia',
            unitCost: r.price_per_uom || 0,
            materialId: r.material_id
        }))
    } catch (_) { return [] }
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
        const mapped = rows.map(r => ({
            id: r.id,
            name: r.name,
            status: mapBackendStageToUiStatus(r.stage),
            project: r.project_id || null,
            opis: r.description || '',
            link_model_3d: null,
            speckle_object_ids: null,
            załączniki: null,
            przypisany_projektant: null,
            termin: null,
            priority: 'Średni',
            bom: buildBomForTile(d, r.id),
            laborCost: 0,
            dxfFile: null,
            assemblyDrawing: null,
            group: null
        }))
        res.json(mapped)
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
            stage: 'design',
            width_mm: null,
            height_mm: null,
            thickness_mm: null,
            description: description || '',
            created_at: now
        })
        try { const { auditLog } = require('./db'); auditLog({ action: 'tile.create', entityType: 'tile', entityId: tileId, payload: { project, name, quantity, description } }) } catch { }
        const created = d.prepare('SELECT * FROM tiles WHERE id = ?').get(tileId)
        const ui = {
            id: created.id,
            name: created.name,
            status: mapBackendStageToUiStatus(created.stage),
            project: created.project_id || null,
            opis: created.description || '',
            termin: null,
            priority: 'Średni',
            bom: [],
            dxfFile: null,
            assemblyDrawing: null,
            group: null
        }
        res.json(ui)
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
        // Map UI status to backend stage if provided
        if (patch.status && !patch.stage) {
            next.stage = mapUiStatusToBackendStage(patch.status)
        }
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
        try { const { auditLog } = require('./db'); auditLog({ action: 'tile.update', entityType: 'tile', entityId: id, payload: patch }) } catch { }
        const ui = {
            id: updated.id,
            name: updated.name,
            status: mapBackendStageToUiStatus(updated.stage),
            project: updated.project_id || null,
            opis: updated.description || '',
            termin: null,
            priority: 'Średni',
            bom: buildBomForTile(d, updated.id),
            dxfFile: null,
            assemblyDrawing: null,
            group: null
        }
        res.json(ui)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

app.delete('/api/tiles/:id', (req, res) => {
    try {
        const id = req.params.id
        const { getDb } = require('./db')
        const d = getDb()
        const before = d.prepare('SELECT * FROM tiles WHERE id = ?').get(id)
        const info = d.prepare('DELETE FROM tiles WHERE id = ?').run(id)
        try { const { auditLog } = require('./db'); auditLog({ action: 'tile.delete', entityType: 'tile', entityId: id, payload: before }) } catch { }
        if (info.changes === 0) return res.status(404).json({ error: 'not_found' })
        res.json({ ok: true, id })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Enhanced tiles API endpoints
const { 
    createEnhancedTile, 
    updateEnhancedTile, 
    getEnhancedTiles, 
    getTileGroups 
} = require('./enhanced-tiles-api');

// Enhanced tile creation endpoint
app.post('/api/tiles/enhanced', (req, res) => {
    try {
        const tileData = req.body || {}
        const result = createEnhancedTile(tileData)
        res.json(result)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Enhanced tile update endpoint
app.put('/api/tiles/:id/enhanced', (req, res) => {
    try {
        const tileId = req.params.id
        const updateData = req.body || {}
        const result = updateEnhancedTile(tileId, updateData)
        res.json(result)
    } catch (e) {
        if (e.message === 'Tile not found') {
            res.status(404).json({ error: 'not_found' })
        } else {
            res.status(500).json({ error: e.message })
        }
    }
});

// Enhanced tiles listing endpoint
app.get('/api/tiles/enhanced', (req, res) => {
    try {
        const { projectId } = req.query || {}
        const result = getEnhancedTiles(projectId)
        res.json(result)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Get tile groups for a project
app.get('/api/tiles/groups', (req, res) => {
    try {
        const { projectId } = req.query || {}
        const result = getTileGroups(projectId)
        res.json(result)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Get single enhanced tile
app.get('/api/tiles/:id/enhanced', (req, res) => {
    try {
        const tileId = req.params.id
        const { getDb } = require('./db')
        const d = getDb()
        const tile = d.prepare('SELECT * FROM tiles WHERE id = ?').get(tileId)
        
        if (!tile) {
            return res.status(404).json({ error: 'not_found' })
        }

        const result = {
            id: tile.id,
            name: tile.name,
            code: tile.code,
            status: mapBackendStageToUiStatus(tile.stage),
            project: tile.project_id,
            opis: tile.description,
            termin: tile.deadline,
            priority: tile.priority,
            progress: tile.progress_percent,
            assigned_designer: tile.assigned_designer,
            group_id: tile.group_id,
            speckle_object_ids: tile.speckle_object_ids ? JSON.parse(tile.speckle_object_ids) : null,
            dxfFile: tile.dxf_file_path,
            assemblyDrawing: tile.assembly_drawing_path,
            bom: buildBomForTile(d, tile.id),
            laborCost: tile.labor_cost,
            materialCost: tile.material_cost,
            totalCost: tile.total_cost,
            notes: tile.notes,
            dimensions: {
                width_mm: tile.width_mm,
                height_mm: tile.height_mm,
                thickness_mm: tile.thickness_mm
            },
            created_at: tile.created_at,
            updated_at: tile.updated_at
        }

        res.json(result)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// Create tile from 3D selection (MVP): Body { project_id, name?, selectionIds: string[] }
app.post('/api/tiles/from-selection', (req, res) => {
    try {
        const { project_id, name, selectionIds } = req.body || {}
        if (!project_id || !Array.isArray(selectionIds) || selectionIds.length === 0) {
            return res.status(400).json({ error: 'project_id_and_selectionIds_required' })
        }
        const { getDb } = require('./db')
        const d = getDb()
        const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const now = new Date().toISOString()
        d.prepare(`INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at)
                   VALUES (@id, @project_id, @code, @name, @quantity, @stage, @width_mm, @height_mm, @thickness_mm, @description, @created_at)`).run({
            id,
            project_id,
            code: null,
            name: name || `SELECTION-${selectionIds.length}`,
            quantity: 1,
            stage: 'design',
            width_mm: null,
            height_mm: null,
            thickness_mm: null,
            description: '',
            created_at: now
        })
        // Store selection IDs next to uploads as sidecar JSON (no schema change needed for MVP)
        try {
            const selDir = path.join(UPLOADS_DIR, 'selections')
            if (!fs.existsSync(selDir)) fs.mkdirSync(selDir, { recursive: true })
            fs.writeFileSync(path.join(selDir, `${id}.json`), JSON.stringify({ ids: selectionIds }, null, 2))
        } catch { /* ignore */ }
        const created = d.prepare('SELECT * FROM tiles WHERE id = ?').get(id)
        res.json({ ...created, speckle_object_ids: selectionIds })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Minimal Speckle auth proxy (configure SPECKLE_TOKEN env)
app.get('/api/speckle/auth', (_req, res) => {
    try {
        const token = process.env.SPECKLE_TOKEN
        if (!token) return res.status(501).json({ error: 'not_configured' })
        res.json({ token })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// --- Object-material mapping per tile ---
// GET mapped materials for a tile
app.get('/api/tiles/:tileId/object-materials', (req, res) => {
    try {
        const tileId = req.params.tileId
        const { getDb } = require('./db')
        const d = getDb()
        const rows = d.prepare('SELECT * FROM tile_object_materials WHERE tile_id = ?').all(tileId)
        res.json(rows)
    } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST assign material to list of object ids
// Body: { objectIds: string[], material_id: string, quantity_per_object?, unit?, area?, volume? }
app.post('/api/tiles/:tileId/object-materials', (req, res) => {
    try {
        const tileId = req.params.tileId
        const { objectIds, material_id, quantity_per_object, unit, area, volume } = req.body || {}
        if (!Array.isArray(objectIds) || !material_id) return res.status(400).json({ error: 'objectIds_and_material_id_required' })
        const { getDb } = require('./db')
        const d = getDb()
        const now = new Date().toISOString()
        const upsert = d.prepare(`INSERT INTO tile_object_materials (tile_id, object_id, material_id, quantity_per_object, unit, area, volume, created_at)
            VALUES (@tile_id, @object_id, @material_id, @quantity_per_object, @unit, @area, @volume, @created_at)
            ON CONFLICT(tile_id, object_id) DO UPDATE SET material_id=excluded.material_id, quantity_per_object=excluded.quantity_per_object, unit=excluded.unit, area=excluded.area, volume=excluded.volume`)
        const tx = d.transaction(() => {
            for (const oid of objectIds) {
                upsert.run({ tile_id: tileId, object_id: oid, material_id, quantity_per_object: Number(quantity_per_object || 1), unit: unit || null, area: area || null, volume: volume || null, created_at: now })
            }
        })
        tx()
        const rows = d.prepare('SELECT * FROM tile_object_materials WHERE tile_id = ?').all(tileId)
        res.json({ ok: true, items: rows })
    } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE mapping for specific object id
app.delete('/api/tiles/:tileId/object-materials/:objectId', (req, res) => {
    try {
        const tileId = req.params.tileId
        const objectId = req.params.objectId
        const { getDb } = require('./db')
        const d = getDb()
        const info = d.prepare('DELETE FROM tile_object_materials WHERE tile_id = ? AND object_id = ?').run(tileId, objectId)
        res.json({ ok: info.changes > 0 })
    } catch (e) { res.status(500).json({ error: e.message }) }
})

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

// List uploaded files for a tile by scanning uploads directory for prefix `${tileId}__`
app.get('/api/tiles/:tileId/files', (req, res) => {
    try {
        const tileId = req.params.tileId
        if (!tileId) return res.status(400).json({ error: 'tileId_required' })
        const files = []
        try {
            const names = fs.readdirSync(UPLOADS_DIR)
            for (const fname of names) {
                if (!fname.startsWith(`${tileId}__`)) continue
                const full = path.join(UPLOADS_DIR, fname)
                const stat = fs.statSync(full)
                files.push({
                    name: fname.split('_').slice(1).join('_') || fname,
                    path: `/files/${fname}`,
                    size: stat.size
                })
            }
        } catch { /* ignore */ }
        res.json(files)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

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

// Health check endpoint for Docker
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        materials: materialsFlat.length,
        stocks: Object.keys(stocks).length
    })
})

// Concept and Estimate endpoints remain (omitted here for brevity in this file excerpt)

app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
});


