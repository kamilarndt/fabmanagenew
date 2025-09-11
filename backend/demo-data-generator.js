const { getDb } = require('./db');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function generateDemoData() {
    const d = getDb();
    const now = new Date().toISOString();

    console.log('🎬 Generating comprehensive demo data...');

    // Clear existing data
    d.exec(`
        DELETE FROM accommodation;
        DELETE FROM logistics;
        DELETE FROM tile_materials;
        DELETE FROM tile_object_materials;
        DELETE FROM tiles;
        DELETE FROM projects;
        DELETE FROM clients;
        DELETE FROM demands;
        DELETE FROM stock_movements;
    `);

    // 1. REALISTIC CLIENTS
    const clients = [
        {
            id: 'client-teatr-narodowy',
            name: 'Teatr Narodowy',
            email: 'produkcja@teatrnarodowy.pl',
            phone: '+48 22 692 0600',
            tax_id: 'PL5260003010',
            created_at: now
        },
        {
            id: 'client-muzeum-lazienki',
            name: 'Muzeum Łazienki Królewskie',
            email: 'wystawy@lazienki-krolewskie.pl',
            phone: '+48 22 506 0024',
            tax_id: 'PL7010001454',
            created_at: now
        },
        {
            id: 'client-orange-festival',
            name: 'Orange Warsaw Festival',
            email: 'produkcja@orange-festival.pl',
            phone: '+48 22 336 4455',
            tax_id: 'PL1132220303',
            created_at: now
        },
        {
            id: 'client-hotel-bristol',
            name: 'Hotel Bristol',
            email: 'events@bristol.pl',
            phone: '+48 22 551 1000',
            tax_id: 'PL1260001234',
            created_at: now
        },
        {
            id: 'client-kopernik',
            name: 'Centrum Nauki Kopernik',
            email: 'wystawy@kopernik.org.pl',
            phone: '+48 22 596 4100',
            tax_id: 'PL1133445566',
            created_at: now
        },
        {
            id: 'client-tvp',
            name: 'TVP - Telewizja Polska',
            email: 'scenografia@tvp.pl',
            phone: '+48 22 547 7000',
            tax_id: 'PL5260250274',
            created_at: now
        },
        {
            id: 'client-galeria-mokotow',
            name: 'Galeria Mokotów',
            email: 'marketing@galeriamokotow.pl',
            phone: '+48 22 542 2100',
            tax_id: 'PL9512345678',
            created_at: now
        },
        {
            id: 'client-ikea',
            name: 'IKEA Polska',
            email: 'wystawy@ikea.pl',
            phone: '+48 801 400 400',
            tax_id: 'PL6422682896',
            created_at: now
        }
    ];

    // Insert clients
    const insClient = d.prepare('INSERT INTO clients (id, name, email, phone, tax_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    for (const client of clients) {
        insClient.run(client.id, client.name, client.email, client.phone, client.tax_id, client.created_at);
    }

    // 2. REALISTIC PROJECTS
    const projects = [
        {
            id: 'proj-wesele-scenografia',
            client_id: 'client-teatr-narodowy',
            name: 'Scenografia „Wesele" - Teatr Narodowy',
            status: 'active',
            deadline: '2025-03-15',
            location: 'Warszawa, Teatr Narodowy, ul. Krakowskie Przedmieście 3',
            project_type: 'Teatr',
            priority: 'Wysoki',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja', 'logistyka']),
            description: 'Kompleksowa scenografia do spektaklu „Wesele" Stanisława Wyspiańskiego. Projekt obejmuje elementy dekoracyjne, oświetlenie i multimedia.',
            created_at: now
        },
        {
            id: 'proj-lazienki-wystawa',
            client_id: 'client-muzeum-lazienki',
            name: 'Wystawa „Łazienki przez wieki"',
            status: 'active',
            deadline: '2025-04-20',
            location: 'Warszawa, Łazienki Królewskie, ul. Agrykoli 1',
            project_type: 'Muzeum',
            priority: 'Średni',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja']),
            description: 'Wystawa czasowa prezentująca historię Łazienek Królewskich. Elementy ekspozycyjne, podświetlane panele informacyjne.',
            created_at: now
        },
        {
            id: 'proj-orange-festival-scena',
            client_id: 'client-orange-festival',
            name: 'Scena główna Orange Festival 2025',
            status: 'active',
            deadline: '2025-06-10',
            location: 'Warszawa, Lotnisko Bemowo, ul. Księcia Bolesława 2',
            project_type: 'Event',
            priority: 'Wysoki',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja', 'logistyka', 'zakwaterowanie']),
            description: 'Główna scena festiwalu muzycznego z systemem oświetlenia, nagłośnienia i elementami dekoracyjnymi.',
            created_at: now
        },
        {
            id: 'proj-bristol-odnowienie',
            client_id: 'client-hotel-bristol',
            name: 'Odnowienie Sali Balowej - Hotel Bristol',
            status: 'on_hold',
            deadline: '2025-05-30',
            location: 'Warszawa, Hotel Bristol, ul. Krakowskie Przedmieście 42/44',
            project_type: 'Wnętrza',
            priority: 'Średni',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja']),
            description: 'Renowacja historycznej Sali Balowej z zachowaniem oryginalnego charakteru. Elementy dekoracyjne i oświetlenie.',
            created_at: now
        },
        {
            id: 'proj-kopernik-kosmos',
            client_id: 'client-kopernik',
            name: 'Wystawa „Kosmiczne odkrycia"',
            status: 'active',
            deadline: '2025-07-15',
            location: 'Warszawa, Centrum Nauki Kopernik, ul. Wybrzeże Kościuszkowskie 20',
            project_type: 'Muzeum',
            priority: 'Średni',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja', 'logistyka']),
            description: 'Interaktywna wystawa o kosmosie z modelami planet, symulatorami i elementami multimedialnymi.',
            created_at: now
        },
        {
            id: 'proj-tvp-panorama',
            client_id: 'client-tvp',
            name: 'Studio TVP „Panorama"',
            status: 'active',
            deadline: '2025-04-05',
            location: 'Warszawa, TVP, ul. Woronicza 17',
            project_type: 'TV',
            priority: 'Wysoki',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja']),
            description: 'Modernizacja studia telewizyjnego z nowoczesnym systemem oświetlenia i elementami dekoracyjnymi.',
            created_at: now
        },
        {
            id: 'proj-galeria-event',
            client_id: 'client-galeria-mokotow',
            name: 'Przestrzeń eventowa Galeria Mokotów',
            status: 'new',
            deadline: '2025-08-20',
            location: 'Warszawa, Galeria Mokotów, ul. Wołoska 12',
            project_type: 'Retail',
            priority: 'Niski',
            modules: JSON.stringify(['koncepcja', 'wycena']),
            description: 'Strefa eventowa w centrum handlowym z mobilnymi elementami dekoracyjnymi i systemem oświetlenia.',
            created_at: now
        },
        {
            id: 'proj-ikea-showroom',
            client_id: 'client-ikea',
            name: 'Showroom IKEA - strefa kuchenna',
            status: 'active',
            deadline: '2025-05-10',
            location: 'Kraków, IKEA, ul. Opolska 100',
            project_type: 'Retail',
            priority: 'Średni',
            modules: JSON.stringify(['koncepcja', 'wycena', 'produkcja', 'logistyka']),
            description: 'Nowoczesny showroom kuchni z interaktywnymi elementami i systemem prezentacji produktów.',
            created_at: now
        }
    ];

    // Insert projects
    const insProject = d.prepare('INSERT INTO projects (id, client_id, name, status, deadline, archived_at, created_at, location, project_type, priority, modules, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const project of projects) {
        insProject.run(project.id, project.client_id, project.name, project.status, project.deadline, null, project.created_at, project.location, project.project_type, project.priority, project.modules, project.description);
    }

    console.log(`✅ Created ${clients.length} clients and ${projects.length} projects`);

    // 3. REALISTIC TILES/ELEMENTS
    const tileTemplates = [
        // Teatr Narodowy - Wesele
        { project_id: 'proj-wesele-scenografia', code: 'TN-W-001', name: 'Główny panel sceniczny', quantity: 1, stage: 'cnc', width_mm: 3000, height_mm: 2400, thickness_mm: 18, description: 'Centralny element scenografii z malowidłem' },
        { project_id: 'proj-wesele-scenografia', code: 'TN-W-002', name: 'Boczne panele dekoracyjne', quantity: 2, stage: 'design', width_mm: 1200, height_mm: 2400, thickness_mm: 12, description: 'Panele boczne z elementami ludowymi' },
        { project_id: 'proj-wesele-scenografia', code: 'TN-W-003', name: 'Podest aktorski', quantity: 1, stage: 'assembly', width_mm: 2000, height_mm: 1500, thickness_mm: 40, description: 'Podwyższony podest z bezpiecznymi krawędziami' },
        { project_id: 'proj-wesele-scenografia', code: 'TN-W-004', name: 'Elementy oświetleniowe', quantity: 4, stage: 'finishing', width_mm: 600, height_mm: 400, thickness_mm: 25, description: 'Obudowy na reflektory sceniczne' },

        // Muzeum Łazienki
        { project_id: 'proj-lazienki-wystawa', code: 'ML-W-001', name: 'Panel informacyjny główny', quantity: 1, stage: 'done', width_mm: 1800, height_mm: 1200, thickness_mm: 15, description: 'Panel z historią Łazienek i mapą' },
        { project_id: 'proj-lazienki-wystawa', code: 'ML-W-002', name: 'Witryny ekspozycyjne', quantity: 6, stage: 'cnc', width_mm: 800, height_mm: 600, thickness_mm: 20, description: 'Szklane witryny na eksponaty' },
        { project_id: 'proj-lazienki-wystawa', code: 'ML-W-003', name: 'Podświetlane ramki', quantity: 12, stage: 'design', width_mm: 400, height_mm: 300, thickness_mm: 10, description: 'Ramki z LED do zdjęć historycznych' },

        // Orange Festival
        { project_id: 'proj-orange-festival-scena', code: 'OF-S-001', name: 'Scena główna', quantity: 1, stage: 'cnc', width_mm: 12000, height_mm: 8000, thickness_mm: 50, description: 'Główna platforma sceniczna' },
        { project_id: 'proj-orange-festival-scena', code: 'OF-S-002', name: 'Wieże oświetleniowe', quantity: 4, stage: 'assembly', width_mm: 2000, height_mm: 6000, thickness_mm: 30, description: 'Konstrukcje nośne dla reflektorów' },
        { project_id: 'proj-orange-festival-scena', code: 'OF-S-003', name: 'Elementy dekoracyjne', quantity: 8, stage: 'finishing', width_mm: 1500, height_mm: 1000, thickness_mm: 15, description: 'Panele z logo festiwalu' },

        // Hotel Bristol
        { project_id: 'proj-bristol-odnowienie', code: 'HB-R-001', name: 'Panele ścienne', quantity: 12, stage: 'on_hold', width_mm: 1000, height_mm: 2400, thickness_mm: 18, description: 'Dekoracyjne panele ścienne' },
        { project_id: 'proj-bristol-odnowienie', code: 'HB-R-002', name: 'Listwy dekoracyjne', quantity: 24, stage: 'on_hold', width_mm: 2000, height_mm: 100, thickness_mm: 20, description: 'Listwy z ornamentami' },

        // Kopernik
        { project_id: 'proj-kopernik-kosmos', code: 'CN-K-001', name: 'Model układu słonecznego', quantity: 1, stage: 'design', width_mm: 3000, height_mm: 3000, thickness_mm: 25, description: 'Interaktywny model planet' },
        { project_id: 'proj-kopernik-kosmos', code: 'CN-K-002', name: 'Panele informacyjne', quantity: 8, stage: 'cnc', width_mm: 1200, height_mm: 800, thickness_mm: 12, description: 'Panele z informacjami o planetach' },
        { project_id: 'proj-kopernik-kosmos', code: 'CN-K-003', name: 'Symulator kokpitu', quantity: 1, stage: 'assembly', width_mm: 2000, height_mm: 1500, thickness_mm: 40, description: 'Symulator statku kosmicznego' },

        // TVP Panorama
        { project_id: 'proj-tvp-panorama', code: 'TV-P-001', name: 'Tło studia', quantity: 1, stage: 'done', width_mm: 4000, height_mm: 3000, thickness_mm: 15, description: 'Główne tło studia telewizyjnego' },
        { project_id: 'proj-tvp-panorama', code: 'TV-P-002', name: 'Elementy dekoracyjne', quantity: 6, stage: 'cnc', width_mm: 800, height_mm: 600, thickness_mm: 20, description: 'Elementy z logo TVP' },

        // Galeria Mokotów
        { project_id: 'proj-galeria-event', code: 'GM-E-001', name: 'Mobilne ścianki', quantity: 4, stage: 'design', width_mm: 2000, height_mm: 2400, thickness_mm: 18, description: 'Ścianki do podziału przestrzeni' },
        { project_id: 'proj-galeria-event', code: 'GM-E-002', name: 'Stoły ekspozycyjne', quantity: 8, stage: 'design', width_mm: 1200, height_mm: 600, thickness_mm: 30, description: 'Stoły do prezentacji produktów' },

        // IKEA Showroom
        { project_id: 'proj-ikea-showroom', code: 'IK-S-001', name: 'Kuchnia demonstracyjna', quantity: 1, stage: 'active', width_mm: 3000, height_mm: 2500, thickness_mm: 35, description: 'Kompletna kuchnia do prezentacji' },
        { project_id: 'proj-ikea-showroom', code: 'IK-S-002', name: 'Panele informacyjne', quantity: 6, stage: 'cnc', width_mm: 1000, height_mm: 800, thickness_mm: 15, description: 'Panele z cenami i specyfikacjami' },
        { project_id: 'proj-ikea-showroom', code: 'IK-S-003', name: 'Strefa interaktywna', quantity: 1, stage: 'design', width_mm: 2000, height_mm: 1500, thickness_mm: 25, description: 'Stół z tabletami do konfiguracji' }
    ];

    // Insert tiles
    const insTile = d.prepare('INSERT INTO tiles (id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const tiles = [];

    for (const template of tileTemplates) {
        const tileId = uuid();
        insTile.run(tileId, template.project_id, template.code, template.name, template.quantity, template.stage, template.width_mm, template.height_mm, template.thickness_mm, template.description, now);
        tiles.push({ id: tileId, ...template });
    }

    console.log(`✅ Created ${tiles.length} tiles/elements`);

    return { clients, projects, tiles };
}

module.exports = { generateDemoData };
