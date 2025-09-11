import type { Tile } from '../../stores/tilesStore'

// Realne kafelki odpowiadające projektom
export const realTiles: Tile[] = [
    // === RESTAURACJA "INDUSTRIAL LOFT" === //
    {
        id: 'tile-bar-counter-main',
        name: 'Lady Barowe Główne',
        status: 'W trakcie projektowania',
        project: 'proj-2024-restaurant-loft',
        moduł_nadrzędny: 'bar-area',
        group: 'group-bar-area',
        opis: 'Industrialne lady barowe z blatem dębowym i metalową konstrukcją',
        link_model_3d: 'https://files.fabryka.pl/models/bar-counter-v2.obj',
        załączniki: ['bar-technical-drawing.pdf', 'wood-samples.jpg'],
        przypisany_projektant: 'Anna Kowalska',
        termin: '2024-12-20',
        laborCost: 2400,
        bom: [
            {
                id: 'bom-oak-board-60mm',
                type: 'Materiał surowy',
                name: 'Deska dębowa 60mm x 400mm x 3000mm',
                quantity: 4,
                unit: 'szt',
                unitCost: 450,
                status: 'Na stanie',
                materialId: 'mat-oak-thick-board'
            },
            {
                id: 'bom-steel-profile-40x40',
                type: 'Materiał surowy',
                name: 'Profil stalowy 40x40x2mm',
                quantity: 12,
                unit: 'mb',
                unitCost: 25,
                status: 'Do zamówienia',
                materialId: 'mat-steel-profile-square'
            },
            {
                id: 'bom-wood-stain-dark',
                type: 'Materiał surowy',
                name: 'Bejca do drewna - orzech ciemny',
                quantity: 2,
                unit: 'l',
                unitCost: 85,
                status: 'Na stanie',
                materialId: 'mat-wood-stain-walnut'
            }
        ]
    },
    {
        id: 'tile-bar-shelves',
        name: 'Regały na Alkohole',
        status: 'Zaakceptowane',
        project: 'proj-2024-restaurant-loft',
        moduł_nadrzędny: 'bar-area',
        group: 'group-bar-area',
        opis: 'Metalowe regały z oświetleniem LED pod butelki',
        przypisany_projektant: 'Anna Kowalska',
        termin: '2024-12-25',
        laborCost: 1200,
        bom: [
            {
                id: 'bom-steel-sheet-2mm',
                type: 'Materiał surowy',
                name: 'Blacha stalowa 2mm',
                quantity: 8,
                unit: 'm²',
                unitCost: 120,
                status: 'Na stanie',
                materialId: 'mat-steel-sheet-thin'
            },
            {
                id: 'bom-led-strip-warm',
                type: 'Komponent gotowy',
                name: 'Taśma LED 3000K IP65',
                quantity: 15,
                unit: 'mb',
                unitCost: 45,
                status: 'Zamówione',
                materialId: 'mat-led-strip-warm'
            }
        ]
    },
    {
        id: 'tile-dining-tables',
        name: 'Stoły Restauracyjne',
        status: 'W produkcji CNC',
        project: 'proj-2024-restaurant-loft',
        moduł_nadrzędny: 'dining-area',
        group: 'group-dining-area',
        opis: 'Stoły dębowe dla 8 osób z metalowymi nogami',
        przypisany_projektant: 'Marek Wiśniewski',
        termin: '2025-01-05',
        laborCost: 3200,
        bom: [
            {
                id: 'bom-oak-board-35mm',
                type: 'Materiał surowy',
                name: 'Deska dębowa 35mm x 800mm x 1800mm',
                quantity: 12,
                unit: 'szt',
                unitCost: 380,
                status: 'Na stanie',
                materialId: 'mat-oak-board-35mm'
            },
            {
                id: 'bom-steel-legs',
                type: 'Komponent gotowy',
                name: 'Nogi stalowe do stołu H=720mm',
                quantity: 48,
                unit: 'szt',
                unitCost: 95,
                status: 'Zamówione',
                materialId: 'mat-table-legs-steel'
            }
        ]
    },

    // === BIURO "TECH HUB" === //
    {
        id: 'tile-reception-desk',
        name: 'Biurko Recepcyjne Tech Hub',
        status: 'Zakończony' as any,
        project: 'proj-2024-office-modern',
        moduł_nadrzędny: 'reception',
        group: 'group-reception',
        opis: 'Nowoczesne biurko recepcyjne z podświetleniem LED',
        przypisany_projektant: 'Tomasz Kowalczyk',
        termin: '2024-11-30',
        laborCost: 1800,
        bom: [
            {
                id: 'bom-mdf-white-19mm',
                type: 'Materiał surowy',
                name: 'Płyta MDF biała 19mm',
                quantity: 4,
                unit: 'ark',
                unitCost: 120,
                status: 'Na stanie',
                materialId: 'mat-mdf-white-19mm'
            },
            {
                id: 'bom-acrylic-clear',
                type: 'Materiał surowy',
                name: 'Plexi bezbarwne 10mm',
                quantity: 2,
                unit: 'm²',
                unitCost: 180,
                status: 'Na stanie',
                materialId: 'mat-acrylic-clear-10mm'
            }
        ]
    },
    {
        id: 'tile-workstations',
        name: 'Stanowiska Pracy Modułowe',
        status: 'Zakończony' as any,
        project: 'proj-2024-office-modern',
        moduł_nadrzędny: 'openspace',
        group: 'group-openspace',
        opis: 'System modułowych biurek dla 24 pracowników',
        przypisany_projektant: 'Katarzyna Nowak',
        termin: '2024-12-05',
        laborCost: 7200,
        bom: [
            {
                id: 'bom-chipboard-lam-18mm',
                type: 'Materiał surowy',
                name: 'Płyta wiórowa laminowana 18mm',
                quantity: 32,
                unit: 'ark',
                unitCost: 85,
                status: 'Na stanie',
                materialId: 'mat-chipboard-laminated'
            },
            {
                id: 'bom-office-legs-adj',
                type: 'Komponent gotowy',
                name: 'Nogi biurkowe regulowane 680-1160mm',
                quantity: 96,
                unit: 'szt',
                unitCost: 125,
                status: 'Na stanie',
                materialId: 'mat-office-legs-adjustable'
            }
        ]
    },

    // === APARTAMENT LUXURY === //
    {
        id: 'tile-kitchen-island',
        name: 'Wyspa Kuchenna Premium',
        status: 'Projektowanie',
        project: 'proj-2024-apartment-luxury',
        moduł_nadrzędny: 'kitchen',
        group: 'group-kitchen',
        opis: 'Wyspa kuchenna z blatem kwarcowym i oświetleniem',
        przypisany_projektant: 'Agnieszka Zielińska',
        termin: '2025-02-10',
        laborCost: 4500,
        bom: [
            {
                id: 'bom-quartz-countertop',
                type: 'Komponent gotowy',
                name: 'Blat kwarcowy Caesarstone 20mm',
                quantity: 8,
                unit: 'm²',
                unitCost: 750,
                status: 'Do zamówienia',
                materialId: 'mat-quartz-caesarstone'
            },
            {
                id: 'bom-cabinet-doors-luxury',
                type: 'Komponent gotowy',
                name: 'Fronty szafek lakierowane mat',
                quantity: 18,
                unit: 'szt',
                unitCost: 220,
                status: 'Do zamówienia',
                materialId: 'mat-cabinet-fronts-luxury'
            }
        ]
    },
    {
        id: 'tile-wardrobe-master',
        name: 'Szafa Wnękowa - Sypialnia Główna',
        status: 'W KOLEJCE',
        project: 'proj-2024-apartment-luxury',
        moduł_nadrzędny: 'master-bedroom',
        group: 'group-master-bedroom',
        opis: 'Szafa wnękowa 4-drzwiowa z lustrem i oświetleniem',
        przypisany_projektant: 'Agnieszka Zielińska',
        termin: '2025-02-20',
        laborCost: 3800,
        bom: [
            {
                id: 'bom-mirror-4mm',
                type: 'Materiał surowy',
                name: 'Lustro 4mm fazowane',
                quantity: 6,
                unit: 'm²',
                unitCost: 95,
                status: 'Do zamówienia',
                materialId: 'mat-mirror-beveled'
            },
            {
                id: 'bom-sliding-system',
                type: 'Komponent gotowy',
                name: 'System przesuwny premium do szaf',
                quantity: 2,
                unit: 'kpl',
                unitCost: 450,
                status: 'Do zamówienia',
                materialId: 'mat-sliding-wardrobe-system'
            }
        ]
    },

    // === HOTEL BOUTIQUE === //
    {
        id: 'tile-hotel-reception',
        name: 'Recepcja Hotelowa',
        status: 'W KOLEJCE',
        project: 'proj-2024-hotel-boutique',
        moduł_nadrzędny: 'lobby',
        group: 'group-lobby',
        opis: 'Recepcja w stylu vintage z elementami mosiądzymi',
        przypisany_projektant: 'Paweł Adamski',
        termin: '2025-03-15',
        laborCost: 5200,
        bom: [
            {
                id: 'bom-walnut-veneer',
                type: 'Materiał surowy',
                name: 'Fornir orzechowy 0.6mm',
                quantity: 12,
                unit: 'm²',
                unitCost: 165,
                status: 'Do zamówienia',
                materialId: 'mat-walnut-veneer'
            },
            {
                id: 'bom-brass-fittings',
                type: 'Komponent gotowy',
                name: 'Okucia mosiężne vintage',
                quantity: 24,
                unit: 'szt',
                unitCost: 85,
                status: 'Do zamówienia',
                materialId: 'mat-brass-vintage-fittings'
            }
        ]
    },

    // === SALON MODY === //
    {
        id: 'tile-display-units',
        name: 'Ekspozytory Ubrań',
        status: 'W trakcie projektowania',
        project: 'proj-2024-retail-fashion',
        moduł_nadrzędny: 'interior',
        group: 'group-interior',
        opis: 'Mobilne ekspozytory na ubrania z systemem oświetlenia',
        przypisany_projektant: 'Magdalena Kowal',
        termin: '2025-01-20',
        laborCost: 2800,
        bom: [
            {
                id: 'bom-aluminum-profile',
                type: 'Materiał surowy',
                name: 'Profil aluminiowy anodowany 30x30mm',
                quantity: 48,
                unit: 'mb',
                unitCost: 35,
                status: 'Na stanie',
                materialId: 'mat-aluminum-profile-30x30'
            },
            {
                id: 'bom-clothing-rail',
                type: 'Komponent gotowy',
                name: 'Drążek na ubrania chromowany Ø25mm',
                quantity: 16,
                unit: 'mb',
                unitCost: 42,
                status: 'Na stanie',
                materialId: 'mat-clothing-rail-chrome'
            }
        ]
    },

    // === KLINIKA MEDYCZNA === //
    {
        id: 'tile-medical-cabinets',
        name: 'Szafki Medyczne',
        status: 'Zaakceptowane',
        project: 'proj-2024-clinic-medical',
        moduł_nadrzędny: 'treatment-rooms',
        group: 'group-treatment-rooms',
        opis: 'Szafki na sprzęt medyczny ze stali nierdzewnej',
        przypisany_projektant: 'Michał Górski',
        termin: '2025-01-15',
        laborCost: 6400,
        bom: [
            {
                id: 'bom-stainless-steel-sheet',
                type: 'Materiał surowy',
                name: 'Blacha nierdzewna AISI 304 1.5mm',
                quantity: 24,
                unit: 'm²',
                unitCost: 185,
                status: 'Zamówione',
                materialId: 'mat-stainless-steel-304'
            },
            {
                id: 'bom-medical-locks',
                type: 'Komponent gotowy',
                name: 'Zamki medyczne antybakteryjne',
                quantity: 32,
                unit: 'szt',
                unitCost: 125,
                status: 'Do zamówienia',
                materialId: 'mat-medical-antibacterial-locks'
            }
        ]
    },
    {
        id: 'tile-lab-workbench',
        name: 'Stoły Laboratoryjne',
        status: 'W trakcie projektowania',
        project: 'proj-2024-clinic-medical',
        moduł_nadrzędny: 'lab',
        group: 'group-lab',
        opis: 'Stoły laboratoryjne z odpornymi na chemikalia blatami',
        przypisany_projektant: 'Michał Górski',
        termin: '2025-01-25',
        laborCost: 4200,
        bom: [
            {
                id: 'bom-lab-countertop',
                type: 'Komponent gotowy',
                name: 'Blat laboratoryjny HPL antacid 13mm',
                quantity: 6,
                unit: 'm²',
                unitCost: 320,
                status: 'Do zamówienia',
                materialId: 'mat-lab-hpl-countertop'
            },
            {
                id: 'bom-lab-cabinet-frame',
                type: 'Materiał surowy',
                name: 'Korpus szafki laboratoryjnej stal+epoxy',
                quantity: 8,
                unit: 'szt',
                unitCost: 450,
                status: 'Do zamówienia',
                materialId: 'mat-lab-steel-frame'
            }
        ]
    }
]
