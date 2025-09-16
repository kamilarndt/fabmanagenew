-- Kompletne dane testowe dla FabManage
-- Wypełnia wszystkie tabele z powiązanymi danymi

-- 1. Klienci (rozszerzenie istniejących)
INSERT INTO clients (id, name, email, phone, company_type, address, created_at) VALUES
('client-001', 'ACME Sp. z o.o.', 'contact@acme.pl', '+48 111 111 111', 'corporation', 'ul. Przykładowa 1, 00-001 Warszawa', NOW()),
('client-002', 'Test Client', 'test@example.com', '+48 123 456 789', 'individual', 'ul. Testowa 2, 00-002 Kraków', NOW()),
('client-003', 'Firma Budowlana XYZ', 'biuro@xyz-budowa.pl', '+48 222 333 444', 'corporation', 'ul. Budowlana 10, 30-001 Kraków', NOW()),
('client-004', 'Design Studio ABC', 'hello@design-abc.com', '+48 555 666 777', 'studio', 'ul. Kreatywna 5, 50-001 Wrocław', NOW()),
('client-005', 'Event Agency Pro', 'events@pro-agency.pl', '+48 888 999 000', 'agency', 'ul. Eventowa 15, 80-001 Gdańsk', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  company_type = EXCLUDED.company_type,
  address = EXCLUDED.address;

-- 2. Projekty (rozszerzenie istniejących)
INSERT INTO projects (id, client_id, name, description, status, deadline, budget, progress, created_at, updated_at) VALUES
-- Projekty dla ACME
('proj-001', 'client-001', 'Stoisko Targi 2025', 'Kompleksowe stoisko targowe z systemem oświetlenia LED', 'active', '2025-12-15', 150000.00, 25, NOW(), NOW()),
('proj-002', 'client-001', 'Sala Konferencyjna Premium', 'Nowoczesna sala konferencyjna z meblami na zamówienie', 'active', '2025-11-30', 85000.00, 60, NOW(), NOW()),
('proj-003', 'client-001', 'Recepcyjna Lobby', 'Elegancka recepcja z systemem przechowywania', 'completed', '2025-08-15', 45000.00, 100, NOW(), NOW()),

-- Projekty dla Test Client
('proj-004', 'client-002', 'Test Project', 'Projekt testowy do weryfikacji systemu', 'active', '2025-12-31', 25000.00, 10, NOW(), NOW()),
('proj-005', 'client-002', 'Biuro Open Space', 'Przestrzeń biurowa z meblami modułowymi', 'planning', '2026-02-28', 120000.00, 0, NOW(), NOW()),

-- Projekty dla Firma Budowlana XYZ
('proj-006', 'client-003', 'Pawilon Wystawowy', 'Tymczasowy pawilon na targi budowlane', 'active', '2025-10-20', 75000.00, 40, NOW(), NOW()),
('proj-007', 'client-003', 'Centrum Szkoleniowe', 'Kompleksowe wyposażenie sali szkoleniowej', 'active', '2025-11-10', 95000.00, 30, NOW(), NOW()),

-- Projekty dla Design Studio ABC
('proj-008', 'client-004', 'Showroom Designu', 'Ekspozycja mebli i akcesoriów designerskich', 'active', '2025-12-05', 180000.00, 70, NOW(), NOW()),
('proj-009', 'client-004', 'Studio Fotograficzne', 'Profesjonalne studio z tłem i oświetleniem', 'planning', '2026-01-15', 65000.00, 0, NOW(), NOW()),

-- Projekty dla Event Agency Pro
('proj-010', 'client-005', 'Wesele Premium', 'Kompleksowa aranżacja sali weselnej', 'completed', '2025-09-01', 55000.00, 100, NOW(), NOW()),
('proj-011', 'client-005', 'Event Corporate', 'Aranżacja na konferencję firmową', 'active', '2025-10-15', 35000.00, 50, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  deadline = EXCLUDED.deadline,
  budget = EXCLUDED.budget,
  progress = EXCLUDED.progress,
  updated_at = NOW();

-- 3. Materiały (rozszerzenie istniejących)
INSERT INTO materials (id, code, name, unit, unit_cost, stock, location, category, supplier, created_at) VALUES
-- Płyty MDF
('mat-001', 'MDF-18-STD', 'Płyta MDF 18mm Standard', 'm2', 45.50, 25, 'A1-01', 'sheet_material', 'DrewnoPol Sp. z o.o.', NOW()),
('mat-002', 'MDF-12-STD', 'Płyta MDF 12mm Standard', 'm2', 38.20, 15, 'A1-02', 'sheet_material', 'DrewnoPol Sp. z o.o.', NOW()),
('mat-003', 'MDF-25-STD', 'Płyta MDF 25mm Standard', 'm2', 62.80, 8, 'A1-03', 'sheet_material', 'DrewnoPol Sp. z o.o.', NOW()),

-- Sklejka
('mat-004', 'SKL-15-BRZ', 'Sklejka brzoza 15mm', 'm2', 85.00, 12, 'A2-01', 'sheet_material', 'SklejkaMax Sp. z o.o.', NOW()),
('mat-005', 'SKL-21-WOD', 'Sklejka wodoodporna 21mm', 'm2', 125.00, 6, 'A2-02', 'sheet_material', 'SklejkaMax Sp. z o.o.', NOW()),

-- Plexi
('mat-006', 'PLEX-3-BEZ', 'Plexi bezbarwne 3mm', 'm2', 180.00, 20, 'B1-01', 'sheet_material', 'AkrylPol Sp. z o.o.', NOW()),
('mat-007', 'PLEX-5-BIA', 'Plexi białe 5mm', 'm2', 220.00, 15, 'B1-02', 'sheet_material', 'AkrylPol Sp. z o.o.', NOW()),

-- Profile aluminiowe
('mat-008', 'ALU-KAT-30', 'Kątownik ALU 30x30x3', 'mb', 28.50, 120, 'C1-01', 'metal_profiles', 'AluPro Sp. z o.o.', NOW()),
('mat-009', 'ALU-PRO-U', 'Profil U ALU 40x20x2', 'mb', 35.20, 80, 'C1-02', 'metal_profiles', 'AluPro Sp. z o.o.', NOW()),

-- Hardware
('mat-010', 'SRUBA-M6-20', 'Śruba DIN 912 M6x20', 'szt', 0.45, 2500, 'D1-01', 'hardware', 'HardwareMax Sp. z o.o.', NOW()),
('mat-011', 'SRUBA-M8-30', 'Śruba DIN 912 M8x30', 'szt', 0.85, 1800, 'D1-02', 'hardware', 'HardwareMax Sp. z o.o.', NOW()),
('mat-012', 'ZAW-STD', 'Zawias standardowy', 'szt', 15.00, 200, 'D2-01', 'hardware', 'HardwareMax Sp. z o.o.', NOW()),

-- LED
('mat-013', 'LED-2835-3000K', 'Taśma LED 2835 3000K', 'mb', 25.00, 100, 'E1-01', 'lighting', 'LEDPro Sp. z o.o.', NOW()),
('mat-014', 'LED-ZAS-24V-100W', 'Zasilacz LED 24V 100W', 'szt', 120.00, 15, 'E2-01', 'lighting', 'LEDPro Sp. z o.o.', NOW()),

-- Tkaniny
('mat-015', 'TEX-WEL-BEZ', 'Welur beżowy', 'm2', 45.00, 50, 'F1-01', 'textiles', 'TkaninaPro Sp. z o.o.', NOW()),
('mat-016', 'TEX-SKO-SZAR', 'Skóra eko szara', 'm2', 85.00, 25, 'F1-02', 'textiles', 'TkaninaPro Sp. z o.o.', NOW())
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  unit_cost = EXCLUDED.unit_cost,
  stock = EXCLUDED.stock,
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  supplier = EXCLUDED.supplier;

-- 4. Tiles/Elementy projektów
INSERT INTO tiles (id, project_id, name, description, status, material_id, quantity, unit, created_at, updated_at) VALUES
-- Elementy dla Stoisko Targi 2025 (proj-001)
('tile-001', 'proj-001', 'Stół główny', 'Stół recepcyjny z szufladami', 'designing', 'mat-001', 2, 'szt', NOW(), NOW()),
('tile-002', 'proj-001', 'Regał ekspozycyjny', 'Regał na materiały promocyjne', 'designing', 'mat-002', 3, 'szt', NOW(), NOW()),
('tile-003', 'proj-001', 'Podświetlenie LED', 'System oświetlenia pod regałami', 'pending_approval', 'mat-013', 15, 'mb', NOW(), NOW()),
('tile-004', 'proj-001', 'Szyld firmowy', 'Szyld z plexi z podświetleniem', 'approved', 'mat-006', 1, 'szt', NOW(), NOW()),

-- Elementy dla Sala Konferencyjna Premium (proj-002)
('tile-005', 'proj-002', 'Stół konferencyjny', 'Duży stół na 12 osób', 'cnc_queue', 'mat-003', 1, 'szt', NOW(), NOW()),
('tile-006', 'proj-002', 'Krzesła konferencyjne', 'Krzesła z tapicerką', 'cnc_production', 'mat-015', 12, 'szt', NOW(), NOW()),
('tile-007', 'proj-002', 'Tablica flipchart', 'Tablica na kółkach', 'ready_assembly', 'mat-001', 2, 'szt', NOW(), NOW()),

-- Elementy dla Biuro Open Space (proj-005)
('tile-008', 'proj-005', 'Biurko modułowe', 'Biurko z szufladami', 'designing', 'mat-002', 8, 'szt', NOW(), NOW()),
('tile-009', 'proj-005', 'Szafka na dokumenty', 'Szafka 4-drzwiowa', 'designing', 'mat-001', 4, 'szt', NOW(), NOW()),
('tile-010', 'proj-005', 'Oświetlenie biurowe', 'Lampy LED nad biurkami', 'designing', 'mat-013', 25, 'mb', NOW(), NOW()),

-- Elementy dla Pawilon Wystawowy (proj-006)
('tile-011', 'proj-006', 'Stelaż konstrukcyjny', 'Konstrukcja z profili aluminiowych', 'cnc_production', 'mat-008', 50, 'mb', NOW(), NOW()),
('tile-012', 'proj-006', 'Panele ścienne', 'Panele z MDF na konstrukcję', 'cnc_queue', 'mat-001', 20, 'm2', NOW(), NOW()),
('tile-013', 'proj-006', 'Podłoga tymczasowa', 'Panele podłogowe', 'pending_approval', 'mat-002', 30, 'm2', NOW(), NOW()),

-- Elementy dla Showroom Designu (proj-008)
('tile-014', 'proj-008', 'Ekspozytor mebli', 'Regał na ekspozycję mebli', 'ready_assembly', 'mat-004', 5, 'szt', NOW(), NOW()),
('tile-015', 'proj-008', 'Oświetlenie ekspozycyjne', 'System oświetlenia LED', 'ready_assembly', 'mat-013', 40, 'mb', NOW(), NOW()),
('tile-016', 'proj-008', 'Sofa ekspozycyjna', 'Sofa z tapicerką designerską', 'ready_assembly', 'mat-016', 2, 'szt', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  material_id = EXCLUDED.material_id,
  quantity = EXCLUDED.quantity,
  unit = EXCLUDED.unit,
  updated_at = NOW();

-- 5. Zamówienia materiałów
INSERT INTO material_orders (id, project_id, material_id, quantity, unit, status, supplier, order_date, delivery_date, cost) VALUES
('order-001', 'proj-001', 'mat-001', 10, 'm2', 'ordered', 'DrewnoPol Sp. z o.o.', '2025-09-10', '2025-09-20', 455.00),
('order-002', 'proj-001', 'mat-013', 20, 'mb', 'delivered', 'LEDPro Sp. z o.o.', '2025-09-05', '2025-09-12', 500.00),
('order-003', 'proj-002', 'mat-003', 5, 'm2', 'pending', 'DrewnoPol Sp. z o.o.', NULL, '2025-09-25', 314.00),
('order-004', 'proj-006', 'mat-008', 30, 'mb', 'ordered', 'AluPro Sp. z o.o.', '2025-09-08', '2025-09-18', 855.00),
('order-005', 'proj-008', 'mat-015', 15, 'm2', 'delivered', 'TkaninaPro Sp. z o.o.', '2025-09-01', '2025-09-08', 675.00)
ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  material_id = EXCLUDED.material_id,
  quantity = EXCLUDED.quantity,
  unit = EXCLUDED.unit,
  status = EXCLUDED.status,
  supplier = EXCLUDED.supplier,
  order_date = EXCLUDED.order_date,
  delivery_date = EXCLUDED.delivery_date,
  cost = EXCLUDED.cost;

-- 6. Aktualizacja statystyk
UPDATE projects SET 
  progress = CASE 
    WHEN id = 'proj-001' THEN 25
    WHEN id = 'proj-002' THEN 60
    WHEN id = 'proj-003' THEN 100
    WHEN id = 'proj-004' THEN 10
    WHEN id = 'proj-005' THEN 0
    WHEN id = 'proj-006' THEN 40
    WHEN id = 'proj-007' THEN 30
    WHEN id = 'proj-008' THEN 70
    WHEN id = 'proj-009' THEN 0
    WHEN id = 'proj-010' THEN 100
    WHEN id = 'proj-011' THEN 50
  END,
  updated_at = NOW();

-- 7. Aktualizacja stanów magazynowych
UPDATE materials SET 
  stock = CASE 
    WHEN id = 'mat-001' THEN 15  -- Zużyto 10 m2
    WHEN id = 'mat-013' THEN 80  -- Zużyto 20 mb
    WHEN id = 'mat-015' THEN 35  -- Zużyto 15 m2
    ELSE stock
  END,
  updated_at = NOW()
WHERE id IN ('mat-001', 'mat-013', 'mat-015');

-- 8. Sprawdzenie wyników
SELECT 'CLIENTS' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'PROJECTS', COUNT(*) FROM projects
UNION ALL
SELECT 'MATERIALS', COUNT(*) FROM materials
UNION ALL
SELECT 'TILES', COUNT(*) FROM tiles
UNION ALL
SELECT 'MATERIAL_ORDERS', COUNT(*) FROM material_orders;
