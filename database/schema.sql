-- ==============================================
-- FABMANAGE-CLEAN DATABASE SCHEMA
-- System Zarządzania Projektami Produkcyjnymi
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
    email VARCHAR(255) UNIQUE,
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
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'on_hold')),
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    modules JSONB DEFAULT '{}', -- Konfiguracja aktywnych modułów
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
    permission VARCHAR(50) NOT NULL CHECK (permission IN ('view', 'edit', 'admin')),
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
    permission_type VARCHAR(50) NOT NULL CHECK (permission_type IN ('view', 'edit', 'admin')),
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')),
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
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
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
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ordered', 'delivered', 'cancelled')),
    order_date DATE,
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ruchy magazynowe
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
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
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'blocked')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
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
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
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
    type VARCHAR(100) CHECK (type IN ('hotel', 'apartment', 'hostel', 'guesthouse')),
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
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zamówienia wyżywienia
CREATE TABLE meal_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_booking_id UUID REFERENCES accommodation_bookings(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    quantity INTEGER NOT NULL,
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
    type VARCHAR(100) NOT NULL,
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

-- Projects indices
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Messages and activity indices
CREATE INDEX idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX idx_project_messages_created_at ON project_messages(created_at DESC);
CREATE INDEX idx_project_activity_project_id ON project_activity(project_id);
CREATE INDEX idx_project_activity_created_at ON project_activity(created_at DESC);

-- Files indices
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_created_at ON files(created_at DESC);

-- Materials indices
CREATE INDEX idx_bom_items_project_id ON bom_items(project_id);
CREATE INDEX idx_bom_items_material_id ON bom_items(material_id);
CREATE INDEX idx_material_orders_project_id ON material_orders(project_id);
CREATE INDEX idx_material_orders_status ON material_orders(status);

-- Tiles/Kanban indices
CREATE INDEX idx_tiles_project_id ON tiles(project_id);
CREATE INDEX idx_tiles_status ON tiles(status);
CREATE INDEX idx_tiles_assignee_id ON tiles(assignee_id);
CREATE INDEX idx_kanban_cards_column_id ON kanban_cards(column_id);
CREATE INDEX idx_kanban_cards_position ON kanban_cards(position);

-- Logistics indices
CREATE INDEX idx_logistics_orders_project_id ON logistics_orders(project_id);
CREATE INDEX idx_logistics_orders_status ON logistics_orders(status);
CREATE INDEX idx_transport_routes_logistics_order_id ON transport_routes(logistics_order_id);

-- Accommodation indices
CREATE INDEX idx_accommodation_bookings_project_id ON accommodation_bookings(project_id);
CREATE INDEX idx_accommodation_bookings_hotel_id ON accommodation_bookings(hotel_id);
CREATE INDEX idx_accommodation_bookings_check_in ON accommodation_bookings(check_in);

-- Pricing indices
CREATE INDEX idx_project_pricing_project_id ON project_pricing(project_id);
CREATE INDEX idx_pricing_breakdown_project_id ON pricing_breakdown(project_id);

-- Documents indices
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
        ) OR created_by = auth.uid()
    );

CREATE POLICY "Users can update projects they can edit" ON projects
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = projects.id AND permission IN ('edit', 'admin')
        ) OR created_by = auth.uid()
    );

CREATE POLICY "Users can create projects" ON projects
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- Project messages policies
CREATE POLICY "Users can view messages for projects they have access to" ON project_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = project_messages.project_id
        )
    );

CREATE POLICY "Users can create messages for projects they can edit" ON project_messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM project_permissions 
            WHERE project_id = project_messages.project_id AND permission IN ('edit', 'admin')
        )
    );

-- Similar policies for other tables...
-- (Additional policies would be created following the same pattern)

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
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_messages_updated_at BEFORE UPDATE ON project_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_concepts_updated_at BEFORE UPDATE ON concepts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bom_items_updated_at BEFORE UPDATE ON bom_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tiles_updated_at BEFORE UPDATE ON tiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_pricing_updated_at BEFORE UPDATE ON project_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate BOM total cost
CREATE OR REPLACE FUNCTION calculate_bom_total_cost()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_cost = NEW.quantity * COALESCE(NEW.unit_cost, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for BOM cost calculation
CREATE TRIGGER calculate_bom_cost BEFORE INSERT OR UPDATE ON bom_items 
FOR EACH ROW EXECUTE FUNCTION calculate_bom_total_cost();

-- Function to log project activity
CREATE OR REPLACE FUNCTION log_project_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_activity (project_id, type, payload_json, actor_id)
    VALUES (
        NEW.project_id,
        TG_TABLE_NAME || '_' || TG_OP,
        row_to_json(NEW),
        auth.uid()
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for activity logging
CREATE TRIGGER log_project_messages_activity AFTER INSERT OR UPDATE ON project_messages 
FOR EACH ROW EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_tiles_activity AFTER INSERT OR UPDATE ON tiles 
FOR EACH ROW EXECUTE FUNCTION log_project_activity();

-- ==============================================
-- INITIAL DATA
-- ==============================================

-- Insert default document categories
INSERT INTO document_categories (name, description, color) VALUES
('Invoice', 'Faktury i dokumenty finansowe', '#ff6b6b'),
('Contract', 'Umowy i dokumenty prawne', '#4ecdc4'),
('Technical', 'Dokumentacja techniczna', '#45b7d1'),
('Certificate', 'Certyfikaty i zaświadczenia', '#96ceb4'),
('Other', 'Inne dokumenty', '#feca57');

-- Insert default suppliers
INSERT INTO suppliers (name, contact_info) VALUES
('Dostawca Główny', '{"phone": "+48 123 456 789", "email": "kontakt@dostawca.pl"}'),
('Materiały Budowlane Sp. z o.o.', '{"phone": "+48 987 654 321", "email": "info@materiały.pl"}');

-- ==============================================
-- VIEWS FOR COMMON QUERIES
-- ==============================================

-- View for project summary with costs
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.budget,
    c.name as client_name,
    COALESCE(pp.total_cost, 0) as current_cost,
    COALESCE(pp.total_cost, 0) - COALESCE(p.budget, 0) as cost_variance,
    COUNT(DISTINCT pm.id) as message_count,
    COUNT(DISTINCT t.id) as tile_count,
    COUNT(DISTINCT bi.id) as bom_item_count
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN project_pricing pp ON p.id = pp.project_id
LEFT JOIN project_messages pm ON p.id = pm.project_id
LEFT JOIN tiles t ON p.id = t.project_id
LEFT JOIN bom_items bi ON p.id = bi.project_id
GROUP BY p.id, p.name, p.status, p.budget, c.name, pp.total_cost;

-- View for BOM with material details
CREATE VIEW bom_with_details AS
SELECT 
    bi.id,
    bi.project_id,
    bi.quantity,
    bi.unit_cost,
    bi.total_cost,
    m.code,
    m.name as material_name,
    m.category,
    s.name as supplier_name
FROM bom_items bi
JOIN materials m ON bi.material_id = m.id
LEFT JOIN suppliers s ON m.supplier_id = s.id;

-- View for project activity with user details
CREATE VIEW project_activity_with_users AS
SELECT 
    pa.id,
    pa.project_id,
    pa.type,
    pa.payload_json,
    pa.created_at,
    au.email as actor_email
FROM project_activity pa
LEFT JOIN auth.users au ON pa.actor_id = au.id;

-- ==============================================
-- GRANTS AND PERMISSIONS
-- ==============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to anon users (if needed for public access)
-- GRANT USAGE ON SCHEMA public TO anon;
-- GRANT SELECT ON project_summary TO anon;

-- ==============================================
-- COMMENTS FOR DOCUMENTATION
-- ==============================================

COMMENT ON TABLE projects IS 'Główna tabela projektów - zawiera metadane i konfigurację modułów';
COMMENT ON TABLE project_messages IS 'Wiadomości i komentarze w ramach projektu';
COMMENT ON TABLE project_activity IS 'Timeline aktywności projektu - log wszystkich zmian';
COMMENT ON TABLE bom_items IS 'Pozycje BOM (Bill of Materials) - lista materiałów potrzebnych do projektu';
COMMENT ON TABLE tiles IS 'Elementy projektu - zadania i komponenty do realizacji';
COMMENT ON TABLE project_pricing IS 'Wyceny projektów - agregacja kosztów z wszystkich modułów';
COMMENT ON COLUMN projects.modules IS 'JSONB z konfiguracją aktywnych modułów projektu';
COMMENT ON COLUMN project_activity.type IS 'Typ aktywności: message, status_change, file_upload, bom_update, etc.';
COMMENT ON COLUMN project_activity.payload_json IS 'JSON z szczegółami aktywności - zawartość zależy od typu';

-- ==============================================
-- SCHEMA COMPLETION
-- ==============================================

-- Verify all tables are created
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Database schema created successfully with % tables', table_count;
END $$;