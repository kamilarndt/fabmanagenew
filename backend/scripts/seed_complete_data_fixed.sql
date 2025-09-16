-- Kompletne dane testowe dla FabManage - dostosowane do rzeczywistej struktury
-- Wypełnia wszystkie tabele z powiązanymi danymi

-- 1. Klienci (rozszerzenie istniejących)
INSERT INTO clients (id, name, email, phone, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'ACME Sp. z o.o.', 'contact@acme.pl', '+48 111 111 111', NOW()),
('22222222-2222-2222-2222-222222222222', 'Test Client', 'test@example.com', '+48 123 456 789', NOW()),
('33333333-3333-3333-3333-333333333333', 'Firma Budowlana XYZ', 'biuro@xyz-budowa.pl', '+48 222 333 444', NOW()),
('44444444-4444-4444-4444-444444444444', 'Design Studio ABC', 'hello@design-abc.com', '+48 555 666 777', NOW()),
('55555555-5555-5555-5555-555555555555', 'Event Agency Pro', 'events@pro-agency.pl', '+48 888 999 000', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone;

-- 2. Projekty (rozszerzenie istniejących)
INSERT INTO projects (id, client_id, name, status, deadline, created_at) VALUES
-- Projekty dla ACME
('87654321-8765-4321-8765-876543218765', '11111111-1111-1111-1111-111111111111', 'Stoisko Targi 2025', 'active', '2025-12-15', NOW()),
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Sala Konferencyjna Premium', 'active', '2025-11-30', NOW()),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Recepcyjna Lobby', 'completed', '2025-08-15', NOW()),

-- Projekty dla Test Client
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Test Project', 'active', '2025-12-31', NOW()),
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Biuro Open Space', 'planning', '2026-02-28', NOW()),

-- Projekty dla Firma Budowlana XYZ
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Pawilon Wystawowy', 'active', '2025-10-20', NOW()),
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Centrum Szkoleniowe', 'active', '2025-11-10', NOW()),

-- Projekty dla Design Studio ABC
('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Showroom Designu', 'active', '2025-12-05', NOW()),
('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Studio Fotograficzne', 'planning', '2026-01-15', NOW()),

-- Projekty dla Event Agency Pro
('99999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'Wesele Premium', 'completed', '2025-09-01', NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Event Corporate', 'active', '2025-10-15', NOW())
ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  deadline = EXCLUDED.deadline;

-- 3. Materiały (rozszerzenie istniejących)
INSERT INTO materials (id, code, name, unit, unit_cost, stock, location) VALUES
-- Płyty MDF
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MDF-18-STD', 'Płyta MDF 18mm Standard', 'm2', 45.50, 25, 'A1-01'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MDF-12-STD', 'Płyta MDF 12mm Standard', 'm2', 38.20, 15, 'A1-02'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MDF-25-STD', 'Płyta MDF 25mm Standard', 'm2', 62.80, 8, 'A1-03'),

-- Sklejka
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'SKL-15-BRZ', 'Sklejka brzoza 15mm', 'm2', 85.00, 12, 'A2-01'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'SKL-21-WOD', 'Sklejka wodoodporna 21mm', 'm2', 125.00, 6, 'A2-02'),

-- Plexi
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'PLEX-3-BEZ', 'Plexi bezbarwne 3mm', 'm2', 180.00, 20, 'B1-01'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'PLEX-5-BIA', 'Plexi białe 5mm', 'm2', 220.00, 15, 'B1-02'),

-- Profile aluminiowe
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'ALU-KAT-30', 'Kątownik ALU 30x30x3', 'mb', 28.50, 120, 'C1-01'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'ALU-PRO-U', 'Profil U ALU 40x20x2', 'mb', 35.20, 80, 'C1-02'),

-- Hardware
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'SRUBA-M6-20', 'Śruba DIN 912 M6x20', 'szt', 0.45, 2500, 'D1-01'),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'SRUBA-M8-30', 'Śruba DIN 912 M8x30', 'szt', 0.85, 1800, 'D1-02'),
('llllllll-llll-llll-llll-llllllllllll', 'ZAW-STD', 'Zawias standardowy', 'szt', 15.00, 200, 'D2-01'),

-- LED
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'LED-2835-3000K', 'Taśma LED 2835 3000K', 'mb', 25.00, 100, 'E1-01'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'LED-ZAS-24V-100W', 'Zasilacz LED 24V 100W', 'szt', 120.00, 15, 'E2-01'),

-- Tkaniny
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'TEX-WEL-BEZ', 'Welur beżowy', 'm2', 45.00, 50, 'F1-01'),
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'TEX-SKO-SZAR', 'Skóra eko szara', 'm2', 85.00, 25, 'F1-02')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  unit_cost = EXCLUDED.unit_cost,
  stock = EXCLUDED.stock,
  location = EXCLUDED.location;

-- 4. Tiles/Elementy projektów
INSERT INTO tiles (id, project_id, name, status, priority, created_at) VALUES
-- Elementy dla Stoisko Targi 2025
('11111111-1111-1111-1111-111111111111', '87654321-8765-4321-8765-876543218765', 'Stół główny', 'designing', 1, NOW()),
('22222222-2222-2222-2222-222222222222', '87654321-8765-4321-8765-876543218765', 'Regał ekspozycyjny', 'designing', 2, NOW()),
('33333333-3333-3333-3333-333333333333', '87654321-8765-4321-8765-876543218765', 'Podświetlenie LED', 'pending_approval', 3, NOW()),
('44444444-4444-4444-4444-444444444444', '87654321-8765-4321-8765-876543218765', 'Szyld firmowy', 'approved', 1, NOW()),

-- Elementy dla Sala Konferencyjna Premium
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Stół konferencyjny', 'cnc_queue', 1, NOW()),
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Krzesła konferencyjne', 'cnc_production', 2, NOW()),
('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Tablica flipchart', 'ready_assembly', 3, NOW()),

-- Elementy dla Biuro Open Space
('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Biurko modułowe', 'designing', 1, NOW()),
('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Szafka na dokumenty', 'designing', 2, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Oświetlenie biurowe', 'designing', 3, NOW()),

-- Elementy dla Pawilon Wystawowy
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Stelaż konstrukcyjny', 'cnc_production', 1, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'Panele ścienne', 'cnc_queue', 2, NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Podłoga tymczasowa', 'pending_approval', 3, NOW()),

-- Elementy dla Showroom Designu
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', 'Ekspozytor mebli', 'ready_assembly', 1, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777', 'Oświetlenie ekspozycyjne', 'ready_assembly', 2, NOW()),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '77777777-7777-7777-7777-777777777777', 'Sofa ekspozycyjna', 'ready_assembly', 3, NOW())
ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority;

-- 5. Tile Materials (powiązania tiles z materiałami)
INSERT INTO tile_materials (tile_id, material_id, quantity, unit) VALUES
-- Stół główny
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'm2'),
('11111111-1111-1111-1111-111111111111', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 8, 'szt'),

-- Regał ekspozycyjny
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 'm2'),
('22222222-2222-2222-2222-222222222222', 'llllllll-llll-llll-llll-llllllllllll', 6, 'szt'),

-- Podświetlenie LED
('33333333-3333-3333-3333-333333333333', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 15, 'mb'),
('33333333-3333-3333-3333-333333333333', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 2, 'szt'),

-- Szyld firmowy
('44444444-4444-4444-4444-444444444444', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, 'm2'),

-- Stół konferencyjny
('55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 'm2'),
('55555555-5555-5555-5555-555555555555', 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 12, 'szt'),

-- Krzesła konferencyjne
('66666666-6666-6666-6666-666666666666', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 12, 'm2'),

-- Biurko modułowe
('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 8, 'm2'),
('88888888-8888-8888-8888-888888888888', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 16, 'szt'),

-- Szafka na dokumenty
('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'm2'),
('99999999-9999-9999-9999-999999999999', 'llllllll-llll-llll-llll-llllllllllll', 8, 'szt'),

-- Oświetlenie biurowe
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 25, 'mb'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 5, 'szt'),

-- Stelaż konstrukcyjny
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 50, 'mb'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 20, 'szt'),

-- Panele ścienne
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 20, 'm2'),

-- Podłoga tymczasowa
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 30, 'm2'),

-- Ekspozytor mebli
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 5, 'm2'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'llllllll-llll-llll-llll-llllllllllll', 10, 'szt'),

-- Oświetlenie ekspozycyjne
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 40, 'mb'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 8, 'szt'),

-- Sofa ekspozycyjna
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'pppppppp-pppp-pppp-pppp-pppppppppppp', 2, 'm2')
ON CONFLICT (tile_id, material_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  unit = EXCLUDED.unit;

-- 6. Aktualizacja stanów magazynowych (symulacja zużycia)
UPDATE materials SET 
  stock = CASE 
    WHEN id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' THEN 15  -- Zużyto 10 m2
    WHEN id = 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm' THEN 80  -- Zużyto 20 mb
    WHEN id = 'oooooooo-oooo-oooo-oooo-oooooooooooo' THEN 35  -- Zużyto 15 m2
    ELSE stock
  END
WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'oooooooo-oooo-oooo-oooo-oooooooooooo');

-- 7. Sprawdzenie wyników
SELECT 'CLIENTS' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'PROJECTS', COUNT(*) FROM projects
UNION ALL
SELECT 'MATERIALS', COUNT(*) FROM materials
UNION ALL
SELECT 'TILES', COUNT(*) FROM tiles
UNION ALL
SELECT 'TILE_MATERIALS', COUNT(*) FROM tile_materials;
