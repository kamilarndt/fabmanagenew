// src/data/mockDatabase.ts

import type { ProcessedClient } from '../types/clientData.types';
import type { Project } from '../types/projects.types';
import type { Tile } from '../types/tiles.types';
import { TILE_STATUSES, MATERIAL_STATUSES } from '../types/enums'

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

// Funkcja pomocnicza do dodawania brakujących pól do projektów
const addMissingProjectFields = (project: any): Project => {
    return {
        ...project,
        numer: project.numer || `P-2025/01/${project.id.split('-')[1]}`,
        typ: project.typ || 'Inne',
        lokalizacja: project.lokalizacja || 'Warszawa',
        data_utworzenia: project.data_utworzenia || '2025-01-01',
        data_rozpoczęcia: project.data_rozpoczęcia || '2025-01-15',
        postep: project.postep || project.progress || 0,
        manager_id: project.manager_id || 'M-001',
        description: project.description || `Projekt ${project.name}`,
        miniatura: project.miniatura || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop',
        repozytorium_plikow: project.repozytorium_plikow || 'https://drive.google.com/drive/folders/project-files',
        link_model_3d: project.link_model_3d || 'https://speckle.xyz/streams/project-3d'
    }
}

// --- BAZA DANYCH PROJEKTÓW ---
const rawMockProjects = [
    {
        id: 'P-001',
        numer: 'P-2025/01/001',
        name: 'TVP - Studio Wiadomości 2025',
        typ: 'Scenografia TV',
        lokalizacja: 'Warszawa, ul. Woronicza 17',
        clientId: 'C-001',
        client: 'Telewizja Polska S.A.',
        status: 'W realizacji',
        data_utworzenia: '2025-01-15',
        data_rozpoczęcia: '2025-02-01',
        deadline: '2025-10-20',
        postep: 65,
        budget: 450000,
        manager: 'Anna Kowalska',
        manager_id: 'M-001',
        description: 'Kompleksowa modernizacja studia wiadomości TVP z nowoczesną scenografią i systemem LED',
        miniatura: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=200&fit=crop',
        repozytorium_plikow: 'https://drive.google.com/drive/folders/tvp-studio-2025',
        link_model_3d: 'https://speckle.xyz/streams/tvp-studio-3d',
        progress: 65, // deprecated
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz'],
        clientColor: '#e60012'
    },
    {
        id: 'P-002',
        numer: 'P-2025/01/002',
        name: 'Polsat - Scenografia "TTBZ 22"',
        typ: 'Scenografia TV',
        lokalizacja: 'Warszawa, ul. Ostrobramska 77',
        clientId: 'C-002',
        client: 'Polsat',
        status: 'W realizacji',
        data_utworzenia: '2025-01-20',
        data_rozpoczęcia: '2025-02-15',
        deadline: '2025-11-05',
        postep: 40,
        budget: 780000,
        manager: 'Piotr Nowak',
        manager_id: 'M-002',
        description: 'Scenografia dla programu "Twoja Twarz Brzmi Znajomo" - sezon 22',
        miniatura: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=200&fit=crop',
        repozytorium_plikow: 'https://drive.google.com/drive/folders/polsat-ttbz-22',
        link_model_3d: 'https://speckle.xyz/streams/polsat-ttbz-3d',
        progress: 40, // deprecated
        modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz', 'zakwaterowanie'],
        clientColor: '#ff6b35'
    },
    { id: 'P-003', name: 'TVN - Studio "Fakty" - Refresh', clientId: 'C-003', client: 'TVN Warner Bros. Discovery', status: 'Wstrzymany', deadline: '2026-01-15', budget: 220000, manager: 'Marek Wiśniewski', progress: 20, modules: ['wycena', 'koncepcja'], clientColor: '#1e3a8a' },
    { id: 'P-004', name: 'Stoisko Targowe dla "Nowy Styl"', clientId: 'C-006', client: 'Nowy Styl Group', status: 'Zakończony', deadline: '2025-08-30', budget: 150000, manager: 'Anna Kowalska', progress: 100, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'logistyka_montaz'], clientColor: '#22c55e' },
    { id: 'P-005', name: 'Canal+ - Studio sportowe', clientId: 'C-004', client: 'Canal+ Polska', status: 'W realizacji', deadline: '2025-12-10', budget: 620000, manager: 'Katarzyna Wójcik', progress: 85, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'], clientColor: '#000000' },
    { id: 'P-006', name: 'Live Nation - Scena "Open\'er Festival"', clientId: 'C-005', client: 'Live Nation Polska', status: 'W realizacji', deadline: '2026-06-01', budget: 1200000, manager: 'Tomasz Kamiński', progress: 15, modules: ['wycena', 'koncepcja', 'logistyka_montaz'], clientColor: '#d9002a' },
    { id: 'P-007', name: 'Muzeum Narodowe - Wystawa "Sztuka Polska"', clientId: 'C-007', client: 'Muzeum Narodowe w Warszawie', status: 'W realizacji', deadline: '2025-10-01', budget: 310000, manager: 'Ewa Lis', progress: 95, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy'], clientColor: '#8a0d23' },
    { id: 'P-008', name: 'Opera Narodowa - "Halka"', clientId: 'C-008', client: 'Teatr Wielki - Opera Narodowa', status: 'Zakończony', deadline: '2025-09-05', budget: 950000, manager: 'Adam Dąbrowski', progress: 100, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja', 'materialy', 'montaz'], clientColor: '#bda17c' },
    { id: 'P-009', name: 'CDPR - Stoisko "Gamescom 2026"', clientId: 'C-009', client: 'CD PROJEKT RED', status: 'W realizacji', deadline: '2026-07-15', budget: 2500000, manager: 'Monika Zając', progress: 5, modules: ['wycena', 'koncepcja'], clientColor: '#ff003c' },
    { id: 'P-010', name: 'Allegro - Konferencja "Brand Day"', clientId: 'C-010', client: 'Allegro', status: 'Wstrzymany', deadline: '2025-11-20', budget: 180000, manager: 'Paweł Szymański', progress: 50, modules: ['koncepcja', 'projektowanie_techniczne'], clientColor: '#ffae00' },
    { id: 'P-011', name: 'TVP - Studio "Pytanie na Śniadanie"', clientId: 'C-001', client: 'Telewizja Polska S.A.', status: 'W realizacji', deadline: '2026-02-01', budget: 350000, manager: 'Anna Kowalska', progress: 25, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#e60012' },
    { id: 'P-012', name: 'Polsat - Sylwester 2025', clientId: 'C-002', client: 'Polsat', status: 'W realizacji', deadline: '2025-12-15', budget: 1500000, manager: 'Piotr Nowak', progress: 10, modules: ['wycena', 'koncepcja', 'logistyka_montaz'], clientColor: '#ff6b35' },
    { id: 'P-013', name: 'TVN - Nowe studio "Dzień Dobry TVN"', clientId: 'C-003', client: 'TVN Warner Bros. Discovery', status: 'W realizacji', deadline: '2026-03-01', budget: 850000, manager: 'Marek Wiśniewski', progress: 30, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#1e3a8a' },
    { id: 'P-014', name: 'Canal+ - Studio "Ekstraklasa"', clientId: 'C-004', client: 'Canal+ Polska', status: 'Zakończony', deadline: '2025-07-20', budget: 550000, manager: 'Katarzyna Wójcik', progress: 100, modules: ['koncepcja', 'projektowanie_techniczne', 'produkcja'], clientColor: '#000000' },
    { id: 'P-015', name: 'Live Nation - Trasa koncertowa Dawida Podsiadło', clientId: 'C-005', client: 'Live Nation Polska', status: 'W realizacji', deadline: '2026-04-10', budget: 980000, manager: 'Tomasz Kamiński', progress: 5, modules: ['koncepcja', 'logistyka_montaz'], clientColor: '#d9002a' },
    { id: 'P-016', name: 'Muzeum Narodowe - Wystawa "Impresjoniści"', clientId: 'C-007', client: 'Muzeum Narodowe w Warszawie', status: 'W realizacji', deadline: '2026-05-01', budget: 420000, manager: 'Ewa Lis', progress: 10, modules: ['koncepcja', 'projektowanie_techniczne'], clientColor: '#8a0d23' },
    { id: 'P-017', name: 'Opera Narodowa - "Aida"', clientId: 'C-008', client: 'Teatr Wielki - Opera Narodowa', status: 'W realizacji', deadline: '2026-08-20', budget: 1100000, manager: 'Adam Dąbrowski', progress: 0, modules: ['wycena', 'koncepcja'], clientColor: '#bda17c' },
    { id: 'P-018', name: 'CDPR - Stoisko "PAX East 2026"', clientId: 'C-009', client: 'CD PROJEKT RED', status: 'Wstrzymany', deadline: '2026-02-10', budget: 1800000, manager: 'Monika Zając', progress: 0, modules: ['koncepcja'], clientColor: '#ff003c' },
    { id: 'P-019', name: 'Allegro - Gala "Best Brand Awards"', clientId: 'C-010', client: 'Allegro', status: 'W realizacji', deadline: '2025-10-30', budget: 250000, manager: 'Paweł Szymański', progress: 60, modules: ['koncepcja', 'produkcja'], clientColor: '#ffae00' },
    { id: 'P-020', name: 'Nowy Styl - Showroom w Berlinie', clientId: 'C-006', client: 'Nowy Styl Group', status: 'W realizacji', deadline: '2026-04-01', budget: 600000, manager: 'Anna Kowalska', progress: 15, modules: ['wycena', 'koncepcja', 'projektowanie_techniczne'], clientColor: '#22c55e' }
];

// Eksport projektów z automatycznym dodawaniem brakujących pól
export const mockProjects: Project[] = rawMockProjects.map(addMissingProjectFields);

// --- BAZA DANYCH KAFLI (ELEMENTÓW) ---
export const mockTiles: Tile[] = [
    // --- P-001: TVP Wiadomości ---
    {
        id: 'T-001',
        name: 'Stół Prezenterski - Blat Główny',
        status: 'W trakcie projektowania',
        project: 'P-001',
        moduł_nadrzędny: 'Scena Główna',
        opis: 'Główny stół prezenterski z blatem MDF i podświetleniem LED',
        link_model_3d: 'https://speckle.xyz/streams/tvp-studio-3d/tables/main-table',
        załączniki: ['stol-prezenterski-dxf.pdf', 'stol-prezenterski-render.jpg'],
        przypisany_projektant: 'K. Arndt',
        termin: '2025-09-15',
        priority: 'high',
        technology: 'Frezowanie CNC + Lakierowanie',
        laborCost: 2500,
        assignee: 'Kamil Arndt',
        bom: [
            { id: 'B-1-1', type: 'Materiał surowy', name: 'MDF 30mm Standard', materialId: 'MAT_R010', quantity: 2, unit: 'arkusz', status: 'Na stanie', unitCost: 245.00 },
            { id: 'B-1-2', type: 'Materiał surowy', name: 'Plexi 10mm Opal', materialId: 'MAT_R016-variant-10-opal', quantity: 1, unit: 'arkusz', status: 'Do zamówienia', unitCost: 180.00 },
            { id: 'B-1-3', type: 'Usługa', name: 'Lakierowanie na wysoki połysk', quantity: 8, unit: 'm²', status: 'Do zamówienia', unitCost: 250.00 },
        ]
    },
    {
        id: 'T-002',
        name: 'Panel LED tła (Segment A)',
        status: 'Zaakceptowane',
        project: 'P-001',
        moduł_nadrzędny: 'Scena Główna',
        opis: 'Panel LED do tła studia - segment A z systemem montażowym',
        link_model_3d: 'https://speckle.xyz/streams/tvp-studio-3d/panels/led-panel-a',
        załączniki: ['panel-led-a-dxf.pdf'],
        przypisany_projektant: 'A. Kowalska',
        termin: '2025-09-20',
        priority: 'high',
        technology: 'Konstrukcja aluminiowa',
        laborCost: 1800,
        assignee: 'Anna Kowalska',
        bom: [
            { id: 'B-2-1', type: 'Materiał surowy', name: 'Kątownik aluminiowy 20x20mm', materialId: 'MAT_R017', quantity: 40, unit: 'mb', status: 'Na stanie', unitCost: 18.50 },
        ]
    },
    {
        id: 'T-003', name: 'Podest kamery', status: 'W KOLEJCE', project: 'P-001', priority: 'medium', technology: 'Konstrukcja ze sklejki', laborCost: 800, assignee: 'Piotr Nowak', bom: [
            { id: 'B-3-1', type: 'Materiał surowy', name: 'Sklejka 18mm', materialId: 'MAT_R012-variant-18', quantity: 4, unit: 'arkusz', status: 'Na stanie', unitCost: 110.00 },
        ]
    },
    { id: 'T-004', name: 'Green Screen - stelaż', status: 'W TRAKCIE CIĘCIA', project: 'P-001', priority: 'medium', technology: 'System modułowy', laborCost: 1200, assignee: 'Kamil Arndt', bom: [] },

    // --- P-002: Polsat TTBZ ---
    {
        id: 'T-005', name: 'Podest Centralny - Schody', status: 'W KOLEJCE', project: 'P-002', priority: 'high', technology: 'Konstrukcja ze sklejki', laborCost: 3200, assignee: 'Piotr Nowak', bom: [
            { id: 'B-5-1', type: 'Materiał surowy', name: 'Sklejka 18mm', materialId: 'MAT_R012-variant-18', quantity: 10, unit: 'arkusz', status: 'Do zamówienia', unitCost: 110.00 },
        ]
    },
    {
        id: 'T-006', name: 'Element dekoracyjny - Kula', status: 'W produkcji CNC', project: 'P-002', priority: 'medium', technology: 'Druk 3D + Szpachlowanie', laborCost: 900, assignee: 'Kamil Arndt', bom: [
            { id: 'B-6-1', type: 'Materiał surowy', name: 'Filament PLA 1.75mm', materialId: 'MAT_R022', quantity: 5, unit: 'kg', status: 'Na stanie', unitCost: 89.00 },
        ]
    },
    { id: 'T-007', name: 'Fotel Jurora (replika)', status: 'Do akceptacji', project: 'P-002', priority: 'low', technology: 'Tapicerstwo, stolarstwo', laborCost: 4000, assignee: 'Anna Kowalska', bom: [] },
    {
        id: 'T-008', name: 'Ściana video - konstrukcja nośna', status: 'Do akceptacji', project: 'P-002', priority: 'high', technology: 'Konstrukcja stalowa', laborCost: 6000, assignee: 'Piotr Nowak', bom: [
            { id: 'B-8-1', type: 'Materiał surowy', name: 'Profil stalowy 40x40mm', materialId: 'MAT_R017-variant-stal', quantity: 80, unit: 'mb', status: 'Do zamówienia', unitCost: 45.00 },
        ]
    },

    // --- P-003: TVN Fakty ---
    { id: 'T-009', name: 'Panel boczny - fornir', status: 'W KOLEJCE', project: 'P-003', priority: 'medium', technology: 'Stolarstwo', laborCost: 700, assignee: 'Marek Wiśniewski', bom: [] },
    { id: 'T-010', name: 'Logo "Fakty" - podświetlane', status: 'Projektowanie', project: 'P-003', priority: 'high', technology: 'Plexi + LED', laborCost: 1500, assignee: 'Marek Wiśniewski', bom: [] },

    // --- P-004: Nowy Styl ---
    {
        id: 'T-011', name: 'Ściana Wystawiennicza - Moduł Główny', status: 'Gotowy do montażu', project: 'P-004', priority: 'high', technology: 'System modułowy', laborCost: 1500, assignee: 'Anna Kowalska', bom: [
            { id: 'B-11-1', type: 'Materiał surowy', name: 'Płyta wiórowa 18mm Laminowana', materialId: 'MAT_R014-variant-18', quantity: 6, unit: 'arkusz', status: 'Na stanie', unitCost: 75.00 },
        ]
    },
    { id: 'T-012', name: 'Lada recepcyjna', status: TILE_STATUSES.COMPLETED as any, project: 'P-004', priority: 'Wysoki' as any, technology: 'Stolarstwo', laborCost: 2200, assignee: 'Anna Kowalska', bom: [] },

    // --- P-005: Canal+ Sport ---
    {
        id: 'T-013', name: 'Stół analityczny - dotykowy', status: 'W produkcji CNC' as any, project: 'P-005', priority: 'Wysoki' as any, technology: 'Integracja ekranów', laborCost: 4500, assignee: 'Katarzyna Wójcik', bom: [
            { id: 'B-13-1', type: 'Komponent gotowy', name: 'Ekran dotykowy 65"', quantity: 1, unit: 'szt', status: MATERIAL_STATUSES.ORDERED as any, unitCost: 8000.00 },
        ]
    },
    { id: 'T-014', name: 'Tło studia - mapa boiska', status: 'Gotowy do montażu' as any, project: 'P-005', priority: 'Średni' as any, technology: 'Wydruk wielkoformatowy', laborCost: 900, assignee: 'Katarzyna Wójcik', bom: [] },

    // --- Dodatkowe ---
    { id: 'T-015', name: 'Element sceny - Open\'er', status: 'Projektowanie' as any, project: 'P-006', priority: 'Wysoki' as any, technology: 'Rusztowania', laborCost: 10000, assignee: 'Tomasz Kamiński', bom: [] },
    {
        id: 'T-016', name: 'Gablota na eksponat "Bitwa pod Grunwaldem"', status: 'Zaakceptowane' as any, project: 'P-007', priority: 'Wysoki' as any, technology: 'Szkło hartowane', laborCost: 5000, assignee: 'Ewa Lis', bom: [
            { id: 'B-16-1', type: 'Materiał surowy', name: 'Szkło hartowane 10mm', materialId: 'MAT_R018-variant-szklo', quantity: 15, unit: 'm²', status: MATERIAL_STATUSES.ORDERED as any, unitCost: 450.00 },
        ]
    },
    { id: 'T-017', name: 'Tron operowy "Halka"', status: 'Gotowy do montażu' as any, project: 'P-008', priority: 'Wysoki' as any, technology: 'Rzeźbienie, stolarstwo', laborCost: 8000, assignee: 'Adam Dąbrowski', bom: [] },
    { id: 'T-018', name: 'Cyberpunkowy neon - Gamescom', status: 'Do akceptacji' as any, project: 'P-009', priority: 'Wysoki' as any, technology: 'Neony LED', laborCost: 3500, assignee: 'Monika Zając', bom: [] },
    {
        id: 'T-019', name: 'Podświetlane logo Allegro', status: 'W KOLEJCE' as any, project: 'P-010', priority: 'Średni' as any, technology: 'Frezowanie CNC', laborCost: 1200, assignee: 'Paweł Szymański', bom: [
            { id: 'B-19-1', type: 'Materiał surowy', name: 'Plexi 15mm', materialId: 'MAT_R016-variant-15', quantity: 2, unit: 'arkusz', status: MATERIAL_STATUSES.AVAILABLE as any, unitCost: 220.00 },
        ]
    },
    // --- Nowe aktywne kafelki ---
    {
        id: 'T-020', name: 'Konstrukcja baneru - Brand Day', status: 'W TRAKCIE CIĘCIA' as any, project: 'P-010', priority: 'Wysoki' as any, technology: 'Konstrukcja aluminiowa', laborCost: 1800, assignee: 'Paweł Szymański', bom: [
            { id: 'B-20-1', type: 'Materiał surowy', name: 'Profil aluminiowy 30x30', materialId: 'MAT_R017', quantity: 50, unit: 'mb', status: MATERIAL_STATUSES.ORDERED as any, unitCost: 22.50 },
        ]
    },
    {
        id: 'T-021', name: 'Stoisko demo - PAX East', status: 'Zaakceptowane' as any, project: 'P-018', priority: 'Wysoki' as any, technology: 'System modułowy', laborCost: 7500, assignee: 'Monika Zając', bom: [
            { id: 'B-21-1', type: 'Materiał surowy', name: 'Sklejka 12mm', materialId: 'MAT_R012-variant-12', quantity: 12, unit: 'arkusz', status: MATERIAL_STATUSES.ORDERED as any, unitCost: 95.00 },
        ]
    },
    {
        id: 'T-022', name: 'Element sceny - Ekstraklasa', status: 'W KOLEJCE' as any, project: 'P-014', priority: 'Średni' as any, technology: 'Konstrukcja stalowa', laborCost: 4200, assignee: 'Katarzyna Wójcik', bom: [
            { id: 'B-22-1', type: 'Materiał surowy', name: 'Profil stalowy 30x30', materialId: 'MAT_R017-variant-stal', quantity: 60, unit: 'mb', status: MATERIAL_STATUSES.AVAILABLE as any, unitCost: 39.00 },
        ]
    },
];

// --- BAZA DANYCH PODWYKONAWCÓW ---
export const mockSubcontractors = [
    {
        id: 'SUB-001',
        name: 'Stal-Max Sp. z o.o.',
        category: 'Stal' as const,
        logo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop',
        contactPerson: 'Jan Kowalski',
        email: 'j.kowalski@stalmax.pl',
        phone: '+48 22 123 45 67',
        address: 'ul. Przemysłowa 15',
        city: 'Warszawa',
        postalCode: '00-001',
        website: 'https://stalmax.pl',
        rating: 4.5,
        status: 'Aktywny' as const,
        description: 'Specjalizujemy się w konstrukcjach stalowych, balustradach i elementach dekoracyjnych.',
        specialties: ['Konstrukcje stalowe', 'Balustrady', 'Elementy dekoracyjne', 'Spawanie'],
        capacity: {
            maxOrders: 20,
            currentOrders: 8
        },
        pricing: {
            minOrder: 500,
            averageCost: 120,
            currency: 'PLN'
        },
        deliveryTime: {
            standard: 14,
            rush: 7
        },
        notes: ['Dobry kontakt', 'Wymagają precyzyjnych rysunków', 'Szybka realizacja'],
        createdAt: '2024-01-15',
        updatedAt: '2025-01-15'
    },
    {
        id: 'SUB-002',
        name: 'Plexi-Art',
        category: 'Tworzywa sztuczne' as const,
        logo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
        contactPerson: 'Anna Nowak',
        email: 'a.nowak@plexiart.pl',
        phone: '+48 22 234 56 78',
        address: 'ul. Techniczna 8',
        city: 'Kraków',
        postalCode: '30-001',
        website: 'https://plexiart.pl',
        rating: 4.2,
        status: 'Aktywny' as const,
        description: 'Produkcja elementów z plexi, akrylu i innych tworzyw sztucznych.',
        specialties: ['Plexi', 'Akryl', 'Frezy CNC', 'Grawerowanie'],
        capacity: {
            maxOrders: 15,
            currentOrders: 5
        },
        pricing: {
            minOrder: 300,
            averageCost: 80,
            currency: 'PLN'
        },
        deliveryTime: {
            standard: 10,
            rush: 5
        },
        notes: ['Wysoka jakość', 'Szeroka gama kolorów'],
        createdAt: '2024-02-20',
        updatedAt: '2025-01-10'
    },
    {
        id: 'SUB-003',
        name: 'Tapicernia Premium',
        category: 'Tapicer' as const,
        logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
        contactPerson: 'Maria Wiśniewska',
        email: 'm.wisniewska@tapicernia.pl',
        phone: '+48 22 345 67 89',
        address: 'ul. Rzemieślnicza 22',
        city: 'Gdańsk',
        postalCode: '80-001',
        rating: 4.8,
        status: 'Aktywny' as const,
        description: 'Profesjonalne usługi tapicerskie dla mebli i elementów dekoracyjnych.',
        specialties: ['Tapicerka mebli', 'Obróbka skóry', 'Tkaniny dekoracyjne'],
        capacity: {
            maxOrders: 12,
            currentOrders: 3
        },
        pricing: {
            minOrder: 800,
            averageCost: 200,
            currency: 'PLN'
        },
        deliveryTime: {
            standard: 21,
            rush: 14
        },
        notes: ['Najwyższa jakość', 'Długie terminy realizacji', 'Drogie ale warto'],
        createdAt: '2024-03-10',
        updatedAt: '2025-01-05'
    },
    {
        id: 'SUB-004',
        name: 'Szklarnia Artystyczna',
        category: 'Szklarz' as const,
        logo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
        contactPerson: 'Piotr Zieliński',
        email: 'p.zielinski@szklarnia.pl',
        phone: '+48 22 456 78 90',
        address: 'ul. Szklarska 5',
        city: 'Wrocław',
        postalCode: '50-001',
        rating: 4.0,
        status: 'Aktywny' as const,
        description: 'Specjalizujemy się w szkle artystycznym, witrażach i elementach dekoracyjnych.',
        specialties: ['Witraże', 'Szkło artystyczne', 'Elementy dekoracyjne'],
        capacity: {
            maxOrders: 8,
            currentOrders: 2
        },
        pricing: {
            minOrder: 1000,
            averageCost: 300,
            currency: 'PLN'
        },
        deliveryTime: {
            standard: 28,
            rush: 21
        },
        notes: ['Unikalne projekty', 'Długie terminy', 'Wysokie ceny'],
        createdAt: '2024-04-15',
        updatedAt: '2024-12-20'
    },
    {
        id: 'SUB-005',
        name: 'Print-Express',
        category: 'Drukarnia' as const,
        logo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop',
        contactPerson: 'Tomasz Krawczyk',
        email: 't.krawczyk@printexpress.pl',
        phone: '+48 22 567 89 01',
        address: 'ul. Drukarska 12',
        city: 'Poznań',
        postalCode: '60-001',
        website: 'https://printexpress.pl',
        rating: 4.3,
        status: 'Aktywny' as const,
        description: 'Szybka drukarnia cyfrowa i offsetowa dla materiałów promocyjnych.',
        specialties: ['Druk cyfrowy', 'Offset', 'Wielkoformat', 'Banery'],
        capacity: {
            maxOrders: 50,
            currentOrders: 15
        },
        pricing: {
            minOrder: 100,
            averageCost: 25,
            currency: 'PLN'
        },
        deliveryTime: {
            standard: 3,
            rush: 1
        },
        notes: ['Szybka realizacja', 'Dobre ceny', 'Wysoka jakość druku'],
        createdAt: '2024-05-01',
        updatedAt: '2025-01-12'
    }
];

// --- BAZA DANYCH ZLECEŃ PODWYKONAWCÓW ---
export const mockSubcontractorOrders = [
    {
        id: 'ORD-001',
        subcontractorId: 'SUB-001',
        tileId: 'T-001',
        projectId: 'P-001',
        title: 'Konstrukcja stołu prezenterskiego',
        description: 'Stalowa konstrukcja nośna dla stołu prezenterskiego TVP',
        status: 'W produkcji' as const,
        orderDate: '2025-01-10',
        deadline: '2025-01-25',
        cost: 2500,
        currency: 'PLN',
        quantity: 1,
        specifications: ['Stal nierdzewna 304', 'Spawanie TIG', 'Powłoka antykorozyjna'],
        attachments: ['stol-konstrukcja-dxf.pdf', 'stol-konstrukcja-render.jpg'],
        notes: 'Priorytet wysoki - studio TVP',
        progress: 65,
        createdAt: '2025-01-10',
        updatedAt: '2025-01-15'
    },
    {
        id: 'ORD-002',
        subcontractorId: 'SUB-002',
        tileId: 'T-002',
        projectId: 'P-001',
        title: 'Panele LED - obudowy z plexi',
        description: 'Obudowy z plexi dla paneli LED tła studia',
        status: 'Zamówione' as const,
        orderDate: '2025-01-12',
        deadline: '2025-01-22',
        cost: 1200,
        currency: 'PLN',
        quantity: 4,
        specifications: ['Plexi 10mm opal', 'Frezy CNC', 'Krawędzie polerowane'],
        attachments: ['panel-led-obudowa-dxf.pdf'],
        notes: 'Dokładne wymiary w załączniku',
        progress: 20,
        createdAt: '2025-01-12',
        updatedAt: '2025-01-12'
    },
    {
        id: 'ORD-003',
        subcontractorId: 'SUB-003',
        tileId: 'T-003',
        projectId: 'P-001',
        title: 'Tapicerka krzeseł studia',
        description: 'Tapicerka 6 krzeseł dla studia TVP w kolorze granatowym',
        status: 'Do zamówienia' as const,
        orderDate: '2025-01-15',
        deadline: '2025-02-05',
        cost: 1800,
        currency: 'PLN',
        quantity: 6,
        specifications: ['Tkanina granatowa', 'Wypełnienie piankowe', 'Obróbka skórzana'],
        attachments: ['krzesla-wymiary.pdf', 'tkanina-wzor.jpg'],
        notes: 'Czekamy na zatwierdzenie koloru tkaniny',
        progress: 0,
        createdAt: '2025-01-15',
        updatedAt: '2025-01-15'
    }
];

