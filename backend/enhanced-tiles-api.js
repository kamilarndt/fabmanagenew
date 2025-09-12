const { getDb } = require('./db');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

function mapBackendStageToUiStatus(stage) {
    const s = String(stage || '').toLowerCase()
    switch (s) {
        case 'design':
            return 'Projektowanie'
        case 'cnc':
        case 'finishing':
        case 'assembly':
        case 'qc':
            return 'W produkcji CNC'
        case 'done':
            return 'Gotowy do montażu'
        default:
            return 'Do akceptacji'
    }
}

function mapUiStatusToBackendStage(status) {
    const s = String(status || '').toLowerCase()
    if (s.includes('projekt')) return 'design'
    if (s.includes('produkcji') || s.includes('cięcia')) return 'cnc'
    if (s.includes('gotowy') || s.includes('zakoń')) return 'done'
    if (s.includes('zaakcept')) return 'cnc'
    return 'design'
}

function buildBomForTile(d, tileId) {
    try {
        const rows = d.prepare(`
            SELECT tm.material_id, tm.quantity, tm.waste_percent,
                   m.category, m.type, m.name as mname, m.base_uom, m.price_per_uom,
                   COALESCE(s.quantity, 0) as stock
            FROM tile_materials tm
            LEFT JOIN materials m ON m.id = tm.material_id
            LEFT JOIN stocks s ON s.material_id = tm.material_id
            WHERE tm.tile_id = ?
        `).all(tileId)
        return rows.map((r) => ({
            id: `${tileId}__${r.material_id}`,
            type: 'Materiał surowy',
            name: r.mname || `${r.category || ''} ${r.type || ''}`.trim(),
            quantity: Number(r.quantity) || 0,
            unit: r.base_uom || 'szt',
            supplier: undefined,
            status: (r.stock >= (Number(r.quantity) || 0)) ? 'Na stanie' : 'Do zamówienia',
            unitCost: r.price_per_uom || 0,
            materialId: r.material_id
        }))
    } catch (_) { return [] }
}

function calculateTileCosts(d, tileId) {
    try {
        // Calculate material cost from BOM
        const materialCost = d.prepare(`
            SELECT SUM(tm.quantity * m.price_per_uom) as total
            FROM tile_materials tm
            LEFT JOIN materials m ON m.id = tm.material_id
            WHERE tm.tile_id = ?
        `).get(tileId)?.total || 0

        // Get labor cost from tile
        const tile = d.prepare('SELECT labor_cost FROM tiles WHERE id = ?').get(tileId)
        const laborCost = tile?.labor_cost || 0

        const totalCost = materialCost + laborCost

        // Update tile with calculated costs
        d.prepare('UPDATE tiles SET material_cost = ?, total_cost = ? WHERE id = ?')
            .run(materialCost, totalCost, tileId)

        return { materialCost, laborCost, totalCost }
    } catch (e) {
        console.warn('Error calculating costs:', e.message)
        return { materialCost: 0, laborCost: 0, totalCost: 0 }
    }
}

function createEnhancedTile(tileData) {
    const d = getDb()
    const now = new Date().toISOString()
    
    const {
        project_id,
        name,
        code,
        quantity = 1,
        description = '',
        width_mm = null,
        height_mm = null,
        thickness_mm = null,
        deadline = null,
        assigned_designer = null,
        priority = 'Średni',
        group_id = null,
        speckle_object_ids = null,
        stage = 'design',
        status = 'new',
        notes = ''
    } = tileData

    if (!name) {
        throw new Error('name is required')
    }

    const tileId = uuid()
    
    // Insert tile with all new fields
    d.prepare(`
        INSERT INTO tiles (
            id, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm, 
            description, created_at, deadline, assigned_designer, priority, progress_percent, 
            group_id, speckle_object_ids, dxf_file_path, assembly_drawing_path, 
            labor_cost, material_cost, total_cost, status, notes, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        tileId, project_id, code, name, quantity, stage, width_mm, height_mm, thickness_mm,
        description, now, deadline, assigned_designer, priority, 0,
        group_id, speckle_object_ids ? JSON.stringify(speckle_object_ids) : null, null, null,
        0, 0, 0, status, notes, now
    )

    // Calculate initial costs
    const costs = calculateTileCosts(d, tileId)

    // Get created tile
    const created = d.prepare('SELECT * FROM tiles WHERE id = ?').get(tileId)
    
    // Build UI response
    const ui = {
        id: created.id,
        name: created.name,
        code: created.code,
        status: mapBackendStageToUiStatus(created.stage),
        project: created.project_id,
        opis: created.description,
        termin: created.deadline,
        priority: created.priority,
        progress: created.progress_percent,
        assigned_designer: created.assigned_designer,
        group_id: created.group_id,
        speckle_object_ids: created.speckle_object_ids ? JSON.parse(created.speckle_object_ids) : null,
        dxfFile: created.dxf_file_path,
        assemblyDrawing: created.assembly_drawing_path,
        bom: buildBomForTile(d, created.id),
        laborCost: created.labor_cost,
        materialCost: created.material_cost,
        totalCost: created.total_cost,
        notes: created.notes,
        dimensions: {
            width_mm: created.width_mm,
            height_mm: created.height_mm,
            thickness_mm: created.thickness_mm
        },
        created_at: created.created_at,
        updated_at: created.updated_at
    }

    // Audit log
    try {
        const { auditLog } = require('./db')
        auditLog({ 
            action: 'tile.create_enhanced', 
            entityType: 'tile', 
            entityId: tileId, 
            payload: tileData 
        })
    } catch (e) { /* ignore */ }

    return ui
}

function updateEnhancedTile(tileId, updateData) {
    const d = getDb()
    const now = new Date().toISOString()
    
    // Check if tile exists
    const existing = d.prepare('SELECT * FROM tiles WHERE id = ?').get(tileId)
    if (!existing) {
        throw new Error('Tile not found')
    }

    const {
        name,
        code,
        quantity,
        description,
        width_mm,
        height_mm,
        thickness_mm,
        deadline,
        assigned_designer,
        priority,
        progress_percent,
        group_id,
        speckle_object_ids,
        stage,
        status,
        notes,
        labor_cost
    } = updateData

    // Map UI status to backend stage if provided
    let finalStage = stage || existing.stage
    if (status && !stage) {
        finalStage = mapUiStatusToBackendStage(status)
    }

    // Update tile
    d.prepare(`
        UPDATE tiles SET 
            name = COALESCE(?, name),
            code = COALESCE(?, code),
            quantity = COALESCE(?, quantity),
            description = COALESCE(?, description),
            width_mm = COALESCE(?, width_mm),
            height_mm = COALESCE(?, height_mm),
            thickness_mm = COALESCE(?, thickness_mm),
            deadline = COALESCE(?, deadline),
            assigned_designer = COALESCE(?, assigned_designer),
            priority = COALESCE(?, priority),
            progress_percent = COALESCE(?, progress_percent),
            group_id = COALESCE(?, group_id),
            speckle_object_ids = COALESCE(?, speckle_object_ids),
            stage = ?,
            status = COALESCE(?, status),
            notes = COALESCE(?, notes),
            labor_cost = COALESCE(?, labor_cost),
            updated_at = ?
        WHERE id = ?
    `).run(
        name, code, quantity, description, width_mm, height_mm, thickness_mm,
        deadline, assigned_designer, priority, progress_percent, group_id,
        speckle_object_ids ? JSON.stringify(speckle_object_ids) : null,
        finalStage, status, notes, labor_cost, now, tileId
    )

    // Recalculate costs
    const costs = calculateTileCosts(d, tileId)

    // Get updated tile
    const updated = d.prepare('SELECT * FROM tiles WHERE id = ?').get(tileId)
    
    // Build UI response
    const ui = {
        id: updated.id,
        name: updated.name,
        code: updated.code,
        status: mapBackendStageToUiStatus(updated.stage),
        project: updated.project_id,
        opis: updated.description,
        termin: updated.deadline,
        priority: updated.priority,
        progress: updated.progress_percent,
        assigned_designer: updated.assigned_designer,
        group_id: updated.group_id,
        speckle_object_ids: updated.speckle_object_ids ? JSON.parse(updated.speckle_object_ids) : null,
        dxfFile: updated.dxf_file_path,
        assemblyDrawing: updated.assembly_drawing_path,
        bom: buildBomForTile(d, updated.id),
        laborCost: updated.labor_cost,
        materialCost: updated.material_cost,
        totalCost: updated.total_cost,
        notes: updated.notes,
        dimensions: {
            width_mm: updated.width_mm,
            height_mm: updated.height_mm,
            thickness_mm: updated.thickness_mm
        },
        created_at: updated.created_at,
        updated_at: updated.updated_at
    }

    // Audit log
    try {
        const { auditLog } = require('./db')
        auditLog({ 
            action: 'tile.update_enhanced', 
            entityType: 'tile', 
            entityId: tileId, 
            payload: updateData 
        })
    } catch (e) { /* ignore */ }

    return ui
}

function getEnhancedTiles(projectId = null) {
    const d = getDb()
    
    let sql = 'SELECT * FROM tiles WHERE 1=1'
    const params = {}
    
    if (projectId) {
        sql += ' AND project_id = @projectId'
        params.projectId = projectId
    }
    
    sql += ' ORDER BY created_at DESC'
    
    const rows = d.prepare(sql).all(params)
    
    return rows.map(r => ({
        id: r.id,
        name: r.name,
        code: r.code,
        status: mapBackendStageToUiStatus(r.stage),
        project: r.project_id,
        opis: r.description,
        termin: r.deadline,
        priority: r.priority,
        progress: r.progress_percent,
        assigned_designer: r.assigned_designer,
        group_id: r.group_id,
        speckle_object_ids: r.speckle_object_ids ? JSON.parse(r.speckle_object_ids) : null,
        dxfFile: r.dxf_file_path,
        assemblyDrawing: r.assembly_drawing_path,
        bom: buildBomForTile(d, r.id),
        laborCost: r.labor_cost,
        materialCost: r.material_cost,
        totalCost: r.total_cost,
        notes: r.notes,
        dimensions: {
            width_mm: r.width_mm,
            height_mm: r.height_mm,
            thickness_mm: r.thickness_mm
        },
        created_at: r.created_at,
        updated_at: r.updated_at
    }))
}

function getTileGroups(projectId = null) {
    const d = getDb()
    
    let sql = `
        SELECT 
            group_id,
            COUNT(*) as tile_count,
            MIN(created_at) as first_created,
            MAX(updated_at) as last_updated
        FROM tiles 
        WHERE group_id IS NOT NULL
    `
    const params = {}
    
    if (projectId) {
        sql += ' AND project_id = @projectId'
        params.projectId = projectId
    }
    
    sql += ' GROUP BY group_id ORDER BY first_created'
    
    return d.prepare(sql).all(params)
}

module.exports = {
    createEnhancedTile,
    updateEnhancedTile,
    getEnhancedTiles,
    getTileGroups,
    buildBomForTile,
    calculateTileCosts,
    mapBackendStageToUiStatus,
    mapUiStatusToBackendStage
}

