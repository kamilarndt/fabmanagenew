-- Dodanie powiązań tile_materials używając rzeczywistych ID
INSERT INTO tile_materials (tile_id, material_id, quantity) VALUES
-- Lada recepcyjna
('44444444-4444-4444-4444-444444444441', '2bda66ab-fee1-410d-af9c-ecb5b1c1f621', 2.5),
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 1.0),

-- Panel ścienny A
('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', 3.0),
('44444444-4444-4444-4444-444444444442', 'adfd2855-7955-4843-ab40-8ea8d68d146a', 2.0),

-- Test Tile
('11111111-2222-3333-4444-555555555555', 'b3d694d5-401d-4c6d-ad13-25579a27aa6f', 1.5)
ON CONFLICT (tile_id, material_id) DO UPDATE SET
  quantity = EXCLUDED.quantity;

-- Sprawdzenie wyników
SELECT 
  'RELATIONSHIPS' as info,
  COUNT(*) as tile_material_connections
FROM tile_materials;

-- Sprawdzenie projektów z tiles
SELECT 
  p.name as project_name,
  COUNT(t.id) as tiles_count
FROM projects p
LEFT JOIN tiles t ON p.id = t.project_id
GROUP BY p.id, p.name
ORDER BY tiles_count DESC;
