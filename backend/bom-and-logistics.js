const { getDb } = require('./db');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function generateBOMAndLogistics() {
    const d = getDb();
    const now = new Date().toISOString();

    console.log('🔧 Generating BOM (Bill of Materials) and logistics data...');

    // Get all tiles and materials for BOM generation
    const tiles = d.prepare('SELECT * FROM tiles').all();
    const materials = d.prepare('SELECT * FROM materials').all();

    // 1. GENERATE REALISTIC BOM FOR TILES
    const insTileMaterial = d.prepare('INSERT INTO tile_materials (tile_id, material_id, quantity, waste_percent) VALUES (?, ?, ?, ?)');

    // Material mapping by project type and tile characteristics
    const materialMapping = {
        'Teatr': {
            'MDF': ['mdf-18mm-biały', 'mdf-12mm-biały'],
            'Sklejka': ['sklejka-15mm-brzoza', 'sklejka-18mm-sosna'],
            'Plexi': ['plexi-3mm-przezroczysty', 'plexi-5mm-biały'],
            'Złącza': ['wkręty-4x50', 'wkręty-5x80']
        },
        'Muzeum': {
            'MDF': ['mdf-18mm-biały', 'mdf-12mm-biały'],
            'Plexi': ['plexi-3mm-przezroczysty', 'plexi-5mm-biały', 'plexi-8mm-czarny'],
            'Aluminium': ['aluminium-2mm-srebrny', 'aluminium-profil-20x20'],
            'Złącza': ['wkręty-4x50', 'kołki-rozporowe-8mm']
        },
        'Event': {
            'MDF': ['mdf-25mm-biały', 'mdf-18mm-biały'],
            'Sklejka': ['sklejka-18mm-sosna'],
            'Aluminium': ['aluminium-3mm-czarny', 'aluminium-profil-20x20'],
            'Złącza': ['wkręty-5x80', 'kołki-rozporowe-8mm']
        },
        'TV': {
            'MDF': ['mdf-18mm-biały', 'mdf-12mm-biały'],
            'Plexi': ['plexi-5mm-biały', 'plexi-8mm-czarny'],
            'Złącza': ['wkręty-4x50', 'wkręty-5x80']
        },
        'Retail': {
            'MDF': ['mdf-18mm-biały', 'mdf-12mm-biały'],
            'HDF': ['hdf-6mm-biały', 'hdf-8mm-brązowy'],
            'Plexi': ['plexi-3mm-przezroczysty', 'plexi-5mm-biały'],
            'Złącza': ['wkręty-4x50', 'wkręty-5x80']
        }
    };

    for (const tile of tiles) {
        // Get project info
        const project = d.prepare('SELECT project_type FROM projects WHERE id = ?').get(tile.project_id);
        const projectType = project?.project_type || 'Teatr';

        // Calculate area for material calculation
        const area = (tile.width_mm / 1000) * (tile.height_mm / 1000) * tile.quantity;

        // Select materials based on project type and tile characteristics
        const availableMaterials = materialMapping[projectType] || materialMapping['Teatr'];
        const selectedMaterials = [];

        // Always include base material (MDF or Sklejka)
        if (availableMaterials['MDF']) {
            const mdfMaterial = availableMaterials['MDF'][Math.floor(Math.random() * availableMaterials['MDF'].length)];
            selectedMaterials.push({ id: mdfMaterial, category: 'MDF', quantity: area * 1.1, waste: 10 });
        }

        // Add secondary materials based on tile type
        if (tile.name.toLowerCase().includes('panel') || tile.name.toLowerCase().includes('tło')) {
            if (availableMaterials['Plexi']) {
                const plexiMaterial = availableMaterials['Plexi'][Math.floor(Math.random() * availableMaterials['Plexi'].length)];
                selectedMaterials.push({ id: plexiMaterial, category: 'Plexi', quantity: area * 0.3, waste: 5 });
            }
        }

        if (tile.name.toLowerCase().includes('konstrukcja') || tile.name.toLowerCase().includes('wieża')) {
            if (availableMaterials['Aluminium']) {
                const alumMaterial = availableMaterials['Aluminium'][Math.floor(Math.random() * availableMaterials['Aluminium'].length)];
                selectedMaterials.push({ id: alumMaterial, category: 'Aluminium', quantity: area * 0.2, waste: 8 });
            }
        }

        // Always add fasteners
        if (availableMaterials['Złącza']) {
            const fastenerMaterial = availableMaterials['Złącza'][Math.floor(Math.random() * availableMaterials['Złącza'].length)];
            const fastenerQty = Math.ceil(area * 2); // 2 fasteners per m2
            selectedMaterials.push({ id: fastenerMaterial, category: 'Złącza', quantity: fastenerQty, waste: 0 });
        }

        // Insert BOM entries
        for (const material of selectedMaterials) {
            insTileMaterial.run(tile.id, material.id, material.quantity, material.waste);
        }
    }

    console.log(`✅ Created BOM entries for ${tiles.length} tiles`);

    // 2. GENERATE LOGISTICS DATA
    const logisticsData = [
        {
            project_id: 'proj-wesele-scenografia',
            transport_type: 'truck',
            departure_location: 'Warszawa, ul. Fabryczna 15',
            arrival_location: 'Warszawa, Teatr Narodowy, ul. Krakowskie Przedmieście 3',
            scheduled_date: '2025-03-10',
            estimated_cost: 850.00,
            status: 'booked',
            driver_name: 'Jan Kowalski',
            vehicle_info: 'Mercedes Sprinter 516 CDI',
            notes: 'Transport elementów scenograficznych - wymagane zabezpieczenie przed wilgocią'
        },
        {
            project_id: 'proj-orange-festival-scena',
            transport_type: 'truck',
            departure_location: 'Warszawa, ul. Fabryczna 15',
            arrival_location: 'Warszawa, Lotnisko Bemowo, ul. Księcia Bolesława 2',
            scheduled_date: '2025-06-05',
            estimated_cost: 1200.00,
            status: 'planned',
            driver_name: 'Piotr Wiśniewski',
            vehicle_info: 'Volvo FH16 750',
            notes: 'Transport ciężkich elementów scenicznych - wymagany dźwig na miejscu'
        },
        {
            project_id: 'proj-kopernik-kosmos',
            transport_type: 'van',
            departure_location: 'Warszawa, ul. Fabryczna 15',
            arrival_location: 'Warszawa, Centrum Nauki Kopernik, ul. Wybrzeże Kościuszkowskie 20',
            scheduled_date: '2025-07-10',
            estimated_cost: 450.00,
            status: 'planned',
            driver_name: 'Anna Nowak',
            vehicle_info: 'Ford Transit Custom',
            notes: 'Transport delikatnych elementów interaktywnych - ostrożna jazda'
        },
        {
            project_id: 'proj-ikea-showroom',
            transport_type: 'truck',
            departure_location: 'Warszawa, ul. Fabryczna 15',
            arrival_location: 'Kraków, IKEA, ul. Opolska 100',
            scheduled_date: '2025-05-05',
            estimated_cost: 950.00,
            status: 'in_transit',
            driver_name: 'Katarzyna Wójcik',
            vehicle_info: 'MAN TGL 12.220',
            notes: 'Transport do Krakowa - elementy kuchenne'
        }
    ];

    const insLogistics = d.prepare('INSERT INTO logistics (id, project_id, transport_type, departure_location, arrival_location, scheduled_date, estimated_cost, status, driver_name, vehicle_info, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    for (const logistics of logisticsData) {
        const logisticsId = uuid();
        insLogistics.run(logisticsId, logistics.project_id, logistics.transport_type, logistics.departure_location, logistics.arrival_location, logistics.scheduled_date, logistics.estimated_cost, logistics.status, logistics.driver_name, logistics.vehicle_info, logistics.notes, now);
    }

    console.log(`✅ Created ${logisticsData.length} logistics entries`);

    // 3. GENERATE ACCOMMODATION DATA
    const accommodationData = [
        {
            project_id: 'proj-orange-festival-scena',
            team_size: 8,
            location: 'Warszawa',
            check_in_date: '2025-06-08',
            check_out_date: '2025-06-12',
            hotel_name: 'Hotel Marriott',
            cost_per_night: 280.00,
            total_cost: 8960.00,
            status: 'booked',
            contact_person: 'Anna Recepcja',
            notes: 'Zakwaterowanie zespołu montażowego - 4 noce'
        },
        {
            project_id: 'proj-ikea-showroom',
            team_size: 4,
            location: 'Kraków',
            check_in_date: '2025-05-03',
            check_out_date: '2025-05-07',
            hotel_name: 'Hotel Hilton',
            cost_per_night: 320.00,
            total_cost: 5120.00,
            status: 'confirmed',
            contact_person: 'Piotr Manager',
            notes: 'Zakwaterowanie zespołu montażowego w Krakowie'
        }
    ];

    const insAccommodation = d.prepare('INSERT INTO accommodation (id, project_id, team_size, location, check_in_date, check_out_date, hotel_name, cost_per_night, total_cost, status, contact_person, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    for (const accommodation of accommodationData) {
        const accommodationId = uuid();
        insAccommodation.run(accommodationId, accommodation.project_id, accommodation.team_size, accommodation.location, accommodation.check_in_date, accommodation.check_out_date, accommodation.hotel_name, accommodation.cost_per_night, accommodation.total_cost, accommodation.status, accommodation.contact_person, accommodation.notes, now);
    }

    console.log(`✅ Created ${accommodationData.length} accommodation entries`);

    // 4. GENERATE STOCK MOVEMENTS (DEMANDS)
    const stockMovements = [
        // Critical stock items that need replenishment
        { material_id: 'mdf-25mm-biały', change_qty: 50, reason: 'Zamówienie uzupełniające', note: 'Krytyczny stan magazynowy - pilne uzupełnienie' },
        { material_id: 'plexi-10mm-opalowy', change_qty: 30, reason: 'Zamówienie uzupełniające', note: 'Niski stan - potrzebne na projekty' },
        { material_id: 'sklejka-18mm-sosna', change_qty: 25, reason: 'Zamówienie uzupełniające', note: 'Uzupełnienie po zużyciu na projekty' },

        // Project-related movements
        { material_id: 'mdf-18mm-biały', change_qty: -12.5, reason: 'Zużycie produkcyjne', project_id: 'proj-wesele-scenografia', note: 'Zużycie na panele sceniczne' },
        { material_id: 'plexi-5mm-biały', change_qty: -8.2, reason: 'Zużycie produkcyjne', project_id: 'proj-lazienki-wystawa', note: 'Zużycie na witryny ekspozycyjne' },
        { material_id: 'aluminium-profil-20x20', change_qty: -45.0, reason: 'Zużycie produkcyjne', project_id: 'proj-orange-festival-scena', note: 'Zużycie na wieże oświetleniowe' }
    ];

    const insStockMovement = d.prepare('INSERT INTO stock_movements (material_id, change_qty, reason, tile_id, project_id, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');

    for (const movement of stockMovements) {
        insStockMovement.run(movement.material_id, movement.change_qty, movement.reason, movement.tile_id || null, movement.project_id || null, movement.note, now);
    }

    console.log(`✅ Created ${stockMovements.length} stock movements`);

    return { logisticsData, accommodationData, stockMovements };
}

module.exports = { generateBOMAndLogistics };

