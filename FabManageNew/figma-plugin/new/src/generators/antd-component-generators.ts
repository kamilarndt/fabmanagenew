import { AntdDesignSystem } from '../config/antd-design-system'
import { FABMANAGE_DESIGN_SYSTEM, getStatusColor, getProjectTypeColor } from '../config/design-system'

// Generatory komponentów Ant Design dla Figmy - dokładne odwzorowanie z aplikacji
export class AntdComponentGenerators {

    // Generowanie Card (z Ant Design)
    static async createAntdCard(properties: {
        title?: string
        hoverable?: boolean
        size?: 'default' | 'small'
        bordered?: boolean
        className?: string
    } = {}): Promise<FrameNode> {
        const card = figma.createFrame()
        card.name = 'Antd Card'
        card.resize(300, 200)
        card.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-md')
        card.fills = [AntdDesignSystem.createFillFromVariable('background-primary')]

        if (properties.bordered !== false) {
            card.strokes = [AntdDesignSystem.createStrokeFromVariable('border-primary', 1)]
        }

        if (properties.hoverable) {
            card.effects = [FABMANAGE_DESIGN_SYSTEM.effects.shadows.sm as Effect]
        }

        // Padding based on size
        const padding = properties.size === 'small' ? 12 : 16
        card.paddingTop = padding
        card.paddingRight = padding
        card.paddingBottom = padding
        card.paddingLeft = padding

        // Add title if provided
        if (properties.title) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
            const title = figma.createText()
            title.characters = properties.title
            title.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-lg')
            title.fontName = { family: 'Inter', style: 'Medium' }
            title.fills = [AntdDesignSystem.createFillFromVariable('text-primary')]
            title.x = padding
            title.y = padding
            card.appendChild(title)
        }

        return card
    }

    // Generowanie Button (z Ant Design)
    static async createAntdButton(properties: {
        type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
        size?: 'small' | 'middle' | 'large'
        shape?: 'default' | 'circle' | 'round'
        icon?: string
        children?: string
        disabled?: boolean
    } = {}): Promise<FrameNode> {
        const button = figma.createFrame()
        button.name = 'Antd Button'

        // Size calculations
        const sizes = {
            small: { height: 24, padding: 8, fontSize: 12 },
            middle: { height: 32, padding: 12, fontSize: 14 },
            large: { height: 40, padding: 16, fontSize: 16 }
        }

        const size = sizes[properties.size || 'middle']
        button.resize(80, size.height)

        // Shape handling
        if (properties.shape === 'round') {
            button.cornerRadius = size.height / 2
        } else if (properties.shape === 'circle') {
            button.resize(size.height, size.height)
            button.cornerRadius = size.height / 2
        } else {
            button.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-sm')
        }

        // Type styling
        switch (properties.type || 'default') {
            case 'primary':
                button.fills = [AntdDesignSystem.createFillFromVariable('primary')]
                break
            case 'dashed':
                button.fills = []
                button.strokes = [{
                    type: 'SOLID',
                    color: AntdDesignSystem.getVariableValue('border-primary') || { r: 0.9, g: 0.9, b: 0.9 },
                }]
                break
            case 'text':
                button.fills = []
                break
            case 'link':
                button.fills = []
                break
            default:
                button.fills = [AntdDesignSystem.createFillFromVariable('background-primary')]
                button.strokes = [AntdDesignSystem.createStrokeFromVariable('border-primary', 1)]
        }

        // Add text
        if (properties.children) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
            const text = figma.createText()
            text.characters = properties.children
            text.fontSize = size.fontSize
            text.fontName = { family: 'Inter', style: 'Medium' }

            // Text color based on type
            if (properties.type === 'primary') {
                text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
            } else {
                text.fills = [AntdDesignSystem.createFillFromVariable('text-primary')]
            }

            // Center text
            text.x = (button.width - text.width) / 2
            text.y = (button.height - text.height) / 2
            button.appendChild(text)
        }

        // Disabled state
        if (properties.disabled) {
            button.opacity = 0.4
        }

        return button
    }

    // Generowanie Progress (z Ant Design)
    static async createAntdProgress(properties: {
        percent?: number
        size?: 'default' | 'small'
        status?: 'success' | 'exception' | 'active' | 'normal'
        strokeColor?: string | { from: string, to: string }
        showInfo?: boolean
    } = {}): Promise<FrameNode> {
        const container = figma.createFrame()
        container.name = 'Antd Progress'
        container.resize(200, properties.size === 'small' ? 8 : 12)
        container.fills = []

        // Progress track
        const track = figma.createFrame()
        track.name = 'Progress Track'
        track.resize(container.width, container.height)
        track.cornerRadius = container.height / 2
        track.fills = [AntdDesignSystem.createFillFromVariable('background-tertiary')]
        container.appendChild(track)

        // Progress fill
        const fill = figma.createFrame()
        fill.name = 'Progress Fill'
        const percent = properties.percent || 0
        fill.resize((container.width * percent) / 100, container.height)
        fill.cornerRadius = container.height / 2

        // Stroke color based on status
        let fillColor = AntdDesignSystem.getVariableValue('primary') || { r: 0.2, g: 0.6, b: 1 }

        if (properties.status === 'success') {
            fillColor = AntdDesignSystem.getVariableValue('success') || { r: 0.2, g: 0.8, b: 0.3 }
        } else if (properties.status === 'exception') {
            fillColor = AntdDesignSystem.getVariableValue('error') || { r: 0.9, g: 0.2, b: 0.2 }
        }

        if (properties.strokeColor && typeof properties.strokeColor === 'object') {
            // Gradient
            fill.fills = [{
                type: 'GRADIENT_LINEAR',
                gradientStops: [
                    { color: { r: 0.06, g: 0.56, b: 0.91, a: 1 }, position: 0 },
                    { color: { r: 0.53, g: 0.82, b: 0.41, a: 1 }, position: 1 }
                ],
                gradientTransform: [[1, 0, 0], [0, 1, 0]]
            }]
        } else {
            fill.fills = [{ type: 'SOLID', color: fillColor }]
        }

        container.appendChild(fill)

        // Show info
        if (properties.showInfo !== false) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
            const info = figma.createText()
            info.characters = `${percent}%`
            info.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            info.fontName = { family: 'Inter', style: 'Regular' }
            info.fills = [AntdDesignSystem.createFillFromVariable('text-secondary')]
            info.x = container.width + 8
            info.y = (container.height - info.height) / 2
            container.appendChild(info)
        }

        return container
    }

    // Generowanie Tag (z Ant Design)
    static async createAntdTag(properties: {
        color?: string
        closable?: boolean
        children?: string
    } = {}): Promise<FrameNode> {
        const tag = figma.createFrame()
        tag.name = 'Antd Tag'
        tag.resize(60, 24)
        tag.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-sm')
        tag.paddingTop = 4
        tag.paddingRight = 8
        tag.paddingBottom = 4
        tag.paddingLeft = 8

        // Color handling
        let fillColor = AntdDesignSystem.getVariableValue('background-tertiary') || { r: 0.95, g: 0.95, b: 0.95 }
        let textColor = AntdDesignSystem.getVariableValue('text-primary') || { r: 0.1, g: 0.1, b: 0.1 }

        if (properties.color) {
            const colorMap: Record<string, { fill: any, text: any }> = {
                'blue': { fill: { r: 0.2, g: 0.6, b: 1 }, text: { r: 1, g: 1, b: 1 } },
                'green': { fill: { r: 0.2, g: 0.8, b: 0.3 }, text: { r: 1, g: 1, b: 1 } },
                'orange': { fill: { r: 1, g: 0.6, b: 0.2 }, text: { r: 1, g: 1, b: 1 } },
                'red': { fill: { r: 0.9, g: 0.2, b: 0.2 }, text: { r: 1, g: 1, b: 1 } },
                'purple': { fill: { r: 0.6, g: 0.2, b: 0.8 }, text: { r: 1, g: 1, b: 1 } }
            }

            if (colorMap[properties.color]) {
                fillColor = colorMap[properties.color].fill
                textColor = colorMap[properties.color].text
            }
        }

        tag.fills = [{ type: 'SOLID', color: fillColor }]

        // Add text
        if (properties.children) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
            const text = figma.createText()
            text.characters = properties.children
            text.fontSize = AntdDesignSystem.getFontSizeFromVariable('font-size-sm')
            text.fontName = { family: 'Inter', style: 'Regular' }
            text.fills = [{ type: 'SOLID', color: textColor }]
            text.x = (tag.width - text.width) / 2
            text.y = (tag.height - text.height) / 2
            tag.appendChild(text)
        }

        return tag
    }

    // Generowanie Avatar (z Ant Design)
    static async createAntdAvatar(properties: {
        size?: 'small' | 'default' | 'large' | number
        shape?: 'circle' | 'square'
        src?: string
        icon?: string
        children?: string
    } = {}): Promise<FrameNode> {
        const avatar = figma.createFrame()
        avatar.name = 'Antd Avatar'

        // Size handling
        let size = 32
        if (typeof properties.size === 'number') {
            size = properties.size
        } else {
            const sizes = { small: 24, default: 32, large: 40 }
            size = sizes[properties.size || 'default']
        }

        avatar.resize(size, size)

        // Shape handling
        if (properties.shape === 'circle') {
            avatar.cornerRadius = size / 2
        } else {
            avatar.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-sm')
        }

        avatar.fills = [AntdDesignSystem.createFillFromVariable('background-tertiary')]

        // Add content
        if (properties.children) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
            const text = figma.createText()
            text.characters = properties.children.charAt(0).toUpperCase()
            text.fontSize = size * 0.4
            text.fontName = { family: 'Inter', style: 'Medium' }
            text.fills = [AntdDesignSystem.createFillFromVariable('text-primary')]
            text.x = (avatar.width - text.width) / 2
            text.y = (avatar.height - text.height) / 2
            avatar.appendChild(text)
        }

        return avatar
    }

    // Generowanie Typography (z Ant Design)
    static async createAntdTypography(properties: {
        level?: 1 | 2 | 3 | 4 | 5
        type?: 'secondary' | 'success' | 'warning' | 'danger'
        children?: string
        strong?: boolean
        italic?: boolean
        underline?: boolean
        delete?: boolean
    } = {}): Promise<TextNode> {
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

        const text = figma.createText()
        text.name = 'Antd Typography'
        text.characters = properties.children || 'Text'

        // Level handling
        const levels = {
            1: { fontSize: 38, fontWeight: 'Bold' },
            2: { fontSize: 30, fontWeight: 'Bold' },
            3: { fontSize: 24, fontWeight: 'Bold' },
            4: { fontSize: 20, fontWeight: 'Bold' },
            5: { fontSize: 16, fontWeight: 'Bold' }
        }

        const level = levels[properties.level || 1]
        text.fontSize = level.fontSize
        text.fontName = { family: 'Inter', style: level.fontWeight }

        // Type handling
        let textColor = AntdDesignSystem.getVariableValue('text-primary') || { r: 0.1, g: 0.1, b: 0.1 }

        if (properties.type === 'secondary') {
            textColor = AntdDesignSystem.getVariableValue('text-secondary') || { r: 0.4, g: 0.4, b: 0.4 }
        } else if (properties.type === 'success') {
            textColor = AntdDesignSystem.getVariableValue('success') || { r: 0.2, g: 0.8, b: 0.3 }
        } else if (properties.type === 'warning') {
            textColor = AntdDesignSystem.getVariableValue('warning') || { r: 1, g: 0.7, b: 0.2 }
        } else if (properties.type === 'danger') {
            textColor = AntdDesignSystem.getVariableValue('error') || { r: 0.9, g: 0.2, b: 0.2 }
        }

        text.fills = [{ type: 'SOLID', color: textColor }]

        // Style handling
        if (properties.strong) {
            text.fontName = { family: 'Inter', style: 'Bold' }
        }

        if (properties.italic) {
            text.fontName = { family: 'Inter', style: 'Italic' }
        }

        if (properties.underline) {
            text.textDecoration = 'UNDERLINE'
        }

        if (properties.delete) {
            text.textDecoration = 'STRIKETHROUGH'
        }

        return text
    }

    // Generowanie Space (z Ant Design)
    static createAntdSpace(properties: {
        size?: 'small' | 'middle' | 'large' | number
        direction?: 'horizontal' | 'vertical'
        align?: 'start' | 'end' | 'center' | 'baseline'
    } = {}): FrameNode {
        const space = figma.createFrame()
        space.name = 'Antd Space'

        // Size handling
        let size = 8
        if (typeof properties.size === 'number') {
            size = properties.size
        } else {
            const sizes = { small: 8, middle: 16, large: 24 }
            size = sizes[properties.size || 'middle']
        }

        if (properties.direction === 'vertical') {
            space.resize(1, size)
        } else {
            space.resize(size, 1)
        }

        space.fills = [] // Transparent

        return space
    }

    // Generowanie Input (z Ant Design)
    static async createAntdInput(properties: {
        placeholder?: string
        size?: 'small' | 'middle' | 'large'
        status?: 'error' | 'warning'
        disabled?: boolean
        prefix?: string
        suffix?: string
    } = {}): Promise<FrameNode> {
        const input = figma.createFrame()
        input.name = 'Antd Input'

        // Size handling
        const sizes = {
            small: { height: 24, padding: 8, fontSize: 12 },
            middle: { height: 32, padding: 12, fontSize: 14 },
            large: { height: 40, padding: 16, fontSize: 16 }
        }

        const size = sizes[properties.size || 'middle']
        input.resize(200, size.height)
        input.cornerRadius = AntdDesignSystem.getBorderRadiusFromVariable('border-radius-sm')
        input.paddingTop = 0
        input.paddingRight = size.padding
        input.paddingBottom = 0
        input.paddingLeft = size.padding

        // Background
        input.fills = [AntdDesignSystem.createFillFromVariable('background-primary')]

        // Border based on status
        if (properties.status === 'error') {
            input.strokes = [AntdDesignSystem.createStrokeFromVariable('error', 1)]
        } else if (properties.status === 'warning') {
            input.strokes = [AntdDesignSystem.createStrokeFromVariable('warning', 1)]
        } else {
            input.strokes = [AntdDesignSystem.createStrokeFromVariable('border-primary', 1)]
        }

        // Add placeholder text
        if (properties.placeholder) {
            await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
            const placeholder = figma.createText()
            placeholder.characters = properties.placeholder
            placeholder.fontSize = size.fontSize
            placeholder.fontName = { family: 'Inter', style: 'Regular' }
            placeholder.fills = [AntdDesignSystem.createFillFromVariable('text-disabled')]
            placeholder.x = size.padding
            placeholder.y = (input.height - placeholder.height) / 2
            input.appendChild(placeholder)
        }

        // Disabled state
        if (properties.disabled) {
            input.opacity = 0.4
        }

        return input
    }
}
