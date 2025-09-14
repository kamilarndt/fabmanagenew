-- Pełne seed dane z powiązaniami dla FabManage
-- Najpierw wyczyść istniejące dane
TRUNCATE TABLE packing_lists, logistics_routes, production_tasks, cnc_tasks, design_tasks, schedule_tasks, tile_materials, tiles, materials, projects, clients RESTART IDENTITY CASCADE;

-- KLIENCI
INSERT INTO clients (id, name, email, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'ACME Sp. z o.o.', 'contact@acme.pl', '+48 111 111 111'),
('22222222-2222-2222-2222-222222222222', 'TechCorp International', 'office@techcorp.com', '+48 222 222 222'),
('33333333-3333-3333-3333-333333333333', 'Studio Design Plus', 'hello@studiodesign.pl', '+48 333 333 333'),
('44444444-4444-4444-4444-444444444444', 'Event Masters', 'info@eventmasters.pl', '+48 444 444 444'),
('55555555-5555-5555-5555-555555555555', 'Galeria Sztuki Nowoczesnej', 'kontakt@galeria.art.pl', '+48 555 555 555');

-- PROJEKTY
INSERT INTO projects (id, client_id, name, status, deadline, modules, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Stoisko Targi 2025', 'active', '2025-12-14', '["wycena","koncepcja","produkcja","logistyka"]', 'Duże stoisko targowe z elementami interaktywnymi'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Biuro TechCorp - Warszawa', 'active', '2025-11-30', '["wycena","koncepcja","produkcja","materialy"]', 'Nowoczesne biuro open space z strefami relaksu'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Showroom Furniture Design', 'new', '2025-10-15', '["wycena","koncepcja"]', 'Elegancki showroom mebli designerskich'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Wesele Premium - Hotel Bristol', 'active', '2025-09-20', '["wycena","koncepcja","produkcja","logistyka","zakwaterowanie"]', 'Luksusowe wesele dla 200 osób'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Wystawa Modern Art 2025', 'new', '2025-08-01', '["wycena","koncepcja","projektowanie"]', 'Wystawa sztuki współczesnej z interaktywnymi instalacjami');

-- MATERIAŁY
INSERT INTO materials (id, name, category, unit, price_per_unit, supplier, stock_quantity, min_stock_level) VALUES
('mat-001', 'Płyta MDF 18mm', 'Płyty', 'm2', 45.50, 'Kronopol', 150, 20),
('mat-002', 'Płyta OSB 12mm', 'Płyty', 'm2', 32.00, 'Kronospan', 80, 15),
('mat-003', 'Sklejka brzozowa 15mm', 'Płyty', 'm2', 85.00, 'Sklejka-Pisz', 60, 10),
('mat-004', 'Profil aluminiowy 40x40', 'Profile', 'mb', 12.50, 'Aluprofil', 200, 30),
('mat-005', 'Szkło bezpieczne 6mm', 'Szkło', 'm2', 120.00, 'Guardian Glass', 25, 5),
('mat-006', 'LED strip RGB 5m', 'Oświetlenie', 'szt', 95.00, 'Philips', 40, 8),
('mat-007', 'Wkręty 4x50mm', 'Śruby', 'opak', 15.50, 'Fischer', 100, 20),
('mat-008', 'Klej do drewna D3', 'Kleje', 'l', 28.00, 'Titebond', 45, 10),
('mat-009', 'Farba akrylowa biała', 'Farby', 'l', 35.00, 'Tikkurila', 30, 6),
('mat-010', 'Tkanina blackout 300cm', 'Tekstylia', 'mb', 75.00, 'Dekoria', 120, 15);

-- PŁYTKI/ELEMENTY (TILES)
INSERT INTO tiles (id, project_id, name, status, material_type, dimensions, quantity, notes) VALUES
-- Projekt ACME Stoisko
('tile-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Panel główny stoiska', 'designing', 'MDF', '200x300x18', 2, 'Panel z wycięciami pod ekrany'),
('tile-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Blat recepcyjny', 'approved', 'Sklejka+szkło', '120x80x15', 1, 'Blat z podświetleniem LED'),
('tile-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Regały ekspozycyjne', 'cnc_queue', 'MDF', '180x40x18', 4, 'Regały modułowe z podświetleniem'),

-- Projekt TechCorp
('tile-004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ścianka działowa', 'designing', 'MDF+szkło', '250x200x18', 8, 'Ścianki z oknami szklanymi'),
('tile-005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Biurka workspace', 'pending_approval', 'Sklejka', '160x80x15', 25, 'Biurka z regulacją wysokości'),
('tile-006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Szafki pod dokumenty', 'approved', 'MDF', '40x40x18', 15, 'Szafki z zamkami'),

-- Projekt Showroom
('tile-007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Podium centralny', 'designing', 'MDF+LED', '300x300x18', 1, 'Podium z podświetleniem RGB'),
('tile-008', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Gabloty wystawowe', 'designing', 'Szkło+alu', '100x50x6', 12, 'Gabloty z oświetleniem punktowym'),

-- Projekt Wesele
('tile-009', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Arka ślubna', 'cnc_production', 'Sklejka+tkanina', '400x250x15', 1, 'Arka z kwiatami i tkaniną'),
('tile-010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Stoliki koktajlowe', 'ready_assembly', 'MDF', '60x110x18', 20, 'Stoliki z podstawą aluminiową'),

-- Projekt Galeria
('tile-011', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Panele wystawowe', 'designing', 'MDF+farba', '200x250x18', 15, 'Panele mobilne na kółkach'),
('tile-012', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Stacja interaktywna', 'designing', 'MDF+szkło+LED', '150x80x18', 3, 'Stacje z ekranami dotykowymi');

-- MATERIAŁY DO PŁYTEK (BOM)
INSERT INTO tile_materials (tile_id, material_id, quantity_needed, quantity_allocated) VALUES
-- Panel główny stoiska (tile-001)
('tile-001', 'mat-001', 1.5, 1.5), -- MDF 18mm
('tile-001', 'mat-006', 2, 2),     -- LED strip
('tile-001', 'mat-007', 2, 2),     -- Wkręty
('tile-001', 'mat-008', 0.5, 0.5), -- Klej

-- Blat recepcyjny (tile-002)
('tile-002', 'mat-003', 1.0, 1.0), -- Sklejka
('tile-002', 'mat-005', 1.0, 1.0), -- Szkło
('tile-002', 'mat-006', 1, 1),     -- LED strip
('tile-002', 'mat-004', 4, 4),     -- Profil alu

-- Regały (tile-003)
('tile-003', 'mat-001', 3.0, 3.0), -- MDF
('tile-003', 'mat-006', 4, 4),     -- LED strip
('tile-003', 'mat-007', 8, 8),     -- Wkręty

-- Ścianka działowa (tile-004)
('tile-004', 'mat-001', 4.0, 4.0), -- MDF
('tile-004', 'mat-005', 2.0, 2.0), -- Szkło
('tile-004', 'mat-004', 20, 20),   -- Profile alu

-- Biurka (tile-005)
('tile-005', 'mat-003', 32.0, 25.0), -- Sklejka (brakuje 7m2!)
('tile-005', 'mat-004', 100, 80),    -- Profile alu (brakuje 20mb!)
('tile-005', 'mat-007', 50, 50),     -- Wkręty

-- Arka ślubna (tile-009)
('tile-009', 'mat-003', 2.5, 2.5),  -- Sklejka
('tile-009', 'mat-010', 8, 8),      -- Tkanina
('tile-009', 'mat-006', 3, 3),      -- LED strip

-- Stoliki koktajlowe (tile-010)
('tile-010', 'mat-001', 7.5, 7.5),  -- MDF
('tile-010', 'mat-004', 80, 80);    -- Profile alu

-- ZADANIA HARMONOGRAMOWE
INSERT INTO schedule_tasks (id, project_id, task_name, task_type, start_date, end_date, status, assigned_to, dependencies) VALUES
-- Projekt ACME
('task-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Przygotowanie wyceny', 'estimate', '2025-09-10', '2025-09-15', 'completed', 'Anna Kowalska', '[]'),
('task-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Projekt koncepcyjny', 'concept', '2025-09-16', '2025-09-25', 'completed', 'Piotr Nowak', '["task-001"]'),
('task-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Produkcja elementów', 'production', '2025-09-26', '2025-11-30', 'in_progress', 'Jan Wiśniewski', '["task-002"]'),
('task-004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transport i montaż', 'logistics', '2025-12-01', '2025-12-14', 'pending', 'Maria Zielińska', '["task-003"]'),

-- Projekt TechCorp
('task-005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Analiza wymagań', 'estimate', '2025-09-01', '2025-09-10', 'completed', 'Anna Kowalska', '[]'),
('task-006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Projekt aranżacji', 'concept', '2025-09-11', '2025-09-30', 'in_progress', 'Katarzyna Nowak', '["task-005"]'),
('task-007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Zamówienie materiałów', 'materials', '2025-10-01', '2025-10-10', 'pending', 'Tomasz Kowal', '["task-006"]'),

-- Projekt Wesele
('task-008', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Konsultacja z parą młodą', 'concept', '2025-08-15', '2025-08-20', 'completed', 'Magdalena Król', '[]'),
('task-009', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Projekt dekoracji', 'concept', '2025-08-21', '2025-09-05', 'in_progress', 'Magdalena Król', '["task-008"]'),
('task-010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rezerwacja zakwaterowania', 'accommodation', '2025-09-06', '2025-09-10', 'pending', 'Robert Maj', '["task-009"]');

-- ZADANIA PROJEKTOWANIA
INSERT INTO design_tasks (id, project_id, tile_id, task_name, designer, status, priority, estimated_hours, actual_hours) VALUES
('design-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-001', 'Projekt panelu głównego', 'Piotr Nowak', 'completed', 'high', 16, 18),
('design-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-002', 'Projekt blatu recepcyjnego', 'Piotr Nowak', 'completed', 'medium', 8, 6),
('design-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-003', 'Projekt regałów', 'Anna Projektant', 'in_progress', 'medium', 12, 8),
('design-004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tile-004', 'Projekt ścianek działowych', 'Katarzyna Nowak', 'in_progress', 'high', 20, 15),
('design-005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'tile-007', 'Projekt podium centralnego', 'Piotr Nowak', 'pending', 'high', 24, 0),
('design-006', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'tile-011', 'Projekt paneli wystawowych', 'Anna Projektant', 'pending', 'medium', 16, 0);

-- ZADANIA CNC
INSERT INTO cnc_tasks (id, project_id, tile_id, task_name, machine_type, operator, status, priority, estimated_time_hours, actual_time_hours, material_waste_percent) VALUES
('cnc-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-002', 'Cięcie blatu recepcyjnego', 'CNC Router', 'Marek CNC', 'completed', 'medium', 3, 3.5, 5),
('cnc-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-003', 'Cięcie elementów regałów', 'CNC Router', 'Paweł Operator', 'in_progress', 'medium', 8, 6, 8),
('cnc-003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tile-009', 'Cięcie arki ślubnej', 'CNC Router', 'Marek CNC', 'in_progress', 'high', 6, 4, 3),
('cnc-004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tile-010', 'Cięcie stolików koktajlowych', 'CNC Laser', 'Anna CNC', 'completed', 'medium', 12, 11, 7),
('cnc-005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tile-006', 'Cięcie szafek', 'CNC Router', 'Paweł Operator', 'pending', 'low', 10, 0, 0);

-- ZADANIA PRODUKCJI
INSERT INTO production_tasks (id, project_id, tile_id, task_name, worker, status, priority, estimated_hours, actual_hours, quality_check_status) VALUES
('prod-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-002', 'Montaż blatu z podświetleniem', 'Jan Montażysta', 'completed', 'medium', 4, 4.5, 'passed'),
('prod-002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tile-010', 'Montaż stolików koktajlowych', 'Tomasz Stolarz', 'completed', 'medium', 16, 18, 'passed'),
('prod-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tile-003', 'Montaż regałów z LED', 'Jan Montażysta', 'in_progress', 'medium', 12, 8, 'pending'),
('prod-004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tile-009', 'Montaż arki ślubnej', 'Maria Dekorator', 'pending', 'high', 8, 0, 'pending'),
('prod-005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tile-005', 'Montaż biurek workspace', 'Zespół montażowy', 'pending', 'high', 40, 0, 'pending');

-- TRASY LOGISTYCZNE
INSERT INTO logistics_routes (id, project_id, route_name, origin, destination, transport_type, driver, status, scheduled_date, estimated_duration_hours, distance_km, cost) VALUES
('route-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transport stoiska na targi', 'Fabryka Warszawa', 'MTP Poznań', 'truck', 'Andrzej Kierowca', 'scheduled', '2025-12-13', 6, 350, 1200.00),
('route-002', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Transport dekoracji weselnych', 'Fabryka Warszawa', 'Hotel Bristol Warszawa', 'van', 'Piotr Transport', 'scheduled', '2025-09-19', 2, 25, 300.00),
('route-003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dostawa materiałów do biura', 'Fabryka Warszawa', 'Biurowiec TechCorp', 'truck', 'Marek Logistyk', 'pending', '2025-11-29', 4, 180, 800.00),
('route-004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Transport do showroom', 'Fabryka Warszawa', 'Showroom Kraków', 'van', 'Anna Transport', 'pending', '2025-10-14', 5, 290, 650.00);

-- LISTY PAKOWANIA
INSERT INTO packing_lists (id, project_id, logistics_route_id, item_name, quantity, packed_quantity, weight_kg, dimensions, fragile, special_instructions) VALUES
-- Stoisko ACME
('pack-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'route-001', 'Panel główny stoiska', 2, 2, 45.5, '200x300x18cm', false, 'Owinąć folią ochronną'),
('pack-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'route-001', 'Blat recepcyjny z LED', 1, 1, 28.3, '120x80x15cm', true, 'Fragile - szkło! Transportować pionowo'),
('pack-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'route-001', 'Elementy regałów', 20, 16, 156.8, 'Różne', false, 'Ponumerować elementy'),
('pack-004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'route-001', 'Zasilacze LED', 8, 8, 4.2, '20x15x5cm', true, 'Elektronika - chronić przed wilgocią'),

-- Wesele
('pack-005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'route-002', 'Arka ślubna', 1, 1, 85.0, '400x250x15cm', true, 'Delikatnie! Nie przewracać'),
('pack-006', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'route-002', 'Stoliki koktajlowe', 20, 20, 340.0, '60x110x18cm', false, 'Można układać po 5 sztuk'),
('pack-007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'route-002', 'Tkaniny dekoracyjne', 8, 8, 12.5, '300x200cm', false, 'Pakować w tubę'),

-- Biuro TechCorp
('pack-008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'route-003', 'Elementy ścianek działowych', 32, 0, 280.0, 'Różne', true, 'Szkło - bardzo ostrożnie!'),
('pack-009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'route-003', 'Blaty biurek', 25, 0, 425.0, '160x80x15cm', false, 'Chronić powierzchnię'),
('pack-010', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'route-003', 'Szafki dokumentów', 15, 0, 180.0, '40x40x18cm', false, 'Sprawdzić mechanizmy zamków');

-- Podsumowanie: Teraz mamy:
-- 5 klientów
-- 5 projektów w różnych fazach
-- 10 kategorii materiałów w magazynie (niektóre na wyczerpaniu)
-- 12 płytek/elementów w różnych statusach produkcji
-- Powiązania BOM pokazujące braki materiałów
-- Zadania harmonogramowe z zależnościami
-- Zadania projektowania, CNC i produkcji
-- Trasy logistyczne z kosztami
-- Listy pakowania z instrukcjami specjalnymi



