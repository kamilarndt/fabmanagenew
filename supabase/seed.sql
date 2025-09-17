-- Seed data for FabManage-Clean development
-- This file contains sample data for testing and development

-- Insert sample clients
INSERT INTO clients (name, email, phone, company_name, address, notes) VALUES
('Jan Kowalski', 'jan.kowalski@example.com', '+48 123 456 789', 'Kowalski Productions', 'ul. Przykładowa 123, 00-001 Warszawa', 'Główny klient - produkcje teatralne'),
('Anna Nowak', 'anna.nowak@teatr.pl', '+48 987 654 321', 'Teatr Narodowy', 'Plac Teatralny 1, 00-950 Warszawa', 'Klient instytucjonalny'),
('Piotr Wiśniewski', 'piotr@dekoracje.pl', '+48 555 123 456', 'Wiśniewski Dekoracje', 'ul. Rzemieślnicza 45, 31-001 Kraków', 'Specjalizacja w dekoracjach scenicznych');

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_info) VALUES
('Dostawca Główny', '{"phone": "+48 123 456 789", "email": "kontakt@dostawca.pl", "address": "ul. Magazynowa 1, 00-001 Warszawa"}'),
('Materiały Budowlane Sp. z o.o.', '{"phone": "+48 987 654 321", "email": "info@materiały.pl", "address": "ul. Przemysłowa 15, 31-001 Kraków"}'),
('Tekstylia Sceniczne', '{"phone": "+48 555 987 654", "email": "tekstylia@scena.pl", "address": "ul. Teatralna 8, 50-001 Wrocław"}'),
('Oświetlenie Pro', '{"phone": "+48 444 777 888", "email": "oswietlenie@pro.pl", "address": "ul. Elektryczna 22, 80-001 Gdańsk"}');

-- Insert sample materials
INSERT INTO materials (code, name, category, unit_price, inventory_level, supplier_id) VALUES
('MAT001', 'Płyta MDF 18mm', 'Materiały konstrukcyjne', 45.50, 150, (SELECT id FROM suppliers WHERE name = 'Dostawca Główny')),
('MAT002', 'Farba akrylowa biała', 'Materiały malarskie', 25.00, 50, (SELECT id FROM suppliers WHERE name = 'Materiały Budowlane Sp. z o.o.')),
('MAT003', 'Tkanina bawełniana czerwona', 'Tekstylia', 35.75, 200, (SELECT id FROM suppliers WHERE name = 'Tekstylia Sceniczne')),
('MAT004', 'Reflektor LED 100W', 'Oświetlenie', 450.00, 25, (SELECT id FROM suppliers WHERE name = 'Oświetlenie Pro')),
('MAT005', 'Śruby M6x20', 'Łączniki', 0.15, 1000, (SELECT id FROM suppliers WHERE name = 'Dostawca Główny')),
('MAT006', 'Klej do drewna', 'Kleje', 18.50, 30, (SELECT id FROM suppliers WHERE name = 'Materiały Budowlane Sp. z o.o.')),
('MAT007', 'Tkanina welurowa niebieska', 'Tekstylia', 42.00, 75, (SELECT id FROM suppliers WHERE name = 'Tekstylia Sceniczne')),
('MAT008', 'Kabel zasilający 3x1.5mm', 'Elektryka', 8.50, 500, (SELECT id FROM suppliers WHERE name = 'Oświetlenie Pro'));

-- Insert sample projects
INSERT INTO projects (name, client_id, status, budget, start_date, end_date, modules) VALUES
('Hamlet - Scenografia', (SELECT id FROM clients WHERE name = 'Jan Kowalski'), 'active', 50000.00, '2024-01-15', '2024-03-15', '{"general": true, "materials": true, "tiles": true, "pricing": true, "files": true}'),
('Romeo i Julia - Dekoracje', (SELECT id FROM clients WHERE name = 'Anna Nowak'), 'active', 75000.00, '2024-02-01', '2024-04-30', '{"general": true, "materials": true, "concept": true, "pricing": true}'),
('Makbet - Oświetlenie', (SELECT id FROM clients WHERE name = 'Piotr Wiśniewski'), 'on_hold', 30000.00, '2024-03-01', '2024-05-15', '{"general": true, "materials": true, "tiles": true}');

-- Insert sample BOM items for projects
INSERT INTO bom_items (project_id, material_id, quantity, unit_cost) VALUES
-- Hamlet project
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT001'), 50.000, 45.50),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT002'), 25.000, 25.00),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT003'), 15.000, 35.75),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT005'), 200.000, 0.15),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT006'), 10.000, 18.50),

-- Romeo i Julia project
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), (SELECT id FROM materials WHERE code = 'MAT001'), 75.000, 45.50),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), (SELECT id FROM materials WHERE code = 'MAT007'), 20.000, 42.00),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), (SELECT id FROM materials WHERE code = 'MAT004'), 12.000, 450.00),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), (SELECT id FROM materials WHERE code = 'MAT008'), 100.000, 8.50),

-- Makbet project
((SELECT id FROM projects WHERE name = 'Makbet - Oświetlenie'), (SELECT id FROM materials WHERE code = 'MAT004'), 8.000, 450.00),
((SELECT id FROM projects WHERE name = 'Makbet - Oświetlenie'), (SELECT id FROM materials WHERE code = 'MAT008'), 150.000, 8.50);

-- Insert sample project messages
INSERT INTO project_messages (project_id, author_id, body_html) VALUES
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), auth.uid(), '<p>Rozpoczynam pracę nad scenografią do Hamleta. Planuję zbudować zamkowy dziedziniec z elementami gotyckimi.</p>'),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), auth.uid(), '<p>Zamówiłem materiały od głównego dostawcy. Dostawa zaplanowana na przyszły tydzień.</p>'),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), auth.uid(), '<p>Koncept dekoracji gotowy - renesansowy ogród z fontanną centralną.</p>'),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), auth.uid(), '<p>Klient zaakceptował projekt. Przechodzę do fazy realizacji.</p>');

-- Insert sample project activity
INSERT INTO project_activity (project_id, type, payload_json, actor_id) VALUES
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), 'project_created', '{"project_name": "Hamlet - Scenografia", "budget": 50000}', auth.uid()),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), 'bom_updated', '{"items_added": 5, "total_cost": 3525.00}', auth.uid()),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), 'project_created', '{"project_name": "Romeo i Julia - Dekoracje", "budget": 75000}', auth.uid()),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), 'status_changed', '{"old_status": "active", "new_status": "active", "reason": "Client approval"}', auth.uid());

-- Insert sample material orders
INSERT INTO material_orders (project_id, material_id, quantity, status, order_date, delivery_date) VALUES
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT001'), 50.000, 'ordered', '2024-01-20', '2024-01-27'),
((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), (SELECT id FROM materials WHERE code = 'MAT002'), 25.000, 'delivered', '2024-01-18', '2024-01-25'),
((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), (SELECT id FROM materials WHERE code = 'MAT004'), 12.000, 'pending', NULL, NULL);

-- Insert sample inventory movements
INSERT INTO inventory_movements (material_id, type, quantity, reason) VALUES
((SELECT id FROM materials WHERE code = 'MAT002'), 'in', 50, 'Dostawa dla projektu Hamlet'),
((SELECT id FROM materials WHERE code = 'MAT001'), 'out', 25, 'Wydanie na projekt Hamlet'),
((SELECT id FROM materials WHERE code = 'MAT003'), 'adjustment', 10, 'Korekta stanu po inwentaryzacji');

-- Insert sample project permissions (assuming we have users in auth.users)
-- Note: These will need to be updated with actual user IDs from your auth system
-- INSERT INTO project_permissions (project_id, user_id, permission) VALUES
-- ((SELECT id FROM projects WHERE name = 'Hamlet - Scenografia'), auth.uid(), 'admin'),
-- ((SELECT id FROM projects WHERE name = 'Romeo i Julia - Dekoracje'), auth.uid(), 'admin'),
-- ((SELECT id FROM projects WHERE name = 'Makbet - Oświetlenie'), auth.uid(), 'admin');

-- Create some helpful views for development
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.budget,
    c.name as client_name,
    COALESCE(SUM(bi.total_cost), 0) as current_cost,
    COALESCE(SUM(bi.total_cost), 0) - COALESCE(p.budget, 0) as cost_variance,
    COUNT(DISTINCT pm.id) as message_count,
    COUNT(DISTINCT bi.id) as bom_item_count
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN bom_items bi ON p.id = bi.project_id
LEFT JOIN project_messages pm ON p.id = pm.project_id
GROUP BY p.id, p.name, p.status, p.budget, c.name;

CREATE OR REPLACE VIEW bom_with_details AS
SELECT 
    bi.id,
    bi.project_id,
    p.name as project_name,
    bi.quantity,
    bi.unit_cost,
    bi.total_cost,
    m.code,
    m.name as material_name,
    m.category,
    s.name as supplier_name
FROM bom_items bi
JOIN projects p ON bi.project_id = p.id
JOIN materials m ON bi.material_id = m.id
LEFT JOIN suppliers s ON m.supplier_id = s.id;

-- Add some helpful comments
COMMENT ON TABLE clients IS 'Klienci systemu - firmy i osoby zamawiające projekty';
COMMENT ON TABLE projects IS 'Projekty - główne encje systemu z konfiguracją modułów';
COMMENT ON TABLE bom_items IS 'Pozycje BOM - lista materiałów potrzebnych do realizacji projektu';
COMMENT ON TABLE materials IS 'Katalog materiałów dostępnych w systemie';
COMMENT ON TABLE suppliers IS 'Dostawcy materiałów';

COMMENT ON COLUMN projects.modules IS 'JSONB z konfiguracją aktywnych modułów: {"general": true, "materials": true, etc.}';
COMMENT ON COLUMN project_activity.type IS 'Typ aktywności: project_created, bom_updated, status_changed, message_added, etc.';
COMMENT ON COLUMN project_activity.payload_json IS 'JSON z szczegółami aktywności - struktura zależy od typu';

-- Verify the seed data
DO $$
DECLARE
    client_count INTEGER;
    supplier_count INTEGER;
    material_count INTEGER;
    project_count INTEGER;
    bom_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO client_count FROM clients;
    SELECT COUNT(*) INTO supplier_count FROM suppliers;
    SELECT COUNT(*) INTO material_count FROM materials;
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO bom_count FROM bom_items;
    
    RAISE NOTICE 'Seed data inserted successfully:';
    RAISE NOTICE '- % clients', client_count;
    RAISE NOTICE '- % suppliers', supplier_count;
    RAISE NOTICE '- % materials', material_count;
    RAISE NOTICE '- % projects', project_count;
    RAISE NOTICE '- % BOM items', bom_count;
END $$;