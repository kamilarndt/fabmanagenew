"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentAnalyzer = void 0;
// Component Analyzer - analyzes React components and extracts atomic design structure
class ComponentAnalyzer {
    // Analyze ProjectCard component
    static analyzeProjectCard() {
        const components = [];
        // ATOMS
        components.push({
            id: 'text-title',
            name: 'Text Title',
            type: 'atom',
            category: 'typography',
            properties: {
                fontSize: 18,
                fontWeight: 'Bold',
                fontFamily: 'Inter',
                textAlign: 'LEFT',
                lineHeight: { unit: 'AUTO', value: 0 }
            },
            variants: [
                { name: 'h1', properties: { fontSize: 24, fontWeight: 'Bold' } },
                { name: 'h2', properties: { fontSize: 20, fontWeight: 'Bold' } },
                { name: 'h3', properties: { fontSize: 18, fontWeight: 'Bold' } },
                { name: 'h4', properties: { fontSize: 16, fontWeight: 'Medium' } }
            ]
        });
        components.push({
            id: 'text-body',
            name: 'Text Body',
            type: 'atom',
            category: 'typography',
            properties: {
                fontSize: 14,
                fontWeight: 'Regular',
                fontFamily: 'Inter',
                textAlign: 'LEFT',
                lineHeight: { unit: 'AUTO', value: 0 }
            },
            variants: [
                { name: 'small', properties: { fontSize: 12 } },
                { name: 'large', properties: { fontSize: 16 } },
                { name: 'secondary', properties: { fontSize: 14 } }
            ]
        });
        components.push({
            id: 'button-primary',
            name: 'Button Primary',
            type: 'atom',
            category: 'interactive',
            properties: {
                width: 80,
                height: 32,
                cornerRadius: 6,
                padding: { top: 8, right: 16, bottom: 8, left: 16 },
                fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }],
                text: 'Button',
                fontSize: 14,
                fontWeight: 'Medium',
                fontFamily: 'Inter'
            },
            variants: [
                { name: 'secondary', properties: { fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }] } },
                { name: 'text', properties: { fills: [], strokes: [] } },
                { name: 'small', properties: { height: 24, fontSize: 12 } },
                { name: 'large', properties: { height: 40, fontSize: 16 } }
            ]
        });
        components.push({
            id: 'badge-status',
            name: 'Status Badge',
            type: 'atom',
            category: 'indicator',
            properties: {
                width: 80,
                height: 24,
                cornerRadius: 12,
                padding: { top: 4, right: 8, bottom: 4, left: 8 },
                fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }],
                text: 'Status',
                fontSize: 12,
                fontWeight: 'Medium',
                fontFamily: 'Inter',
                textAlign: 'CENTER'
            },
            variants: [
                { name: 'nowy', properties: { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }] } },
                { name: 'projektowanie', properties: { fills: [{ type: 'SOLID', color: { r: 1, g: 0.7, b: 0.2 } }] } },
                { name: 'cnc', properties: { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }] } },
                { name: 'montaz', properties: { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.8, b: 0.3 } }] } }
            ]
        });
        components.push({
            id: 'progress-bar',
            name: 'Progress Bar',
            type: 'atom',
            category: 'indicator',
            properties: {
                width: 200,
                height: 8,
                cornerRadius: 4,
                fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
            },
            variants: [
                { name: 'small', properties: { height: 4 } },
                { name: 'large', properties: { height: 12 } }
            ]
        });
        components.push({
            id: 'avatar',
            name: 'Avatar',
            type: 'atom',
            category: 'media',
            properties: {
                width: 32,
                height: 32,
                cornerRadius: 16,
                fills: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]
            },
            variants: [
                { name: 'small', properties: { width: 24, height: 24, cornerRadius: 12 } },
                { name: 'large', properties: { width: 40, height: 40, cornerRadius: 20 } }
            ]
        });
        components.push({
            id: 'icon',
            name: 'Icon',
            type: 'atom',
            category: 'media',
            properties: {
                width: 16,
                height: 16,
                fills: [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]
            },
            variants: [
                { name: 'small', properties: { width: 12, height: 12 } },
                { name: 'large', properties: { width: 24, height: 24 } }
            ]
        });
        // MOLECULES
        components.push({
            id: 'card',
            name: 'Card',
            type: 'molecule',
            category: 'container',
            properties: {
                width: 300,
                height: 200,
                cornerRadius: 8,
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                effects: [{
                        type: 'DROP_SHADOW',
                        visible: true,
                        color: { r: 0, g: 0, b: 0, a: 0.1 },
                        offset: { x: 0, y: 2 },
                        radius: 8,
                        spread: 0
                    }]
            },
            variants: [
                { name: 'small', properties: { width: 200, height: 150 } },
                { name: 'large', properties: { width: 400, height: 300 } },
                { name: 'no-shadow', properties: { effects: [] } }
            ]
        });
        components.push({
            id: 'tag',
            name: 'Tag',
            type: 'molecule',
            category: 'indicator',
            properties: {
                width: 60,
                height: 24,
                cornerRadius: 12,
                padding: { top: 4, right: 8, bottom: 4, left: 8 },
                fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }],
                text: 'Tag',
                fontSize: 12,
                fontWeight: 'Medium',
                fontFamily: 'Inter',
                textAlign: 'CENTER'
            },
            variants: [
                { name: 'blue', properties: { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }] } },
                { name: 'green', properties: { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.8, b: 0.3 } }] } },
                { name: 'orange', properties: { fills: [{ type: 'SOLID', color: { r: 1, g: 0.6, b: 0.2 } }] } },
                { name: 'red', properties: { fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.2, b: 0.2 } }] } }
            ]
        });
        components.push({
            id: 'space',
            name: 'Space',
            type: 'molecule',
            category: 'layout',
            properties: {
                width: 16,
                height: 16,
                fills: []
            },
            variants: [
                { name: 'xs', properties: { width: 4, height: 4 } },
                { name: 'sm', properties: { width: 8, height: 8 } },
                { name: 'md', properties: { width: 16, height: 16 } },
                { name: 'lg', properties: { width: 24, height: 24 } },
                { name: 'xl', properties: { width: 32, height: 32 } }
            ]
        });
        // ORGANISMS
        components.push({
            id: 'project-card',
            name: 'Project Card',
            type: 'organism',
            category: 'card',
            properties: {
                width: 350,
                height: 400,
                cornerRadius: 12,
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                effects: [{
                        type: 'DROP_SHADOW',
                        visible: true,
                        color: { r: 0, g: 0, b: 0, a: 0.1 },
                        offset: { x: 0, y: 4 },
                        radius: 12,
                        spread: 0
                    }]
            },
            children: [
                {
                    id: 'project-thumbnail',
                    name: 'Project Thumbnail',
                    type: 'molecule',
                    category: 'media',
                    properties: {
                        width: 350,
                        height: 200,
                        cornerRadius: 12,
                        fills: [{
                                type: 'GRADIENT_LINEAR',
                                gradientStops: [
                                    { color: { r: 0.4, g: 0.5, b: 0.9, a: 1 }, position: 0 },
                                    { color: { r: 0.5, g: 0.3, b: 0.6, a: 1 }, position: 1 }
                                ],
                                gradientTransform: [[1, 0, 0], [0, 1, 0]]
                            }]
                    }
                },
                {
                    id: 'project-content',
                    name: 'Project Content',
                    type: 'molecule',
                    category: 'content',
                    properties: {
                        width: 350,
                        height: 200,
                        padding: { top: 16, right: 16, bottom: 16, left: 16 },
                        layoutMode: 'VERTICAL',
                        itemSpacing: 12
                    }
                }
            ]
        });
        return components;
    }
    // Analyze ProjectElements component
    static analyzeProjectElements() {
        const components = [];
        // Additional components specific to ProjectElements
        components.push({
            id: 'kanban-column',
            name: 'Kanban Column',
            type: 'organism',
            category: 'layout',
            properties: {
                width: 250,
                height: 400,
                cornerRadius: 8,
                padding: { top: 16, right: 16, bottom: 16, left: 16 },
                fills: [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }],
                layoutMode: 'VERTICAL',
                itemSpacing: 8
            },
            variants: [
                { name: 'nowy', properties: { fills: [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }] } },
                { name: 'projektowanie', properties: { fills: [{ type: 'SOLID', color: { r: 1, g: 0.98, b: 0.9 } }] } },
                { name: 'cnc', properties: { fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.95, b: 1 } }] } },
                { name: 'montaz', properties: { fills: [{ type: 'SOLID', color: { r: 0.9, g: 1, b: 0.9 } }] } }
            ]
        });
        components.push({
            id: 'tile-card',
            name: 'Tile Card',
            type: 'organism',
            category: 'card',
            properties: {
                width: 200,
                height: 120,
                cornerRadius: 8,
                padding: { top: 12, right: 12, bottom: 12, left: 12 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                layoutMode: 'VERTICAL',
                itemSpacing: 8
            }
        });
        components.push({
            id: 'form-input',
            name: 'Form Input',
            type: 'molecule',
            category: 'form',
            properties: {
                width: 200,
                height: 32,
                cornerRadius: 6,
                padding: { top: 8, right: 12, bottom: 8, left: 12 },
                fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }],
                text: 'Input text',
                fontSize: 14,
                fontWeight: 'Regular',
                fontFamily: 'Inter'
            },
            variants: [
                { name: 'small', properties: { height: 24, fontSize: 12 } },
                { name: 'large', properties: { height: 40, fontSize: 16 } },
                { name: 'error', properties: { strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.2, b: 0.2 } }] } }
            ]
        });
        return components;
    }
    // Get all components
    static getAllComponents() {
        return [
            ...this.analyzeProjectCard(),
            ...this.analyzeProjectElements()
        ];
    }
    // Get components by type
    static getComponentsByType(type) {
        return this.getAllComponents().filter(component => component.type === type);
    }
    // Get components by category
    static getComponentsByCategory(category) {
        return this.getAllComponents().filter(component => component.category === category);
    }
}
exports.ComponentAnalyzer = ComponentAnalyzer;
