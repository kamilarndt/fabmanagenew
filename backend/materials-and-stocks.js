const { getDb } = require('./db');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function generateMaterialsAndStocks() {
    const d = getDb();
    const now = new Date().toISOString();

    console.log('📦 Generating comprehensive materials catalog and stock levels...');

    // Clear existing materials and stocks
    d.exec(`
        DELETE FROM stock_movements;
        DELETE FROM stocks;
        DELETE FROM materials;
    `);

    // COMPREHENSIVE MATERIALS CATALOG
    const materials = [
        // MDF - różne grubości
        { id: 'mdf-18mm-biały', category: 'MDF', type: 'Płyta', name: 'MDF 18mm biały', thickness_mm: 18, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 45.50, pricing_uom: 'm2', supplier: 'Kronopol', location: 'A1-05', min_quantity: 20, max_quantity: 100 },
        { id: 'mdf-18mm-brązowy', category: 'MDF', type: 'Płyta', name: 'MDF 18mm brązowy', thickness_mm: 18, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 48.00, pricing_uom: 'm2', supplier: 'Kronopol', location: 'A1-06', min_quantity: 15, max_quantity: 80 },
        { id: 'mdf-12mm-biały', category: 'MDF', type: 'Płyta', name: 'MDF 12mm biały', thickness_mm: 12, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 32.00, pricing_uom: 'm2', supplier: 'Egger', location: 'A2-03', min_quantity: 25, max_quantity: 120 },
        { id: 'mdf-25mm-biały', category: 'MDF', type: 'Płyta', name: 'MDF 25mm biały', thickness_mm: 25, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 65.00, pricing_uom: 'm2', supplier: 'Pfleiderer', location: 'A3-01', min_quantity: 10, max_quantity: 60 },

        // Sklejka
        { id: 'sklejka-15mm-brzoza', category: 'Sklejka', type: 'Płyta', name: 'Sklejka 15mm brzoza', thickness_mm: 15, format_raw: '2500x1250mm', base_uom: 'm2', price_per_uom: 85.00, pricing_uom: 'm2', supplier: 'Paged', location: 'B1-02', min_quantity: 12, max_quantity: 50 },
        { id: 'sklejka-18mm-sosna', category: 'Sklejka', type: 'Płyta', name: 'Sklejka 18mm sosna', thickness_mm: 18, format_raw: '2500x1250mm', base_uom: 'm2', price_per_uom: 95.00, pricing_uom: 'm2', supplier: 'Kronopol', location: 'B1-03', min_quantity: 10, max_quantity: 40 },
        { id: 'sklejka-12mm-brzoza', category: 'Sklejka', type: 'Płyta', name: 'Sklejka 12mm brzoza', thickness_mm: 12, format_raw: '2500x1250mm', base_uom: 'm2', price_per_uom: 72.00, pricing_uom: 'm2', supplier: 'Paged', location: 'B2-01', min_quantity: 15, max_quantity: 60 },

        // Plexi/Akryl
        { id: 'plexi-3mm-przezroczysty', category: 'Plexi', type: 'Płyta', name: 'Plexi 3mm przezroczysty', thickness_mm: 3, format_raw: '2000x1000mm', base_uom: 'm2', price_per_uom: 45.00, pricing_uom: 'm2', supplier: 'PlastPro', location: 'C1-01', min_quantity: 30, max_quantity: 100 },
        { id: 'plexi-5mm-biały', category: 'Plexi', type: 'Płyta', name: 'Plexi 5mm biały', thickness_mm: 5, format_raw: '2000x1000mm', base_uom: 'm2', price_per_uom: 65.00, pricing_uom: 'm2', supplier: 'PlexiTech', location: 'C1-02', min_quantity: 20, max_quantity: 80 },
        { id: 'plexi-8mm-czarny', category: 'Plexi', type: 'Płyta', name: 'Plexi 8mm czarny', thickness_mm: 8, format_raw: '2000x1000mm', base_uom: 'm2', price_per_uom: 95.00, pricing_uom: 'm2', supplier: 'AcrylicPro', location: 'C1-03', min_quantity: 15, max_quantity: 60 },
        { id: 'plexi-10mm-opalowy', category: 'Plexi', type: 'Płyta', name: 'Plexi 10mm opalowy', thickness_mm: 10, format_raw: '2000x1000mm', base_uom: 'm2', price_per_uom: 120.00, pricing_uom: 'm2', supplier: 'PlastPro', location: 'C2-01', min_quantity: 10, max_quantity: 40 },

        // Aluminium
        { id: 'aluminium-2mm-srebrny', category: 'Aluminium', type: 'Blacha', name: 'Aluminium 2mm srebrny', thickness_mm: 2, format_raw: '1000x2000mm', base_uom: 'm2', price_per_uom: 85.00, pricing_uom: 'm2', supplier: 'AluMetal', location: 'D1-01', min_quantity: 20, max_quantity: 80 },
        { id: 'aluminium-3mm-czarny', category: 'Aluminium', type: 'Blacha', name: 'Aluminium 3mm czarny', thickness_mm: 3, format_raw: '1000x2000mm', base_uom: 'm2', price_per_uom: 110.00, pricing_uom: 'm2', supplier: 'Alumet', location: 'D1-02', min_quantity: 15, max_quantity: 60 },
        { id: 'aluminium-profil-20x20', category: 'Aluminium', type: 'Profil', name: 'Profil aluminiowy 20x20mm', thickness_mm: 2, format_raw: '6000mm', base_uom: 'mb', price_per_uom: 25.00, pricing_uom: 'mb', supplier: 'AluTech', location: 'D2-01', min_quantity: 50, max_quantity: 200 },

        // Płyty gipsowo-kartonowe
        { id: 'gk-12mm-standard', category: 'GK', type: 'Płyta', name: 'Płyta GK 12mm standard', thickness_mm: 12, format_raw: '2500x1200mm', base_uom: 'm2', price_per_uom: 18.50, pricing_uom: 'm2', supplier: 'Gyproc', location: 'E1-01', min_quantity: 40, max_quantity: 150 },
        { id: 'gk-15mm-ognioodporna', category: 'GK', type: 'Płyta', name: 'Płyta GK 15mm ognioodporna', thickness_mm: 15, format_raw: '2500x1200mm', base_uom: 'm2', price_per_uom: 28.00, pricing_uom: 'm2', supplier: 'Rigips', location: 'E1-02', min_quantity: 25, max_quantity: 100 },

        // HDF
        { id: 'hdf-6mm-biały', category: 'HDF', type: 'Płyta', name: 'HDF 6mm biały', thickness_mm: 6, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 22.00, pricing_uom: 'm2', supplier: 'Kronopol', location: 'F1-01', min_quantity: 30, max_quantity: 120 },
        { id: 'hdf-8mm-brązowy', category: 'HDF', type: 'Płyta', name: 'HDF 8mm brązowy', thickness_mm: 8, format_raw: '2800x2070mm', base_uom: 'm2', price_per_uom: 28.00, pricing_uom: 'm2', supplier: 'Egger', location: 'F1-02', min_quantity: 25, max_quantity: 100 },

        // Elementy złączne
        { id: 'wkręty-4x50', category: 'Złącza', type: 'Wkręty', name: 'Wkręty do drewna 4x50mm', thickness_mm: null, format_raw: '100szt', base_uom: 'szt', price_per_uom: 0.25, pricing_uom: 'szt', supplier: 'Standard', location: 'G1-01', min_quantity: 1000, max_quantity: 5000 },
        { id: 'wkręty-5x80', category: 'Złącza', type: 'Wkręty', name: 'Wkręty do drewna 5x80mm', thickness_mm: null, format_raw: '100szt', base_uom: 'szt', price_per_uom: 0.35, pricing_uom: 'szt', supplier: 'Standard', location: 'G1-02', min_quantity: 500, max_quantity: 3000 },
        { id: 'kołki-rozporowe-8mm', category: 'Złącza', type: 'Kołki', name: 'Kołki rozporowe 8mm', thickness_mm: null, format_raw: '50szt', base_uom: 'szt', price_per_uom: 0.45, pricing_uom: 'szt', supplier: 'Standard', location: 'G1-03', min_quantity: 500, max_quantity: 2000 },

        // Kleje i uszczelki
        { id: 'klej-pvac-1kg', category: 'Kleje', type: 'Klej', name: 'Klej PVA-C 1kg', thickness_mm: null, format_raw: '1kg', base_uom: 'kg', price_per_uom: 12.00, pricing_uom: 'kg', supplier: 'Standard', location: 'H1-01', min_quantity: 20, max_quantity: 100 },
        { id: 'uszczelka-silikonowa', category: 'Uszczelki', type: 'Silikon', name: 'Uszczelka silikonowa 6mm', thickness_mm: 6, format_raw: '10mb', base_uom: 'mb', price_per_uom: 3.50, pricing_uom: 'mb', supplier: 'Standard', location: 'H1-02', min_quantity: 100, max_quantity: 500 }
    ];

    // Insert materials
    const insMaterial = d.prepare('INSERT INTO materials (id, category, type, name, thickness_mm, format_raw, base_uom, price_per_uom, pricing_uom, supplier, location, min_quantity, max_quantity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const material of materials) {
        insMaterial.run(material.id, material.category, material.type, material.name, material.thickness_mm, material.format_raw, material.base_uom, material.price_per_uom, material.pricing_uom, material.supplier, material.location, material.min_quantity, material.max_quantity, now);
    }

    // REALISTIC STOCK LEVELS
    const stockLevels = [
        // MDF - różne poziomy zapasów
        { material_id: 'mdf-18mm-biały', quantity: 45.5, reserved: 12.0, min_quantity: 20, max_quantity: 100, location: 'A1-05' },
        { material_id: 'mdf-18mm-brązowy', quantity: 8.2, reserved: 5.0, min_quantity: 15, max_quantity: 80, location: 'A1-06' }, // Niski stan
        { material_id: 'mdf-12mm-biały', quantity: 78.3, reserved: 15.5, min_quantity: 25, max_quantity: 120, location: 'A2-03' },
        { material_id: 'mdf-25mm-biały', quantity: 3.1, reserved: 2.0, min_quantity: 10, max_quantity: 60, location: 'A3-01' }, // Krytyczny stan

        // Sklejka
        { material_id: 'sklejka-15mm-brzoza', quantity: 22.8, reserved: 8.0, min_quantity: 12, max_quantity: 50, location: 'B1-02' },
        { material_id: 'sklejka-18mm-sosna', quantity: 5.5, reserved: 3.0, min_quantity: 10, max_quantity: 40, location: 'B1-03' }, // Niski stan
        { material_id: 'sklejka-12mm-brzoza', quantity: 35.2, reserved: 10.0, min_quantity: 15, max_quantity: 60, location: 'B2-01' },

        // Plexi
        { material_id: 'plexi-3mm-przezroczysty', quantity: 65.8, reserved: 20.0, min_quantity: 30, max_quantity: 100, location: 'C1-01' },
        { material_id: 'plexi-5mm-biały', quantity: 42.3, reserved: 12.0, min_quantity: 20, max_quantity: 80, location: 'C1-02' },
        { material_id: 'plexi-8mm-czarny', quantity: 18.7, reserved: 8.0, min_quantity: 15, max_quantity: 60, location: 'C1-03' },
        { material_id: 'plexi-10mm-opalowy', quantity: 2.1, reserved: 1.5, min_quantity: 10, max_quantity: 40, location: 'C2-01' }, // Krytyczny stan

        // Aluminium
        { material_id: 'aluminium-2mm-srebrny', quantity: 38.5, reserved: 15.0, min_quantity: 20, max_quantity: 80, location: 'D1-01' },
        { material_id: 'aluminium-3mm-czarny', quantity: 25.8, reserved: 10.0, min_quantity: 15, max_quantity: 60, location: 'D1-02' },
        { material_id: 'aluminium-profil-20x20', quantity: 125.0, reserved: 30.0, min_quantity: 50, max_quantity: 200, location: 'D2-01' },

        // GK
        { material_id: 'gk-12mm-standard', quantity: 85.2, reserved: 25.0, min_quantity: 40, max_quantity: 150, location: 'E1-01' },
        { material_id: 'gk-15mm-ognioodporna', quantity: 52.8, reserved: 15.0, min_quantity: 25, max_quantity: 100, location: 'E1-02' },

        // HDF
        { material_id: 'hdf-6mm-biały', quantity: 95.5, reserved: 20.0, min_quantity: 30, max_quantity: 120, location: 'F1-01' },
        { material_id: 'hdf-8mm-brązowy', quantity: 68.3, reserved: 18.0, min_quantity: 25, max_quantity: 100, location: 'F1-02' },

        // Złącza
        { material_id: 'wkręty-4x50', quantity: 2500, reserved: 500, min_quantity: 1000, max_quantity: 5000, location: 'G1-01' },
        { material_id: 'wkręty-5x80', quantity: 1200, reserved: 300, min_quantity: 500, max_quantity: 3000, location: 'G1-02' },
        { material_id: 'kołki-rozporowe-8mm', quantity: 800, reserved: 200, min_quantity: 500, max_quantity: 2000, location: 'G1-03' },

        // Kleje i uszczelki
        { material_id: 'klej-pvac-1kg', quantity: 45.5, reserved: 10.0, min_quantity: 20, max_quantity: 100, location: 'H1-01' },
        { material_id: 'uszczelka-silikonowa', quantity: 280.0, reserved: 50.0, min_quantity: 100, max_quantity: 500, location: 'H1-02' }
    ];

    // Insert stock levels
    const insStock = d.prepare('INSERT INTO stocks (material_id, quantity, reserved, min_quantity, max_quantity, location) VALUES (?, ?, ?, ?, ?, ?)');
    for (const stock of stockLevels) {
        insStock.run(stock.material_id, stock.quantity, stock.reserved, stock.min_quantity, stock.max_quantity, stock.location);
    }

    console.log(`✅ Created ${materials.length} materials with realistic stock levels`);

    return { materials, stockLevels };
}

module.exports = { generateMaterialsAndStocks };

