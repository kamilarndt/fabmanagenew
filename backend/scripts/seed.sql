TRUNCATE tile_materials, tiles, schedule_tasks, design_tasks, cnc_tasks, production_tasks, logistics_routes, packing_lists, projects, materials, clients RESTART IDENTITY CASCADE;

INSERT INTO clients (id, name, email, phone) VALUES
 ('11111111-1111-1111-1111-111111111111','ACME Sp. z o.o.','contact@acme.pl','+48 111 111 111');

INSERT INTO projects (id, client_id, name, status, deadline) VALUES
 ('22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Stoisko Targi 2025','active','2025-12-15');

INSERT INTO materials (id, code, name, unit, unit_cost, stock, location) VALUES
 ('33333333-3333-3333-3333-333333333331','PLY/PLYWOOD/18','Sklejka 18mm','szt',120.00,200,'Magazyn A'),
 ('33333333-3333-3333-3333-333333333332','MDF/16','MDF 16mm','szt',90.00,150,'Magazyn B');

INSERT INTO tiles (id, project_id, name, status, priority) VALUES
 ('44444444-4444-4444-4444-444444444441','22222222-2222-2222-2222-222222222222','Lada recepcyjna','designing',10),
 ('44444444-4444-4444-4444-444444444442','22222222-2222-2222-2222-222222222222','Panel ścienny A','approved',20);

INSERT INTO tile_materials (tile_id, material_id, quantity) VALUES
 ('44444444-4444-4444-4444-444444444441','33333333-3333-3333-3333-333333333331',8.0),
 ('44444444-4444-4444-4444-444444444441','33333333-3333-3333-3333-333333333332',4.0),
 ('44444444-4444-4444-4444-444444444442','33333333-3333-3333-3333-333333333331',6.0);

INSERT INTO schedule_tasks (id, project_id, name, start_at, end_at, status) VALUES
 ('55555555-5555-5555-5555-555555555551','22222222-2222-2222-2222-222222222222','Kickoff','2025-09-15','2025-09-15','completed'),
 ('55555555-5555-5555-5555-555555555552','22222222-2222-2222-2222-222222222222','Montaż','2025-12-10','2025-12-14','planned');

INSERT INTO design_tasks (id, tile_id, name, status, assignee, planned_hours) VALUES
 ('66666666-6666-6666-6666-666666666661','44444444-4444-4444-4444-444444444441','Model 3D Lada','in_progress','Anna',12),
 ('66666666-6666-6666-6666-666666666662','44444444-4444-4444-4444-444444444442','Rysunki Panel A','planned','Marek',8);

INSERT INTO cnc_tasks (id, tile_id, machine, estimated_minutes, status) VALUES
 ('77777777-7777-7777-7777-777777777771','44444444-4444-4444-4444-444444444442','EVO-1',90,'queued');

INSERT INTO production_tasks (id, tile_id, station, status) VALUES
 ('88888888-8888-8888-8888-888888888881','44444444-4444-4444-4444-444444444441','Lakiernia','planned');

INSERT INTO logistics_routes (id, project_id, from_location, to_location, planned_date, vehicle_type, driver, status) VALUES
 ('99999999-9999-9999-9999-999999999991','22222222-2222-2222-2222-222222222222','Magazyn A','MT Polska, Warszawa','2025-12-12','Bus','Kowalski','planned');

INSERT INTO packing_lists (id, project_id, item_name, quantity, unit, status) VALUES
 ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','22222222-2222-2222-2222-222222222222','Lada recepcyjna – elementy',10,'szt','packed');



