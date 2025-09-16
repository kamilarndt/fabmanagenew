-- Dodanie więcej tiles/elementów do projektów z prawidłowymi UUID
INSERT INTO tiles (id, project_id, name, status, priority, created_at) VALUES
-- Biuro Open Space - elementy biurowe
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Biurko kierownicze', 'designing', 1, NOW()),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Krzesło ergonomiczne', 'designing', 2, NOW()),
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Szafka na dokumenty', 'pending_approval', 3, NOW()),
('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Lampa biurowa LED', 'approved', 4, NOW()),

-- Centrum Szkoleniowe - elementy szkoleniowe
('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'Stół szkoleniowy 8-osobowy', 'cnc_queue', 1, NOW()),
('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Krzesła szkoleniowe', 'cnc_production', 2, NOW()),
('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'Tablica flipchart', 'ready_assembly', 3, NOW()),
('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', 'Projektor multimedialny', 'designing', 4, NOW()),

-- Event Corporate - elementy eventowe
('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Stół prezydencki', 'cnc_production', 1, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Krzesła dla gości', 'ready_assembly', 2, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Szyld powitalny', 'designing', 3, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Stelaż na banery', 'pending_approval', 4, NOW()),

-- Pawilon Wystawowy - elementy wystawowe
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Stelaż konstrukcyjny', 'cnc_production', 1, NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'Panele ścienne', 'cnc_queue', 2, NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'Podłoga tymczasowa', 'pending_approval', 3, NOW()),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '55555555-5555-5555-5555-555555555555', 'Oświetlenie LED', 'designing', 4, NOW()),

-- Sala Konferencyjna Premium - elementy konferencyjne
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-111111111111', 'Stół konferencyjny', 'cnc_queue', 1, NOW()),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '11111111-1111-1111-1111-111111111111', 'Krzesła konferencyjne', 'cnc_production', 2, NOW()),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '11111111-1111-1111-1111-111111111111', 'Tablica flipchart', 'ready_assembly', 3, NOW()),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '11111111-1111-1111-1111-111111111111', 'System nagłośnienia', 'designing', 4, NOW()),

-- Showroom Designu - elementy designerskie
('llllllll-llll-llll-llll-llllllllllll', '77777777-7777-7777-7777-777777777777', 'Ekspozytor mebli', 'ready_assembly', 1, NOW()),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '77777777-7777-7777-7777-777777777777', 'Oświetlenie ekspozycyjne', 'ready_assembly', 2, NOW()),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '77777777-7777-7777-7777-777777777777', 'Sofa ekspozycyjna', 'ready_assembly', 3, NOW()),
('oooooooo-oooo-oooo-oooo-oooooooooooo', '77777777-7777-7777-7777-777777777777', 'Stolik kawowy', 'designing', 4, NOW()),

-- Studio Fotograficzne - elementy fotograficzne
('pppppppp-pppp-pppp-pppp-pppppppppppp', '88888888-8888-8888-8888-888888888888', 'Tło fotograficzne', 'designing', 1, NOW()),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '88888888-8888-8888-8888-888888888888', 'Stelaż na tło', 'pending_approval', 2, NOW()),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '88888888-8888-8888-8888-888888888888', 'Oświetlenie studyjne', 'designing', 3, NOW()),
('ssssssss-ssss-ssss-ssss-ssssssssssss', '88888888-8888-8888-8888-888888888888', 'Stolik do makijażu', 'designing', 4, NOW()),

-- Test Project - elementy testowe
('tttttttt-tttt-tttt-tttt-tttttttttttt', '33333333-3333-3333-3333-333333333333', 'Element testowy A', 'designing', 1, NOW()),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '33333333-3333-3333-3333-333333333333', 'Element testowy B', 'pending_approval', 2, NOW()),
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', '33333333-3333-3333-3333-333333333333', 'Element testowy C', 'approved', 3, NOW()),

-- Wesele Premium - elementy weselne (completed)
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '99999999-9999-9999-9999-999999999999', 'Stół weselny', 'completed', 1, NOW()),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '99999999-9999-9999-9999-999999999999', 'Krzesła weselne', 'completed', 2, NOW()),
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '99999999-9999-9999-9999-999999999999', 'Dekoracje kwiatowe', 'completed', 3, NOW())
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
