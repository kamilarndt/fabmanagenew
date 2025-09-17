-- ==============================================
-- UPDATE PROJECT PRICING FUNCTION
-- ==============================================
-- Function to automatically update project pricing
-- when BOM items, logistics, or accommodation costs change
-- ==============================================

CREATE OR REPLACE FUNCTION update_project_pricing()
RETURNS TRIGGER AS $$
DECLARE
    project_uuid UUID;
    material_cost DECIMAL(12,2) := 0;
    logistics_cost DECIMAL(12,2) := 0;
    accommodation_cost DECIMAL(12,2) := 0;
    total_cost DECIMAL(12,2) := 0;
    markup_percentage DECIMAL(5,2) := 0;
    markup_amount DECIMAL(12,2) := 0;
BEGIN
    -- Get project ID based on trigger table
    IF TG_TABLE_NAME = 'bom_items' THEN
        project_uuid := COALESCE(NEW.project_id, OLD.project_id);
    ELSIF TG_TABLE_NAME = 'logistics_orders' THEN
        project_uuid := COALESCE(NEW.project_id, OLD.project_id);
    ELSIF TG_TABLE_NAME = 'accommodation_bookings' THEN
        project_uuid := COALESCE(NEW.project_id, OLD.project_id);
    END IF;

    -- Calculate material cost from BOM items
    SELECT COALESCE(SUM(total_cost), 0) INTO material_cost
    FROM bom_items
    WHERE project_id = project_uuid;

    -- Calculate logistics cost
    SELECT COALESCE(SUM(total_cost), 0) INTO logistics_cost
    FROM logistics_orders
    WHERE project_id = project_uuid;

    -- Calculate accommodation cost
    SELECT COALESCE(SUM(total_cost), 0) INTO accommodation_cost
    FROM accommodation_bookings
    WHERE project_id = project_uuid;

    -- Get markup percentage from existing pricing record
    SELECT COALESCE(markup_percentage, 0) INTO markup_percentage
    FROM project_pricing
    WHERE project_id = project_uuid;

    -- Calculate total cost before markup
    total_cost := material_cost + logistics_cost + accommodation_cost;
    
    -- Calculate markup amount
    markup_amount := total_cost * (markup_percentage / 100);

    -- Update or insert project pricing
    INSERT INTO project_pricing (
        project_id,
        material_cost,
        logistics_cost,
        accommodation_cost,
        total_cost,
        markup_percentage,
        markup_amount
    ) VALUES (
        project_uuid,
        material_cost,
        logistics_cost,
        accommodation_cost,
        total_cost,
        markup_percentage,
        markup_amount
    )
    ON CONFLICT (project_id)
    DO UPDATE SET
        material_cost = EXCLUDED.material_cost,
        logistics_cost = EXCLUDED.logistics_cost,
        accommodation_cost = EXCLUDED.accommodation_cost,
        total_cost = EXCLUDED.total_cost,
        markup_percentage = EXCLUDED.markup_percentage,
        markup_amount = EXCLUDED.markup_amount,
        updated_at = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic pricing updates
CREATE TRIGGER update_pricing_on_bom_change
    AFTER INSERT OR UPDATE OR DELETE ON bom_items
    FOR EACH ROW EXECUTE FUNCTION update_project_pricing();

CREATE TRIGGER update_pricing_on_logistics_change
    AFTER INSERT OR UPDATE OR DELETE ON logistics_orders
    FOR EACH ROW EXECUTE FUNCTION update_project_pricing();

CREATE TRIGGER update_pricing_on_accommodation_change
    AFTER INSERT OR UPDATE OR DELETE ON accommodation_bookings
    FOR EACH ROW EXECUTE FUNCTION update_project_pricing();

-- ==============================================
-- UPDATE INVENTORY FUNCTION
-- ==============================================
-- Function to automatically update inventory levels
-- when material orders are completed
-- ==============================================

CREATE OR REPLACE FUNCTION update_inventory_on_order_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update inventory when order status changes to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Add to inventory
        INSERT INTO inventory_movements (material_id, type, quantity, reason)
        VALUES (NEW.material_id, 'in', NEW.quantity, 'Zamówienie ukończone: ' || NEW.id::text);
        
        -- Update material inventory level
        UPDATE materials
        SET inventory_level = inventory_level + NEW.quantity
        WHERE id = NEW.material_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory updates
CREATE TRIGGER update_inventory_on_order_completion_trigger
    AFTER UPDATE ON material_orders
    FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order_completion();

-- ==============================================
-- PROJECT ACTIVITY LOGGING FUNCTION
-- ==============================================
-- Function to automatically log project activities
-- ==============================================

CREATE OR REPLACE FUNCTION log_project_activity()
RETURNS TRIGGER AS $$
DECLARE
    activity_type VARCHAR(100);
    payload_data JSONB;
    project_uuid UUID;
BEGIN
    -- Determine activity type based on table and operation
    IF TG_OP = 'INSERT' THEN
        activity_type := TG_TABLE_NAME || '_created';
        payload_data := to_jsonb(NEW);
        project_uuid := NEW.project_id;
    ELSIF TG_OP = 'UPDATE' THEN
        activity_type := TG_TABLE_NAME || '_updated';
        payload_data := jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        );
        project_uuid := NEW.project_id;
    ELSIF TG_OP = 'DELETE' THEN
        activity_type := TG_TABLE_NAME || '_deleted';
        payload_data := to_jsonb(OLD);
        project_uuid := OLD.project_id;
    END IF;

    -- Insert activity log
    INSERT INTO project_activity (project_id, type, payload_json, actor_id)
    VALUES (project_uuid, activity_type, payload_data, auth.uid());

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity logging on key tables
CREATE TRIGGER log_tile_activity
    AFTER INSERT OR UPDATE OR DELETE ON tiles
    FOR EACH ROW EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_bom_activity
    AFTER INSERT OR UPDATE OR DELETE ON bom_items
    FOR EACH ROW EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_logistics_activity
    AFTER INSERT OR UPDATE OR DELETE ON logistics_orders
    FOR EACH ROW EXECUTE FUNCTION log_project_activity();

CREATE TRIGGER log_accommodation_activity
    AFTER INSERT OR UPDATE OR DELETE ON accommodation_bookings
    FOR EACH ROW EXECUTE FUNCTION log_project_activity();

-- ==============================================
-- NOTIFICATION FUNCTION
-- ==============================================
-- Function to send notifications for important events
-- ==============================================

CREATE OR REPLACE FUNCTION send_project_notification(
    project_id UUID,
    notification_type VARCHAR(100),
    title TEXT,
    message TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Insert notification into project_activity
    INSERT INTO project_activity (project_id, type, payload_json, actor_id)
    VALUES (
        project_id,
        'notification',
        jsonb_build_object(
            'notification_type', notification_type,
            'title', title,
            'message', message,
            'timestamp', NOW()
        ),
        auth.uid()
    );
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- DEADLINE ALERT FUNCTION
-- ==============================================
-- Function to check for approaching deadlines
-- ==============================================

CREATE OR REPLACE FUNCTION check_deadline_alerts()
RETURNS VOID AS $$
DECLARE
    tile_record RECORD;
    days_until_deadline INTEGER;
BEGIN
    -- Check tiles with deadlines in the next 3 days
    FOR tile_record IN
        SELECT t.*, p.name as project_name
        FROM tiles t
        JOIN projects p ON t.project_id = p.id
        WHERE t.deadline IS NOT NULL
        AND t.deadline <= CURRENT_DATE + INTERVAL '3 days'
        AND t.deadline > CURRENT_DATE
        AND t.status NOT IN ('completed', 'cancelled')
    LOOP
        days_until_deadline := tile_record.deadline - CURRENT_DATE;
        
        -- Send notification
        PERFORM send_project_notification(
            tile_record.project_id,
            'deadline_alert',
            'Zbliżający się termin',
            'Element "' || tile_record.name || '" w projekcie "' || tile_record.project_name || '" ma termin za ' || days_until_deadline || ' dni.'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- BUDGET ALERT FUNCTION
-- ==============================================
-- Function to check budget overruns
-- ==============================================

CREATE OR REPLACE FUNCTION check_budget_alerts()
RETURNS VOID AS $$
DECLARE
    project_record RECORD;
    budget_variance DECIMAL(12,2);
BEGIN
    -- Check projects where actual cost exceeds budget
    FOR project_record IN
        SELECT p.id, p.name, p.budget, pp.total_cost
        FROM projects p
        LEFT JOIN project_pricing pp ON p.id = pp.project_id
        WHERE p.budget IS NOT NULL
        AND pp.total_cost > p.budget
    LOOP
        budget_variance := project_record.total_cost - project_record.budget;
        
        -- Send notification
        PERFORM send_project_notification(
            project_record.id,
            'budget_alert',
            'Przekroczenie budżetu',
            'Projekt "' || project_record.name || '" przekroczył budżet o ' || budget_variance || ' PLN.'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
