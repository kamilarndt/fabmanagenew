// Atomic Design Types for Figma Plugin

export interface AtomicComponent {
    id: string
    name: string
    type: 'atom' | 'molecule' | 'organism'
    category: string
    properties: ComponentProperties
    children?: AtomicComponent[]
    variants?: ComponentVariant[]
}

export interface ComponentProperties {
    // Layout
    width?: number
    height?: number
    padding?: Spacing
    margin?: Spacing
    layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
    itemSpacing?: number

    // Visual
    fills?: Paint[]
    strokes?: Paint[]
    cornerRadius?: number
    effects?: Effect[]

    // Typography
    fontFamily?: string
    fontSize?: number
    fontWeight?: string
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT'
    lineHeight?: number | { unit: 'AUTO' | 'PERCENT' | 'PIXELS', value: number }

    // Content
    text?: string
    icon?: string
    image?: string
}

export interface ComponentVariant {
    name: string
    properties: Partial<ComponentProperties>
}

export interface Spacing {
    top: number
    right: number
    bottom: number
    left: number
}

export interface Fill {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE'
    color?: RGB
    gradientStops?: GradientStop[]
    gradientTransform?: number[][]
    imageHash?: string
}

export interface Stroke {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR'
    color: RGB
    weight: number
    align: 'INSIDE' | 'OUTSIDE' | 'CENTER'
}

export interface Effect {
    type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR'
    visible: boolean
    color?: RGBA
    offset?: { x: number, y: number }
    radius: number
    spread?: number
    blendMode?: 'NORMAL' | 'DARKEN' | 'MULTIPLY' | 'LINEAR_BURN' | 'COLOR_BURN' | 'LIGHTEN' | 'SCREEN' | 'LINEAR_DODGE' | 'COLOR_DODGE' | 'OVERLAY' | 'SOFT_LIGHT' | 'HARD_LIGHT' | 'DIFFERENCE' | 'EXCLUSION' | 'HUE' | 'SATURATION' | 'COLOR' | 'LUMINOSITY'
}

export interface RGB {
    r: number
    g: number
    b: number
}

export interface RGBA extends RGB {
    a: number
}

export interface GradientStop {
    color: RGB
    position: number
}

// FabManage specific types
export interface ProjectCardData {
    name: string
    numer: string
    status: 'nowy' | 'projektowanie' | 'cnc' | 'montaz'
    typ: string
    lokalizacja: string
    client: string
    deadline: string
    progress: number
    modules: string[]
    tilesCount: number
    manager?: string
    miniatura?: string
}

export interface ProjectElementsData {
    project: ProjectCardData
    tiles: TileData[]
    groups: GroupData[]
}

export interface TileData {
    id: string
    name: string
    status: string
    group?: string
    bom: BomItem[]
    laborCost: number
}

export interface GroupData {
    id: string
    name: string
    tiles: TileData[]
}

export interface BomItem {
    materialId: string
    quantity: number
    unit: string
    cost: number
}

// Design System Configuration
export interface DesignSystemConfig {
    colors: ColorPalette
    typography: TypographyConfig
    spacing: SpacingConfig
    effects: EffectsConfig
}

export interface ColorPalette {
    primary: RGB
    secondary: RGB
    success: RGB
    warning: RGB
    error: RGB
    info: RGB
    text: {
        primary: RGB
        secondary: RGB
        disabled: RGB
    }
    background: {
        primary: RGB
        secondary: RGB
        tertiary: RGB
    }
    border: {
        primary: RGB
        secondary: RGB
    }
}

export interface TypographyConfig {
    fontFamily: string
    sizes: Record<string, number>
    weights: Record<string, string>
    lineHeights: Record<string, number>
}

export interface SpacingConfig {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
}

export interface EffectsConfig {
    shadows: {
        sm: Effect
        md: Effect
        lg: Effect
        xl: Effect
    }
    borderRadius: {
        sm: number
        md: number
        lg: number
        xl: number
    }
}
