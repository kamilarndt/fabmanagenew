#!/usr/bin/env node

/**
 * COMPREHENSIVE DEMO DATA GENERATOR FOR FABMANAGE
 * 
 * This script generates a complete, realistic library of data for demo purposes:
 * - 8 realistic clients (Teatr Narodowy, Muzeum Łazienki, Orange Festival, etc.)
 * - 8 diverse projects with different modules and priorities
 * - 25+ production tiles/elements with realistic dimensions
 * - 25+ materials with comprehensive catalog and stock levels
 * - BOM (Bill of Materials) for all tiles
 * - Logistics and accommodation data
 * - Stock movements and demands
 * 
 * Usage: node generate-demo-library.js
 */

const { getDb } = require('./db');
const { generateDemoData } = require('./demo-data-generator');
const { generateMaterialsAndStocks } = require('./materials-and-stocks');
const { generateBOMAndLogistics } = require('./bom-and-logistics');

function generateCompleteDemoLibrary() {
    console.log('🎬 FABMANAGE DEMO DATA GENERATOR');
    console.log('================================');
    console.log('');

    try {
        // Initialize database
        const d = getDb();
        console.log('📊 Database initialized successfully');

        // Step 1: Generate clients and projects
        console.log('\n🏢 STEP 1: Generating clients and projects...');
        const { clients, projects, tiles } = generateDemoData();

        // Step 2: Generate materials and stock levels
        console.log('\n📦 STEP 2: Generating materials catalog and stock levels...');
        const { materials, stockLevels } = generateMaterialsAndStocks();

        // Step 3: Generate BOM and logistics
        console.log('\n🔧 STEP 3: Generating BOM, logistics and accommodation...');
        const { logisticsData, accommodationData, stockMovements } = generateBOMAndLogistics();

        // Step 4: Generate summary statistics
        console.log('\n📈 STEP 4: Generating summary statistics...');
        generateSummaryStatistics();

        console.log('\n✅ DEMO DATA GENERATION COMPLETED SUCCESSFULLY!');
        console.log('===============================================');
        console.log('');
        console.log('📊 GENERATED DATA SUMMARY:');
        console.log(`   • ${clients.length} clients`);
        console.log(`   • ${projects.length} projects`);
        console.log(`   • ${tiles.length} tiles/elements`);
        console.log(`   • ${materials.length} materials`);
        console.log(`   • ${logisticsData.length} logistics entries`);
        console.log(`   • ${accommodationData.length} accommodation entries`);
        console.log(`   • ${stockMovements.length} stock movements`);
        console.log('');
        console.log('🎯 DEMO SCENARIOS AVAILABLE:');
        console.log('   • Teatr Narodowy - Scenografia "Wesele" (aktywny projekt)');
        console.log('   • Orange Festival - Scena główna (wysokie priorytet)');
        console.log('   • Muzeum Łazienki - Wystawa (prawie gotowa)');
        console.log('   • IKEA Showroom - Kuchnia demonstracyjna (w produkcji)');
        console.log('   • Krytyczne stany magazynowe (MDF 25mm, Plexi 10mm)');
        console.log('   • Logistyka i zakwaterowanie (Orange Festival, IKEA)');
        console.log('');
        console.log('🚀 Ready for demo! Start the backend server and explore the data.');

    } catch (error) {
        console.error('❌ Error generating demo data:', error);
        process.exit(1);
    }
}

function generateSummaryStatistics() {
    const d = getDb();

    // Project statistics
    const projectStats = d.prepare(`
        SELECT 
            project_type,
            status,
            priority,
            COUNT(*) as count
        FROM projects 
        GROUP BY project_type, status, priority
        ORDER BY project_type, status
    `).all();

    console.log('📊 Project Statistics:');
    for (const stat of projectStats) {
        console.log(`   ${stat.project_type} - ${stat.status} (${stat.priority}): ${stat.count} projects`);
    }

    // Material statistics
    const materialStats = d.prepare(`
        SELECT 
            m.category,
            COUNT(*) as material_count,
            SUM(s.quantity) as total_stock,
            AVG(s.quantity) as avg_stock
        FROM materials m
        LEFT JOIN stocks s ON s.material_id = m.id
        GROUP BY m.category
        ORDER BY material_count DESC
    `).all();

    console.log('\n📦 Material Statistics:');
    for (const stat of materialStats) {
        console.log(`   ${stat.category}: ${stat.material_count} materials, ${stat.total_stock?.toFixed(1) || 0} total stock`);
    }

    // Stock alerts
    const stockAlerts = d.prepare(`
        SELECT 
            m.name,
            s.quantity,
            s.min_quantity,
            s.max_quantity,
            CASE 
                WHEN s.quantity < s.min_quantity THEN 'CRITICAL'
                WHEN s.quantity < s.min_quantity * 1.5 THEN 'LOW'
                WHEN s.quantity > s.max_quantity THEN 'EXCESS'
                ELSE 'NORMAL'
            END as status
        FROM materials m
        JOIN stocks s ON s.material_id = m.id
        WHERE s.quantity < s.min_quantity OR s.quantity > s.max_quantity
        ORDER BY s.quantity ASC
    `).all();

    console.log('\n⚠️  Stock Alerts:');
    for (const alert of stockAlerts) {
        console.log(`   ${alert.status}: ${alert.name} (${alert.quantity}/${alert.min_quantity}-${alert.max_quantity})`);
    }

    // Tile production stages
    const tileStats = d.prepare(`
        SELECT 
            stage,
            COUNT(*) as count
        FROM tiles
        GROUP BY stage
        ORDER BY 
            CASE stage
                WHEN 'design' THEN 1
                WHEN 'cnc' THEN 2
                WHEN 'finishing' THEN 3
                WHEN 'assembly' THEN 4
                WHEN 'qc' THEN 5
                WHEN 'done' THEN 6
                ELSE 7
            END
    `).all();

    console.log('\n🔧 Production Pipeline:');
    for (const stat of tileStats) {
        console.log(`   ${stat.stage}: ${stat.count} elements`);
    }
}

// Run the generator if called directly
if (require.main === module) {
    generateCompleteDemoLibrary();
}

module.exports = { generateCompleteDemoLibrary };

