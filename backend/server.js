const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const app = express();

const PORT = process.env.PORT || 3001;
const RHINO_TXT = path.join(__dirname, 'rhino.txt');
const STOCKS_JSON = path.join(__dirname, 'stocks.json');
const DEMANDS_JSON = path.join(__dirname, 'demands.json');

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).send('OK'));

// --- Materials parsing from rhino.txt ---
let materialsFlat = [];
let stocks = {};
let demands = [];

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

// GET hierarchical materials structure for warehouse
app.get('/api/materials', (_req, res) => {
    // Build hierarchical structure from flat materials
    const hierarchy = {};

    materialsFlat.forEach(m => {
        const pathParts = m.fullPath.split('::');
        const s = stocks[m.id] || { stock: 0, minStock: 0 };

        let currentLevel = hierarchy;
        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    subcategories: {},
                    materials: [],
                    stock: 0,
                    minStock: 0,
                    count: 0
                };
            }

            // Add stock info to each level
            if (s.stock !== undefined) {
                currentLevel[part].stock += s.stock;
                currentLevel[part].minStock += s.minStock;
            }

            if (index === pathParts.length - 1) {
                // This is a leaf material - dodaj do materials tylko jeśli ma stock
                if (s.stock !== undefined) {
                    currentLevel[part].materials.push({
                        id: m.id,
                        name: part,
                        fullPath: m.fullPath,
                        stock: s.stock,
                        minStock: s.minStock,
                        price: s.price || 0,
                        supplier: s.supplier || 'Unknown',
                        location: s.location || 'Unknown',
                        unit: s.unit || 'sztuka',
                        materialType: m.materialType,
                        category: m.category
                    });
                    currentLevel[part].count = currentLevel[part].materials.length;
                }
            } else {
                currentLevel = currentLevel[part].subcategories;
            }
        });
    });

    // Dodaj licznik materiałów na każdym poziomie
    function addCounts(node) {
        if (node.subcategories) {
            Object.values(node.subcategories).forEach(sub => {
                addCounts(sub);
                node.count += sub.count || 0;
            });
        }
    }

    Object.values(hierarchy).forEach(cat => addCounts(cat));

    res.json(hierarchy);
});

// GET flat materials for backward compatibility
app.get('/api/materials/flat', (_req, res) => {
    if (materialsFlat.length === 0) hydrateMaterialsFromStocksIfEmpty();
    const result = materialsFlat.map(m => {
        const s = stocks[m.id] || { stock: 0, minStock: 0 };
        return { id: m.id, name: m.fullPath, stock: s.stock ?? 0, minStock: s.minStock ?? 0 };
    });
    res.json(result);
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
    const { projectId, tileId } = req.query || {};
    let result = demands;
    if (projectId) result = result.filter(d => d.projectId === projectId);
    if (tileId) result = result.filter(d => d.tileId === tileId);
    res.json(result);
});

app.post('/api/demands', (req, res) => {
    const { materialId, name, requiredQty, projectId, tileId } = req.body || {};
    if (!materialId || typeof requiredQty !== 'number') return res.status(400).json({ error: 'materialId and requiredQty are required' });
    const id = `dem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item = {
        id,
        materialId,
        name: name || (stocks[materialId]?.name || materialId),
        requiredQty,
        createdAt: new Date().toISOString(),
        status: 'New',
        projectId: projectId || null,
        tileId: tileId || null
    };
    demands.push(item);
    saveDemands();
    res.json(item);
});

// Attach demand to a specific tile (element) — used when updating element from Rhino
// POST /api/tiles/:tileId/demands { materialId, requiredQty, projectId?, name? }
app.post('/api/tiles/:tileId/demands', (req, res) => {
    const tileId = req.params.tileId;
    const { materialId, requiredQty, projectId, name } = req.body || {};
    if (!tileId || !materialId || typeof requiredQty !== 'number') return res.status(400).json({ error: 'tileId, materialId and requiredQty are required' });
    const id = `dem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item = {
        id,
        materialId,
        name: name || (stocks[materialId]?.name || materialId),
        requiredQty,
        createdAt: new Date().toISOString(),
        status: 'New',
        projectId: projectId || null,
        tileId
    };
    demands.push(item);
    saveDemands();
    res.json(item);
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

// Concept and Estimate endpoints remain (omitted here for brevity in this file excerpt)

app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
});


