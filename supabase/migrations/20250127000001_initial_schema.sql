-- ==============================================
-- FABMANAGE-CLEAN INITIAL MIGRATION
-- ==============================================
-- Initial database schema for FabManage-Clean
-- Date: 2025-01-27
-- ==============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================
-- CORE PROJECT TABLES
-- ==============================================

-- Klienci
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Projekty (główna tabela)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id),
    status VARCHAR(50) DEFAULT 'active',
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    modules JSONB DEFAULT '{}', -- Konfiguracja aktywnych modułów
    description TEXT,
    manager_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Wiadomości projektu
CREATE TABLE project_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    body_html TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktywność projektu (timeline)
CREATE TABLE project_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'message', 'status_change', 'file_upload', etc.
    payload_json JSONB,
    actor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uprawnienia do projektów
CREATE TABLE project_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    permission VARCHAR(50) NOT NULL, -- 'view', 'edit', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- FILES MODULE
-- ==============================================

-- Katalogi plików
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES folders(id),
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Pliki
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(100),
    url TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Uprawnienia do plików
CREATE TABLE file_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    permission_type VARCHAR(50) NOT NULL, -- 'read', 'write', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- CONCEPT MODULE
-- ==============================================

-- Koncepcje projektów
CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zasoby koncepcji (mockupy, wizualizacje)
CREATE TABLE concept_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'mockup', 'visualization', 'document'
    url TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zatwierdzenia koncepcji
CREATE TABLE concept_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES auth.users(id),
    status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- MATERIALS MODULE
-- ==============================================

-- Dostawcy
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_info JSONB,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materiały
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10,2),
    inventory_level INTEGER DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pozycje BOM
CREATE TABLE bom_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zamówienia materiałów
CREATE TABLE material_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity DECIMAL(10,3) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date DATE,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ruchy magazynowe
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id),
    type VARCHAR(50) NOT NULL, -- 'in', 'out', 'transfer'
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- TILES/KANBAN MODULE
-- ==============================================

-- Elementy projektu (płytki)
CREATE TABLE tiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(20) DEFAULT 'medium',
    deadline DATE,
    assignee_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kolumny Kanban
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Karty Kanban
CREATE TABLE kanban_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tile_id UUID REFERENCES tiles(id) ON DELETE CASCADE,
    column_id UUID REFERENCES kanban_columns(id),
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zależności między elementami
CREATE TABLE tile_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tile_id UUID REFERENCES tiles(id) ON DELETE CASCADE,
    depends_on_tile_id UUID REFERENCES tiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- LOGISTICS MODULE
-- ==============================================

-- Zamówienia logistyczne
CREATE TABLE logistics_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 1,
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    pickup_date DATE,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trasy transportowe
CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logistics_order_id UUID REFERENCES logistics_orders(id) ON DELETE CASCADE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance DECIMAL(8,2),
    estimated_time INTEGER, -- w minutach
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- ACCOMMODATION MODULE
-- ==============================================

-- Partnerzy zakwaterowania
CREATE TABLE accommodation_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- 'hotel', 'apartment', 'hostel'
    location VARCHAR(255),
    contact_info JSONB,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rezerwacje zakwaterowania
CREATE TABLE accommodation_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES accommodation_partners(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER DEFAULT 1,
    cost_per_night DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zamówienia posiłków
CREATE TABLE meal_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_booking_id UUID REFERENCES accommodation_bookings(id) ON DELETE CASCADE,
    meal_type VARCHAR(100) NOT NULL, -- 'breakfast', 'lunch', 'dinner'
    quantity INTEGER DEFAULT 1,
    cost_per_meal DECIMAL(8,2),
    total_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- PRICING MODULE
-- ==============================================

-- Wyceny projektów
CREATE TABLE project_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    total_cost DECIMAL(12,2),
    material_cost DECIMAL(12,2),
    logistics_cost DECIMAL(12,2),
    accommodation_cost DECIMAL(12,2),
    markup_percentage DECIMAL(5,2),
    markup_amount DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Szczegółowy podział kosztów
CREATE TABLE pricing_breakdown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- DOCUMENTS MODULE
-- ==============================================

-- Kategorie dokumentów
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dokumenty
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'invoice', 'contract', 'certificate'
    category_id UUID REFERENCES document_categories(id),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDICES FOR PERFORMANCE
-- ==============================================

-- Core project indices
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX idx_project_messages_created_at ON project_messages(created_at DESC);
CREATE INDEX idx_project_activity_project_id ON project_activity(project_id);
CREATE INDEX idx_project_activity_created_at ON project_activity(created_at DESC);
CREATE INDEX idx_project_permissions_project_id ON project_permissions(project_id);
CREATE INDEX idx_project_permissions_user_id ON project_permissions(user_id);

-- Files module indices
CREATE INDEX idx_folders_project_id ON folders(project_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_created_at ON files(created_at DESC);

-- Materials module indices
CREATE INDEX idx_bom_items_project_id ON bom_items(project_id);
CREATE INDEX idx_bom_items_material_id ON bom_items(material_id);
CREATE INDEX idx_material_orders_project_id ON material_orders(project_id);
CREATE INDEX idx_material_orders_status ON material_orders(status);
CREATE INDEX idx_inventory_movements_material_id ON inventory_movements(material_id);

-- Tiles/Kanban module indices
CREATE INDEX idx_tiles_project_id ON tiles(project_id);
CREATE INDEX idx_tiles_status ON tiles(status);
CREATE INDEX idx_tiles_assignee_id ON tiles(assignee_id);
CREATE INDEX idx_kanban_columns_project_id ON kanban_columns(project_id);
CREATE INDEX idx_kanban_cards_column_id ON kanban_cards(column_id);
CREATE INDEX idx_kanban_cards_tile_id ON kanban_cards(tile_id);

-- Logistics module indices
CREATE INDEX idx_logistics_orders_project_id ON logistics_orders(project_id);
CREATE INDEX idx_logistics_orders_status ON logistics_orders(status);
CREATE INDEX idx_transport_routes_logistics_order_id ON transport_routes(logistics_order_id);

-- Accommodation module indices
CREATE INDEX idx_accommodation_bookings_project_id ON accommodation_bookings(project_id);
CREATE INDEX idx_accommodation_bookings_status ON accommodation_bookings(status);
CREATE INDEX idx_meal_orders_accommodation_booking_id ON meal_orders(accommodation_booking_id);

-- Pricing module indices
CREATE INDEX idx_project_pricing_project_id ON project_pricing(project_id);
CREATE INDEX idx_pricing_breakdown_project_id ON pricing_breakdown(project_id);

-- Documents module indices
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_category_id ON documents(category_id);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS for all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE tile_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- RLS POLICIES
-- ==============================================

-- Projects policies
CREATE POLICY "Users can view projects they have access to" ON projects
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = projects.id
        )
    );

CREATE POLICY "Users can update projects they can edit" ON projects
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = projects.id AND permission IN ('edit', 'admin')
        )
    );

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Project messages policies
CREATE POLICY "Users can view messages for projects they have access to" ON project_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = project_messages.project_id
        )
    );

CREATE POLICY "Users can create messages for projects they have access to" ON project_messages
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = project_messages.project_id
        )
    );

-- Project activity policies
CREATE POLICY "Users can view activity for projects they have access to" ON project_activity
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = project_activity.project_id
        )
    );

-- Project permissions policies
CREATE POLICY "Users can view permissions for projects they have access to" ON project_permissions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions pp
            WHERE pp.project_id = project_permissions.project_id AND pp.permission = 'admin'
        )
    );

-- Files policies
CREATE POLICY "Users can view files for projects they have access to" ON files
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = (
                SELECT project_id FROM folders WHERE id = files.folder_id
            )
        )
    );

CREATE POLICY "Users can create files for projects they have access to" ON files
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = (
                SELECT project_id FROM folders WHERE id = files.folder_id
            )
        )
    );

-- BOM items policies
CREATE POLICY "Users can view BOM items for projects they have access to" ON bom_items
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = bom_items.project_id
        )
    );

CREATE POLICY "Users can modify BOM items for projects they can edit" ON bom_items
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = bom_items.project_id AND permission IN ('edit', 'admin')
        )
    );

-- Tiles policies
CREATE POLICY "Users can view tiles for projects they have access to" ON tiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = tiles.project_id
        )
    );

CREATE POLICY "Users can modify tiles for projects they can edit" ON tiles
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = tiles.project_id AND permission IN ('edit', 'admin')
        )
    );

-- ==============================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_messages_updated_at BEFORE UPDATE ON project_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concepts_updated_at BEFORE UPDATE ON concepts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bom_items_updated_at BEFORE UPDATE ON bom_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiles_updated_at BEFORE UPDATE ON tiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_pricing_updated_at BEFORE UPDATE ON project_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add project creator as admin
CREATE OR REPLACE FUNCTION add_project_creator_permission()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_permissions (project_id, user_id, permission)
    VALUES (NEW.id, NEW.created_by, 'admin');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to add project creator permission
CREATE TRIGGER add_project_creator_permission_trigger
    AFTER INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION add_project_creator_permission();

-- Function to calculate BOM item total cost
CREATE OR REPLACE FUNCTION calculate_bom_item_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = NEW.quantity * COALESCE(NEW.unit_cost, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to calculate BOM item total cost
CREATE TRIGGER calculate_bom_item_total_cost_trigger
    BEFORE INSERT OR UPDATE ON bom_items
    FOR EACH ROW EXECUTE FUNCTION calculate_bom_item_total_cost();

-- Function to calculate logistics order total cost
CREATE OR REPLACE FUNCTION calculate_logistics_order_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = NEW.quantity * COALESCE(NEW.cost_per_unit, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to calculate logistics order total cost
CREATE TRIGGER calculate_logistics_order_total_cost_trigger
    BEFORE INSERT OR UPDATE ON logistics_orders
    FOR EACH ROW EXECUTE FUNCTION calculate_logistics_order_total_cost();

-- Function to calculate accommodation booking total cost
CREATE OR REPLACE FUNCTION calculate_accommodation_booking_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = (NEW.check_out - NEW.check_in) * NEW.guests * COALESCE(NEW.cost_per_night, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to calculate accommodation booking total cost
CREATE TRIGGER calculate_accommodation_booking_total_cost_trigger
    BEFORE INSERT OR UPDATE ON accommodation_bookings
    FOR EACH ROW EXECUTE FUNCTION calculate_accommodation_booking_total_cost();

-- ==============================================
-- INITIAL DATA
-- ==============================================

-- Insert default document categories
INSERT INTO document_categories (name, description, color) VALUES
('Faktury', 'Dokumenty finansowe i faktury', '#ff6b6b'),
('Umowy', 'Umowy i dokumenty prawne', '#4ecdc4'),
('Certyfikaty', 'Certyfikaty i dokumentacja techniczna', '#45b7d1'),
('Projekty', 'Dokumenty projektowe i specyfikacje', '#96ceb4'),
('Inne', 'Inne dokumenty', '#feca57');

-- Insert default kanban columns for new projects
CREATE OR REPLACE FUNCTION create_default_kanban_columns()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO kanban_columns (project_id, name, order_index, color) VALUES
    (NEW.id, 'Do zrobienia', 1, '#6c757d'),
    (NEW.id, 'W trakcie', 2, '#007bff'),
    (NEW.id, 'Do sprawdzenia', 3, '#ffc107'),
    (NEW.id, 'Zakończone', 4, '#28a745');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default kanban columns
CREATE TRIGGER create_default_kanban_columns_trigger
    AFTER INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION create_default_kanban_columns();

-- ==============================================
-- VIEWS FOR COMMON QUERIES
-- ==============================================

-- View for project summary with pricing
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.budget,
    p.start_date,
    p.end_date,
    c.name as client_name,
    pp.total_cost,
    pp.material_cost,
    pp.logistics_cost,
    pp.accommodation_cost,
    (p.budget - COALESCE(pp.total_cost, 0)) as budget_difference,
    COUNT(DISTINCT t.id) as total_tiles,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tiles
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN project_pricing pp ON p.id = pp.project_id
LEFT JOIN tiles t ON p.id = t.project_id
GROUP BY p.id, p.name, p.status, p.budget, p.start_date, p.end_date, c.name, pp.total_cost, pp.material_cost, pp.logistics_cost, pp.accommodation_cost;

-- View for BOM summary
CREATE VIEW bom_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    COUNT(bi.id) as total_items,
    SUM(bi.quantity) as total_quantity,
    SUM(bi.total_cost) as total_cost,
    COUNT(DISTINCT m.category) as categories_count
FROM projects p
LEFT JOIN bom_items bi ON p.id = bi.project_id
LEFT JOIN materials m ON bi.material_id = m.id
GROUP BY p.id, p.name;

-- View for project activity timeline
CREATE VIEW project_activity_timeline AS
SELECT 
    pa.id,
    pa.project_id,
    pa.type,
    pa.payload_json,
    pa.created_at,
    u.email as actor_email,
    p.name as project_name
FROM project_activity pa
LEFT JOIN auth.users u ON pa.actor_id = u.id
LEFT JOIN projects p ON pa.project_id = p.id
ORDER BY pa.created_at DESC;

-- ==============================================
-- GRANT PERMISSIONS
-- ==============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (for public data only)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON document_categories TO anon;
GRANT SELECT ON accommodation_partners TO anon;
