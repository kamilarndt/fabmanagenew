-- Dodanie powiązań tile_materials (bez kolumny unit)
INSERT INTO tile_materials (tile_id, material_id, quantity) VALUES
-- Stół główny
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2),
('11111111-1111-1111-1111-111111111111', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 8),

-- Regał ekspozycyjny
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3),
('22222222-2222-2222-2222-222222222222', 'llllllll-llll-llll-llll-llllllllllll', 6),

-- Podświetlenie LED
('33333333-3333-3333-3333-333333333333', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 15),
('33333333-3333-3333-3333-333333333333', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 2),

-- Szyld firmowy
('44444444-4444-4444-4444-444444444444', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1),

-- Stół konferencyjny
('55555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5),
('55555555-5555-5555-5555-555555555555', 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 12),

-- Krzesła konferencyjne
('66666666-6666-6666-6666-666666666666', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 12),

-- Biurko modułowe
('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 8),
('88888888-8888-8888-8888-888888888888', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 16),

-- Szafka na dokumenty
('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4),
('99999999-9999-9999-9999-999999999999', 'llllllll-llll-llll-llll-llllllllllll', 8),

-- Oświetlenie biurowe
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 25),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 5),

-- Stelaż konstrukcyjny
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 50),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 20),

-- Panele ścienne
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 20),

-- Podłoga tymczasowa
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 30),

-- Ekspozytor mebli
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 5),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'llllllll-llll-llll-llll-llllllllllll', 10),

-- Oświetlenie ekspozycyjne
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 40),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 8),

-- Sofa ekspozycyjna
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'pppppppp-pppp-pppp-pppp-pppppppppppp', 2)
ON CONFLICT (tile_id, material_id) DO UPDATE SET
  quantity = EXCLUDED.quantity;
