-- Dodanie więcej tiles/elementów do projektów
-- Każdy projekt powinien mieć elementy w różnych etapach

INSERT INTO tiles (id, project_id, name, status, priority, created_at) VALUES
-- Biuro Open Space - elementy biurowe
('tile-biu-001', '44444444-4444-4444-4444-444444444444', 'Biurko kierownicze', 'designing', 1, NOW()),
('tile-biu-002', '44444444-4444-4444-4444-444444444444', 'Krzesło ergonomiczne', 'designing', 2, NOW()),
('tile-biu-003', '44444444-4444-4444-4444-444444444444', 'Szafka na dokumenty', 'pending_approval', 3, NOW()),
('tile-biu-004', '44444444-4444-4444-4444-444444444444', 'Lampa biurowa LED', 'approved', 4, NOW()),

-- Centrum Szkoleniowe - elementy szkoleniowe
('tile-szk-001', '66666666-6666-6666-6666-666666666666', 'Stół szkoleniowy 8-osobowy', 'cnc_queue', 1, NOW()),
('tile-szk-002', '66666666-6666-6666-6666-666666666666', 'Krzesła szkoleniowe', 'cnc_production', 2, NOW()),
('tile-szk-003', '66666666-6666-6666-6666-666666666666', 'Tablica flipchart', 'ready_assembly', 3, NOW()),
('tile-szk-004', '66666666-6666-6666-6666-666666666666', 'Projektor multimedialny', 'designing', 4, NOW()),

-- Event Corporate - elementy eventowe
('tile-eve-001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Stół prezydencki', 'cnc_production', 1, NOW()),
('tile-eve-002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Krzesła dla gości', 'ready_assembly', 2, NOW()),
('tile-eve-003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Szyld powitalny', 'designing', 3, NOW()),
('tile-eve-004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Stelaż na banery', 'pending_approval', 4, NOW()),

-- Pawilon Wystawowy - elementy wystawowe
('tile-paw-001', '55555555-5555-5555-5555-555555555555', 'Stelaż konstrukcyjny', 'cnc_production', 1, NOW()),
('tile-paw-002', '55555555-5555-5555-5555-555555555555', 'Panele ścienne', 'cnc_queue', 2, NOW()),
('tile-paw-003', '55555555-5555-5555-5555-555555555555', 'Podłoga tymczasowa', 'pending_approval', 3, NOW()),
('tile-paw-004', '55555555-5555-5555-5555-555555555555', 'Oświetlenie LED', 'designing', 4, NOW()),

-- Sala Konferencyjna Premium - elementy konferencyjne
('tile-kon-001', '11111111-1111-1111-1111-111111111111', 'Stół konferencyjny', 'cnc_queue', 1, NOW()),
('tile-kon-002', '11111111-1111-1111-1111-111111111111', 'Krzesła konferencyjne', 'cnc_production', 2, NOW()),
('tile-kon-003', '11111111-1111-1111-1111-111111111111', 'Tablica flipchart', 'ready_assembly', 3, NOW()),
('tile-kon-004', '11111111-1111-1111-1111-111111111111', 'System nagłośnienia', 'designing', 4, NOW()),

-- Showroom Designu - elementy designerskie
('tile-sho-001', '77777777-7777-7777-7777-777777777777', 'Ekspozytor mebli', 'ready_assembly', 1, NOW()),
('tile-sho-002', '77777777-7777-7777-7777-777777777777', 'Oświetlenie ekspozycyjne', 'ready_assembly', 2, NOW()),
('tile-sho-003', '77777777-7777-7777-7777-777777777777', 'Sofa ekspozycyjna', 'ready_assembly', 3, NOW()),
('tile-sho-004', '77777777-7777-7777-7777-777777777777', 'Stolik kawowy', 'designing', 4, NOW()),

-- Studio Fotograficzne - elementy fotograficzne
('tile-stu-001', '88888888-8888-8888-8888-888888888888', 'Tło fotograficzne', 'designing', 1, NOW()),
('tile-stu-002', '88888888-8888-8888-8888-888888888888', 'Stelaż na tło', 'pending_approval', 2, NOW()),
('tile-stu-003', '88888888-8888-8888-8888-888888888888', 'Oświetlenie studyjne', 'designing', 3, NOW()),
('tile-stu-004', '88888888-8888-8888-8888-888888888888', 'Stolik do makijażu', 'designing', 4, NOW()),

-- Test Project - elementy testowe
('tile-tes-001', '33333333-3333-3333-3333-333333333333', 'Element testowy A', 'designing', 1, NOW()),
('tile-tes-002', '33333333-3333-3333-3333-333333333333', 'Element testowy B', 'pending_approval', 2, NOW()),
('tile-tes-003', '33333333-3333-3333-3333-333333333333', 'Element testowy C', 'approved', 3, NOW()),

-- Wesele Premium - elementy weselne (completed)
('tile-wes-001', '99999999-9999-9999-9999-999999999999', 'Stół weselny', 'completed', 1, NOW()),
('tile-wes-002', '99999999-9999-9999-9999-999999999999', 'Krzesła weselne', 'completed', 2, NOW()),
('tile-wes-003', '99999999-9999-9999-9999-999999999999', 'Dekoracje kwiatowe', 'completed', 3, NOW())
ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority;

-- Sprawdzenie wyników
SELECT 
  p.name as project_name,
  COUNT(t.id) as tiles_count,
  COUNT(CASE WHEN t.status = 'designing' THEN 1 END) as designing,
  COUNT(CASE WHEN t.status = 'pending_approval' THEN 1 END) as pending_approval,
  COUNT(CASE WHEN t.status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN t.status = 'cnc_queue' THEN 1 END) as cnc_queue,
  COUNT(CASE WHEN t.status = 'cnc_production' THEN 1 END) as cnc_production,
  COUNT(CASE WHEN t.status = 'ready_assembly' THEN 1 END) as ready_assembly,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed
FROM projects p
LEFT JOIN tiles t ON p.id = t.project_id
GROUP BY p.id, p.name
ORDER BY tiles_count DESC;
