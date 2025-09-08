// src/data/mockDatabase.ts

import type { ProcessedClient } from '../types/clientData.types';
import type { Project } from '../types/projects.types';
import type { Tile } from '../types/tiles.types';

// --- BAZA DANYCH KLIENTÓW ---
export const mockClients: ProcessedClient[] = [
    {
        id: 'C-001', companyName: 'Telewizja Polska S.A.', nip: '5210412987', regon: '012241373',
        address: { street: 'Jana Pawła Woronicza', houseNumber: '17', city: 'Warszawa', postalCode: '00-999' },
        website: 'tvp.pl', email: 'kontakt@tvp.pl', description: 'Publiczny nadawca telewizyjny w Polsce.',
        contacts: [
            { imie: 'Jan', nazwisko: 'Kowalski', adres_email: 'j.kowalski@tvp.pl', telefon_kontaktowy: '222-222-222', opis: 'Dział Scenografii' },
            { imie: 'Maria', nazwisko: 'Zielińska', adres_email: 'm.zielinska@tvp.pl', telefon_kontaktowy: '222-222-223', opis: 'Główny Producent' }
        ],
        files: [], additionalInfo: 'Klient kluczowy, wymagający najwyższego priorytetu.', cardColor: '#e60012'
    },
    {
        id: 'C-002', companyName: 'Polsat', nip: '5261097967', regon: '011634620',
        address: { street: 'Ostrobramska', houseNumber: '77', city: 'Warszawa', postalCode: '04-175' },
        website: 'polsat.pl', email: 'biuro@polsat.pl', description: 'Komercyjna stacja telewizyjna z szerokim portfolio kanałów.',
        contacts: [{ imie: 'Anna', nazwisko: 'Nowak', adres_email: 'a.nowak@polsat.pl', telefon_kontaktowy: '501-501-501', opis: 'Produkcja eventowa' }],
        files: [], additionalInfo: '', cardColor: '#ff6b35'
    },
    {
        id: 'C-003', companyName: 'TVN Warner Bros. Discovery', nip: '5251581273', regon: '012114777',
        address: { street: 'Wiertnicza', houseNumber: '166', city: 'Warszawa', postalCode: '02-952' },
        website: 'tvn.pl', email: 'kontakt@tvn.pl', description: 'Wiodąca prywatna grupa medialna w Polsce.',
        contacts: [{ imie: 'Piotr', nazwisko: 'Zieliński', adres_email: 'p.zielinski@tvn.pl', telefon_kontaktowy: '600-600-600', opis: 'Kierownik Produkcji' }],
        files: [], additionalInfo: '', cardColor: '#1e3a8a'
    },
    {
        id: 'C-004', companyName: 'Canal+ Polska', nip: '5210082774', regon: '010078241',
        address: { street: 'al. gen. Władysława Sikorskiego', houseNumber: '9', city: 'Warszawa', postalCode: '02-758' },
        website: 'canalplus.pl', email: 'obsluga@canalplus.pl', description: 'Dostawca płatnej telewizji premium.',
        contacts: [{ imie: 'Katarzyna', nazwisko: 'Wójcik', adres_email: 'k.wojcik@canalplus.pl', telefon_kontaktowy: '700-700-700', opis: 'Marketing' }],
        files: [], additionalInfo: '', cardColor: '#000000'
    },
    {
        id: 'C-005', companyName: 'Live Nation Polska', nip: '5262758066', regon: '015664160',
        address: { street: 'Pilicka', houseNumber: '4', city: 'Warszawa', postalCode: '02-629' },
        website: 'livenation.pl', email: 'info@livenation.pl', description: 'Największy organizator koncertów i wydarzeń na żywo.',
        contacts: [{ imie: 'Tomasz', nazwisko: 'Kamiński', adres_email: 't.kaminski@livenation.pl', telefon_kontaktowy: '800-800-800', opis: 'Event Manager' }],
        files: [], additionalInfo: 'Współpraca przy festiwalach muzycznych.', cardColor: '#d9002a'
    },
    {
        id: 'C-006', companyName: 'Nowy Styl Group', nip: '8130323385', regon: '690323136',
        address: { street: 'Pużaka', houseNumber: '49', city: 'Krosno', postalCode: '38-400' },
        website: 'nowystyl.com', email: 'info@nowystyl.com', description: 'Europejski lider w produkcji mebli biurowych.',
        contacts: [{ imie: 'Marek', nazwisko: 'Nowicki', adres_email: 'm.nowicki@nowystyl.com', telefon_kontaktowy: '134-376-100', opis: 'Dział Marketingu' }],
        files: [], additionalInfo: 'Klient targowy.', cardColor: '#22c55e'
    },
    {
        id: 'C-007', companyName: 'Muzeum Narodowe w Warszawie', nip: '5260305641', regon: '000275558',
        address: { street: 'Al. Jerozolimskie', houseNumber: '3', city: 'Warszawa', postalCode: '00-495' },
        website: 'mnw.art.pl', email: 'muzeum@mnw.art.pl', description: 'Jedno z najstarszych i największych muzeów sztuki w Polsce.',
        contacts: [{ imie: 'Ewa', nazwisko: 'Lis', adres_email: 'e.lis@mnw.art.pl', telefon_kontaktowy: '22-621-10-31', opis: 'Kurator Wystaw' }],
        files: [], additionalInfo: '', cardColor: '#8a0d23'
    },
    {
        id: 'C-008', companyName: 'Teatr Wielki - Opera Narodowa', nip: '5250000620', regon: '000278453',
        address: { street: 'plac Teatralny', houseNumber: '1', city: 'Warszawa', postalCode: '00-950' },
        website: 'teatrwielki.pl', email: 'info@teatrwielki.pl', description: 'Najważniejsza scena operowa i baletowa w Polsce.',
        contacts: [{ imie: 'Adam', nazwisko: 'Dąbrowski', adres_email: 'a.dabrowski@teatrwielki.pl', telefon_kontaktowy: '22-692-02-00', opis: 'Szef Techniczny Sceny' }],
        files: [], additionalInfo: 'Projekty scenografii operowych.', cardColor: '#bda17c'
    },
    {
        id: 'C-009', companyName: 'CD PROJEKT RED', nip: '7342867148', regon: '492707333',
        address: { street: 'Jagiellońska', houseNumber: '74', city: 'Warszawa', postalCode: '03-301' },
        website: 'cdprojektred.com', email: 'media@cdprojektred.com', description: 'Producent gier wideo, twórcy serii "Wiedźmin" i "Cyberpunk 2077".',
        contacts: [{ imie: 'Monika', nazwisko: 'Zając', adres_email: 'm.zajac@cdpr.com', telefon_kontaktowy: '22-519-69-00', opis: 'Event & Community Manager' }],
        files: [], additionalInfo: 'Stoiska na targi gier (Gamescom, E3).', cardColor: '#ff003c'
    },
    {
        id: 'C-010', companyName: 'Allegro', nip: '5252674798', regon: '367129651',
        address: { street: 'Fabryczna', houseNumber: '6', city: 'Poznań', postalCode: '61-512' },
        website: 'allegro.pl', email: 'kontakt@allegro.pl', description: 'Największa platforma e-commerce w Polsce.',
        contacts: [{ imie: 'Paweł', nazwisko: 'Szymański', adres_email: 'p.szymanski@allegro.pl', telefon_kontaktowy: '61-84-99-100', opis: 'Brand Experience' }],
        files: [], additionalInfo: 'Wystrój eventów firmowych i konferencji.', cardColor: '#ffae00'
    }
];

// --- BAZA DANYCH PROJEKTÓW ---
export const mockProjects: Project[] = [
    { id: 'P-001', name: 'TVP - Studio Wiadomości 2025', clientId: 'C-001', client: 'Telewizja Polska S.A.', status: 'Active', deadline: '2025-10-20', budget: 450000, manager: 'Anna Kowalska', progress: 65, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz'], clientColor: '#e60012' },
    { id: 'P-002', name: 'Polsat - Scenografia "TTBZ 22"', clientId: 'C-002', client: 'Polsat', status: 'Active', deadline: '2025-11-05', budget: 780000, manager: 'Piotr Nowak', progress: 40, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz', 'zakwaterowanie'], clientColor: '#ff6b35' },
    { id: 'P-003', name: 'TVN - Studio "Fakty" - Refresh', clientId: 'C-003', client: 'TVN Warner Bros. Discovery', status: 'On Hold', deadline: '2026-01-15', budget: 220000, manager: 'Marek Wiśniewski', progress: 20, modules: ['wycena', 'koncepcja'], clientColor: '#1e3a8a' },
    { id: 'P-004', name: 'Stoisko Targowe dla "Nowy Styl"', clientId: 'C-006', client: 'Nowy Styl Group', status: 'Done', deadline: '2025-08-30', budget: 150000, manager: 'Anna Kowalska', progress: 100, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz'], clientColor: '#22c55e' },
    { id: 'P-005', name: 'Canal+ - Studio sportowe', clientId: 'C-004', client: 'Canal+ Polska', status: 'Active', deadline: '2025-12-10', budget: 620000, manager: 'Katarzyna Wójcik', progress: 85, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'], clientColor: '#000000' },
    { id: 'P-006', name: 'Live Nation - Scena "Open\'er Festival"', clientId: 'C-005', client: 'Live Nation Polska', status: 'Active', deadline: '2026-06-01', budget: 1200000, manager: 'Tomasz Kamiński', progress: 15, modules: ['wycena', 'koncepcja', 'logistyka_montaz'], clientColor: '#d9002a' },
    { id: 'P-007', name: 'Muzeum Narodowe - Wystawa "Sztuka Polska"', clientId: 'C-007', client: 'Muzeum Narodowe w Warszawie', status: 'Active', deadline: '2025-10-01', budget: 310000, manager: 'Ewa Lis', progress: 95, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'], clientColor: '#8a0d23' },
    { id: 'P-008', name: 'Opera Narodowa - "Halka"', clientId: 'C-008', client: 'Teatr Wielki - Opera Narodowa', status: 'Done', deadline: '2025-09-05', budget: 950000, manager: 'Adam Dąbrowski', progress: 100, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'montaz'], clientColor: '#bda17c' },
    { id: 'P-009', name: 'CDPR - Stoisko "Gamescom 2026"', clientId: 'C-009', client: 'CD PROJEKT RED', status: 'Active', deadline: '2026-07-15', budget: 2500000, manager: 'Monika Zając', progress: 5, modules: ['wycena', 'koncepcja'], clientColor: '#ff003c' },
    { id: 'P-010', name: 'Allegro - Konferencja "Brand Day"', clientId: 'C-010', client: 'Allegro', status: 'On Hold', deadline: '2025-11-20', budget: 180000, manager: 'Paweł Szymański', progress: 50, modules: ['koncepcja', 'projektowanie_techniczne'], clientColor: '#ffae00' },
    { id: 'P-011', name: 'TVP - Studio "Pytanie na Śniadanie"', clientId: 'C-001', client: 'Telewizja Polska S.A.', status: 'Active', deadline: '2026-02-01', budget: 350000, manager: 'Anna Kowalska', progress: 25, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#e60012' },
    { id: 'P-012', name: 'Polsat - Sylwester 2025', clientId: 'C-002', client: 'Polsat', status: 'Active', deadline: '2025-12-15', budget: 1500000, manager: 'Piotr Nowak', progress: 10, modules: ['wycena', 'koncepcja', 'logistyka_montaz'], clientColor: '#ff6b35' },
    { id: 'P-013', name: 'TVN - Nowe studio "Dzień Dobry TVN"', clientId: 'C-003', client: 'TVN Warner Bros. Discovery', status: 'Active', deadline: '2026-03-01', budget: 850000, manager: 'Marek Wiśniewski', progress: 30, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#1e3a8a' },
    { id: 'P-014', name: 'Canal+ - Studio "Ekstraklasa"', clientId: 'C-004', client: 'Canal+ Polska', status: 'Done', deadline: '2025-07-20', budget: 550000, manager: 'Katarzyna Wójcik', progress: 100, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#000000' },
    { id: 'P-015', name: 'Live Nation - Trasa koncertowa Dawida Podsiadło', clientId: 'C-005', client: 'Live Nation Polska', status: 'Active', deadline: '2026-04-10', budget: 980000, manager: 'Tomasz Kamiński', progress: 5, modules: ['koncepcja', 'logistyka_montaz'], clientColor: '#d9002a' },
    { id: 'P-016', name: 'Muzeum Narodowe - Wystawa "Impresjoniści"', clientId: 'C-007', client: 'Muzeum Narodowe w Warszawie', status: 'Active', deadline: '2026-05-01', budget: 420000, manager: 'Ewa Lis', progress: 10, modules: ['koncepcja', 'projektowanie_techniczne'], clientColor: '#8a0d23' },
    { id: 'P-017', name: 'Opera Narodowa - "Aida"', clientId: 'C-008', client: 'Teatr Wielki - Opera Narodowa', status: 'Active', deadline: '2026-08-20', budget: 1100000, manager: 'Adam Dąbrowski', progress: 0, modules: ['wycena', 'koncepcja'], clientColor: '#bda17c' },
    { id: 'P-018', name: 'CDPR - Stoisko "PAX East 2026"', clientId: 'C-009', client: 'CD PROJEKT RED', status: 'On Hold', deadline: '2026-02-10', budget: 1800000, manager: 'Monika Zając', progress: 0, modules: ['koncepcja'], clientColor: '#ff003c' },
    { id: 'P-019', name: 'Allegro - Gala "Best Brand Awards"', clientId: 'C-010', client: 'Allegro', status: 'Active', deadline: '2025-10-30', budget: 250000, manager: 'Paweł Szymański', progress: 60, modules: ['koncepcja', 'produkcja'], clientColor: '#ffae00' },
    { id: 'P-020', name: 'Nowy Styl - Showroom w Berlinie', clientId: 'C-006', client: 'Nowy Styl Group', status: 'Active', deadline: '2026-04-01', budget: 600000, manager: 'Anna Kowalska', progress: 15, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne'], clientColor: '#22c55e' }
];

// --- BAZA DANYCH KAFLI (ELEMENTÓW) ---
export const mockTiles: Tile[] = [
    // --- P-001: TVP Wiadomości ---
    { id: 'T-001', name: 'Stół Prezenterski - Blat Główny', status: 'W trakcie projektowania', project: 'P-001', priority: 'Wysoki', technology: 'Frezowanie CNC + Lakierowanie', laborCost: 2500, assignee: 'Kamil Arndt', bom: [
        { id: 'B-1-1', type: 'Materiał surowy', name: 'MDF 30mm Standard', materialId: 'MAT_R010', quantity: 2, unit: 'arkusz', status: 'Na stanie', unitCost: 245.00 },
        { id: 'B-1-2', type: 'Materiał surowy', name: 'Plexi 10mm Opal', materialId: 'MAT_R016-variant-10-opal', quantity: 1, unit: 'arkusz', status: 'Do zamówienia', unitCost: 180.00 },
        { id: 'B-1-3', type: 'Usługa', name: 'Lakierowanie na wysoki połysk', quantity: 8, unit: 'm²', status: 'Do zamówienia', unitCost: 250.00 },
    ]},
    { id: 'T-002', name: 'Panel LED tła (Segment A)', status: 'Zaakceptowane', project: 'P-001', priority: 'Wysoki', technology: 'Konstrukcja aluminiowa', laborCost: 1800, assignee: 'Anna Kowalska', bom: [
        { id: 'B-2-1', type: 'Materiał surowy', name: 'Kątownik aluminiowy 20x20mm', materialId: 'MAT_R017', quantity: 40, unit: 'mb', status: 'Na stanie', unitCost: 18.50 },
    ]},
    { id: 'T-003', name: 'Podest kamery', status: 'W KOLEJCE', project: 'P-001', priority: 'Średni', technology: 'Konstrukcja ze sklejki', laborCost: 800, assignee: 'Piotr Nowak', bom: [
        { id: 'B-3-1', type: 'Materiał surowy', name: 'Sklejka 18mm', materialId: 'MAT_R012-variant-18', quantity: 4, unit: 'arkusz', status: 'Na stanie', unitCost: 110.00 },
    ]},
    { id: 'T-004', name: 'Green Screen - stelaż', status: 'Projektowanie', project: 'P-001', priority: 'Średni', technology: 'System modułowy', laborCost: 1200, assignee: 'Kamil Arndt', bom: []},

    // --- P-002: Polsat TTBZ ---
    { id: 'T-005', name: 'Podest Centralny - Schody', status: 'W KOLEJCE', project: 'P-002', priority: 'Wysoki', technology: 'Konstrukcja ze sklejki', laborCost: 3200, assignee: 'Piotr Nowak', bom: [
        { id: 'B-5-1', type: 'Materiał surowy', name: 'Sklejka 18mm', materialId: 'MAT_R012-variant-18', quantity: 10, unit: 'arkusz', status: 'Do zamówienia', unitCost: 110.00 },
    ]},
    { id: 'T-006', name: 'Element dekoracyjny - Kula', status: 'Projektowanie', project: 'P-002', priority: 'Średni', technology: 'Druk 3D + Szpachlowanie', laborCost: 900, assignee: 'Kamil Arndt', bom: [
        { id: 'B-6-1', type: 'Materiał surowy', name: 'Filament PLA 1.75mm', materialId: 'MAT_R022', quantity: 5, unit: 'kg', status: 'Na stanie', unitCost: 89.00 },
    ]},
    { id: 'T-007', name: 'Fotel Jurora (replika)', status: 'W trakcie projektowania', project: 'P-002', priority: 'Niski', technology: 'Tapicerstwo, stolarstwo', laborCost: 4000, assignee: 'Anna Kowalska', bom: []},
    { id: 'T-008', name: 'Ściana video - konstrukcja nośna', status: 'Do akceptacji', project: 'P-002', priority: 'Wysoki', technology: 'Konstrukcja stalowa', laborCost: 6000, assignee: 'Piotr Nowak', bom: [
        { id: 'B-8-1', type: 'Materiał surowy', name: 'Profil stalowy 40x40mm', materialId: 'MAT_R017-variant-stal', quantity: 80, unit: 'mb', status: 'Do zamówienia', unitCost: 45.00 },
    ]},

    // --- P-003: TVN Fakty ---
    { id: 'T-009', name: 'Panel boczny - fornir', status: 'Wstrzymany', project: 'P-003', priority: 'Średni', technology: 'Stolarstwo', laborCost: 700, assignee: 'Marek Wiśniewski', bom: []},
    { id: 'T-010', name: 'Logo "Fakty" - podświetlane', status: 'Wstrzymany', project: 'P-003', priority: 'Wysoki', technology: 'Plexi + LED', laborCost: 1500, assignee: 'Marek Wiśniewski', bom: []},

    // --- P-004: Nowy Styl ---
    { id: 'T-011', name: 'Ściana Wystawiennicza - Moduł Główny', status: 'Gotowy do montażu', project: 'P-004', priority: 'Wysoki', technology: 'System modułowy', laborCost: 1500, assignee: 'Anna Kowalska', bom: [
        { id: 'B-11-1', type: 'Materiał surowy', name: 'Płyta wiórowa 18mm Laminowana', materialId: 'MAT_R014-variant-18', quantity: 6, unit: 'arkusz', status: 'Na stanie', unitCost: 75.00 },
    ]},
    { id: 'T-012', name: 'Lada recepcyjna', status: 'Zakończony', project: 'P-004', priority: 'Wysoki', technology: 'Stolarstwo', laborCost: 2200, assignee: 'Anna Kowalska', bom: []},

    // --- P-005: Canal+ Sport ---
    { id: 'T-013', name: 'Stół analityczny - dotykowy', status: 'W produkcji CNC', project: 'P-005', priority: 'Wysoki', technology: 'Integracja ekranów', laborCost: 4500, assignee: 'Katarzyna Wójcik', bom: [
        { id: 'B-13-1', type: 'Komponent gotowy', name: 'Ekran dotykowy 65"', quantity: 1, unit: 'szt', status: 'Zamówione', unitCost: 8000.00 },
    ]},
    { id: 'T-014', name: 'Tło studia - mapa boiska', status: 'Gotowy do montażu', project: 'P-005', priority: 'Średni', technology: 'Wydruk wielkoformatowy', laborCost: 900, assignee: 'Katarzyna Wójcik', bom: []},

    // --- Dodatkowe ---
    { id: 'T-015', name: 'Element sceny - Open\'er', status: 'Projektowanie', project: 'P-006', priority: 'Wysoki', technology: 'Rusztowania', laborCost: 10000, assignee: 'Tomasz Kamiński', bom: []},
    { id: 'T-016', name: 'Gablota na eksponat "Bitwa pod Grunwaldem"', status: 'Zaakceptowane', project: 'P-007', priority: 'Wysoki', technology: 'Szkło hartowane', laborCost: 5000, assignee: 'Ewa Lis', bom: [
        { id: 'B-16-1', type: 'Materiał surowy', name: 'Szkło hartowane 10mm', materialId: 'MAT_R018-variant-szklo', quantity: 15, unit: 'm²', status: 'Do zamówienia', unitCost: 450.00 },
    ]},
    { id: 'T-017', name: 'Tron operowy "Halka"', status: 'Zakończony', project: 'P-008', priority: 'Wysoki', technology: 'Rzeźbienie, stolarstwo', laborCost: 8000, assignee: 'Adam Dąbrowski', bom: []},
    { id: 'T-018', name: 'Cyberpunkowy neon - Gamescom', status: 'Projektowanie', project: 'P-009', priority: 'Wysoki', technology: 'Neony LED', laborCost: 3500, assignee: 'Monika Zając', bom: []},
    { id: 'T-019', name: 'Podświetlane logo Allegro', status: 'W KOLEJCE', project: 'P-010', priority: 'Średni', technology: 'Frezowanie CNC', laborCost: 1200, assignee: 'Paweł Szymański', bom: [
        { id: 'B-19-1', type: 'Materiał surowy', name: 'Plexi 15mm', materialId: 'MAT_R016-variant-15', quantity: 2, unit: 'arkusz', status: 'Na stanie', unitCost: 220.00 },
    ]},
];


