import type { AtomicComponent, ComponentProperties } from '../types/atomic-design'
import { FABMANAGE_DESIGN_SYSTEM } from '../config/design-system'
import { AtomGenerators } from './atom-generators'

// Molecule Generators - Create composite UI elements in Figma
export class MoleculeGenerators {

    // Generate Card component
    static async createCard(properties: ComponentProperties): Promise<FrameNode> {
        const card = figma.createFrame()
        card.name = 'Card'
        card.resize(properties.width || 300, properties.height || 200)
        card.cornerRadius = properties.cornerRadius || 8

        if (properties.padding) {
            card.paddingTop = properties.padding.top
            card.paddingRight = properties.padding.right
            card.paddingBottom = properties.padding.bottom
            card.paddingLeft = properties.padding.left
        }

        if (properties.layoutMode) {
            card.layoutMode = properties.layoutMode
        }

        if (properties.itemSpacing) {
            card.itemSpacing = properties.itemSpacing
        }

        if (properties.fills && properties.fills.length > 0) {
            card.fills = properties.fills
        } else {
            card.fills = [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.primary }]
        }

        if (properties.strokes && properties.strokes.length > 0) {
            card.strokes = properties.strokes
        }

        if (properties.effects && properties.effects.length > 0) {
            card.effects = properties.effects as Effect[]
        } else {
            // Default shadow
            card.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.md as Effect]
        }

        return card
    }

    // Generate Form Input component
    static async createFormInput(properties: ComponentProperties): Promise<FrameNode> {
        const input = figma.createFrame()
        input.name = 'Form Input'
        input.resize(properties.width || 200, properties.height || 32)
        input.cornerRadius = properties.cornerRadius || 6

        if (properties.padding) {
            input.paddingTop = properties.padding.top
            input.paddingRight = properties.padding.right
            input.paddingBottom = properties.padding.bottom
            input.paddingLeft = properties.padding.left
        }

        if (properties.fills && properties.fills.length > 0) {
            input.fills = properties.fills
        } else {
            input.fills = [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.primary }]
        }

        if (properties.strokes && properties.strokes.length > 0) {
            input.strokes = properties.strokes
        } else {
            input.strokes = [{
                type: 'SOLID',
                color: FABMANAGE_DESIGN_SYSTEM.colors.border.primary,
            }]
        }

        // Add placeholder text
        if (properties.text) {
            const textNode = await AtomGenerators.createText({
                text: properties.text,
                fontSize: properties.fontSize || 14,
                fontWeight: properties.fontWeight || 'Regular',
                fontFamily: properties.fontFamily || 'Inter',
                fills: [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.text.secondary }]
            })

            textNode.x = properties.padding?.left || 12
            textNode.y = (input.height - textNode.height) / 2

            input.appendChild(textNode)
        }

        return input
    }

    // Generate Space component (layout helper)
    static createSpace(properties: ComponentProperties): FrameNode {
        const space = figma.createFrame()
        space.name = 'Space'
        space.resize(properties.width || 16, properties.height || 16)
        space.fills = [] // Transparent

        return space
    }

    // Generate Project Thumbnail component
    static async createProjectThumbnail(properties: ComponentProperties): Promise<FrameNode> {
        const thumbnail = figma.createFrame()
        thumbnail.name = 'Project Thumbnail'
        thumbnail.resize(properties.width || 350, properties.height || 200)
        thumbnail.cornerRadius = properties.cornerRadius || 12

        if (properties.fills && properties.fills.length > 0) {
            thumbnail.fills = properties.fills
        } else {
            // Default gradient
            thumbnail.fills = [{
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    { color: { r: 0.4, g: 0.5, b: 0.9, a: 1 }, position: 0 },
                    { color: { r: 0.5, g: 0.3, b: 0.6, a: 1 }, position: 1 }
                ],
                gradientTransform: [
                    [1, 0, 0],
                    [0, 1, 0]
                ]
            }]
        }

        // Add placeholder icon
        const icon = await AtomGenerators.createText({
            text: '🖼️',
            fontSize: 32,
            fontFamily: 'Inter',
            fontWeight: 'Regular',
            textAlign: 'CENTER',
            fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
        })

        icon.x = (thumbnail.width - icon.width) / 2
        icon.y = (thumbnail.height - icon.height) / 2

        thumbnail.appendChild(icon)

        return thumbnail
    }

    // Generate Project Content component
    static async createProjectContent(properties: ComponentProperties): Promise<FrameNode> {
        const content = figma.createFrame()
        content.name = 'Project Content'
        content.resize(properties.width || 350, properties.height || 200)

        if (properties.padding) {
            content.paddingTop = properties.padding.top
            content.paddingRight = properties.padding.right
            content.paddingBottom = properties.padding.bottom
            content.paddingLeft = properties.padding.left
        }

        if (properties.layoutMode) {
            content.layoutMode = properties.layoutMode
        }

        if (properties.itemSpacing) {
            content.itemSpacing = properties.itemSpacing
        }

        content.fills = [] // Transparent

        return content
    }

    // Generate Kanban Column component
    static async createKanbanColumn(properties: ComponentProperties): Promise<FrameNode> {
        const column = figma.createFrame()
        column.name = 'Kanban Column'
        column.resize(properties.width || 250, properties.height || 400)
        column.cornerRadius = properties.cornerRadius || 8

        if (properties.padding) {
            column.paddingTop = properties.padding.top
            column.paddingRight = properties.padding.right
            column.paddingBottom = properties.padding.bottom
            column.paddingLeft = properties.padding.left
        }

        if (properties.layoutMode) {
            column.layoutMode = properties.layoutMode
        }

        if (properties.itemSpacing) {
            column.itemSpacing = properties.itemSpacing
        }

        if (properties.fills && properties.fills.length > 0) {
            column.fills = properties.fills
        } else {
            column.fills = [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.secondary }]
        }

        return column
    }

    // Generate Tile Card component
    static async createTileCard(properties: ComponentProperties): Promise<FrameNode> {
        const tileCard = figma.createFrame()
        tileCard.name = 'Tile Card'
        tileCard.resize(properties.width || 200, properties.height || 120)
        tileCard.cornerRadius = properties.cornerRadius || 8

        if (properties.padding) {
            tileCard.paddingTop = properties.padding.top
            tileCard.paddingRight = properties.padding.right
            tileCard.paddingBottom = properties.padding.bottom
            tileCard.paddingLeft = properties.padding.left
        }

        if (properties.layoutMode) {
            tileCard.layoutMode = properties.layoutMode
        }

        if (properties.itemSpacing) {
            tileCard.itemSpacing = properties.itemSpacing
        }

        if (properties.fills && properties.fills.length > 0) {
            tileCard.fills = properties.fills
        } else {
            tileCard.fills = [{ type: 'SOLID', color: FABMANAGE_DESIGN_SYSTEM.colors.background.primary }]
        }

        if (properties.effects && properties.effects.length > 0) {
            tileCard.effects = properties.effects as Effect[]
        } else {
            tileCard.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.sm as Effect]
        }

        return tileCard
    }

    // Generate all molecule variants for a component
    static async generateMoleculeVariants(component: AtomicComponent): Promise<FrameNode[]> {
        const variants: FrameNode[] = []

        if (!component.variants) return variants

        for (const variant of component.variants) {
            const mergedProperties = { ...component.properties, ...variant.properties }
            let variantNode: FrameNode

            switch (component.id) {
                case 'card':
                    variantNode = await this.createCard(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'form-input':
                    variantNode = await this.createFormInput(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'space':
                    variantNode = this.createSpace(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'project-thumbnail':
                    variantNode = await this.createProjectThumbnail(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'project-content':
                    variantNode = await this.createProjectContent(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'kanban-column':
                    variantNode = await this.createKanbanColumn(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                case 'tile-card':
                    variantNode = await this.createTileCard(mergedProperties)
                    variantNode.name = `${component.name} - ${variant.name}`
                    break

                default:
                    continue
            }

            variants.push(variantNode)
        }

        return variants
    }
}
