// Extended Figma Plugin Types for Enhanced Component Creation
import { ComponentProperty, ComponentPropertyType } from '@figma/plugin-typings';

// Extended Component Property Types
export interface ExtendedComponentProperty extends ComponentProperty {
    binding?: string;
    values?: string[];
    min?: number;
    max?: number;
    defaultValue?: any;
    description?: string;
    hidden?: boolean;
}

// Ant Design to Figma Mapping
export interface AntDesignMapping {
    figmaType: string;
    properties: { [key: string]: ExtendedComponentProperty };
    layout: LayoutConfig;
    constraints?: ConstraintConfig;
    variants?: VariantConfig;
    autoLayout?: AutoLayoutConfig;
}

export interface LayoutConfig {
    autoLayout?: boolean;
    direction?: 'HORIZONTAL' | 'VERTICAL';
    padding?: { top?: number; right?: number; bottom?: number; left?: number };
    gap?: number;
    wrap?: 'NO_WRAP' | 'WRAP';
    primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
    primaryAxisSizingMode?: 'FIXED' | 'AUTO';
    counterAxisSizingMode?: 'FIXED' | 'AUTO';
}

export interface ConstraintConfig {
    horizontal: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
    vertical: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
}

export interface VariantConfig {
    [propertyName: string]: {
        values: string[];
        defaultValue: string;
    };
}

export interface AutoLayoutConfig {
    direction: 'HORIZONTAL' | 'VERTICAL';
    padding: { top: number; right: number; bottom: number; left: number };
    gap: number;
    wrap: 'NO_WRAP' | 'WRAP';
    primaryAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
}

// Design Token Types
export interface FigmaDesignTokens {
    colors: { [key: string]: FigmaColor };
    typography: { [key: string]: FigmaTypography };
    spacing: { [key: string]: number };
    borderRadius: { [key: string]: number };
    shadows: { [key: string]: FigmaShadow };
    breakpoints: { [key: string]: number };
}

export interface FigmaColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface FigmaTypography {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
}

export interface FigmaShadow {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: FigmaColor;
    type: 'DROP_SHADOW' | 'INNER_SHADOW';
}

// Component Creation Types
export interface ComponentCreationOptions {
    name: string;
    description?: string;
    tags?: string[];
    documentationLinks?: { [key: string]: string };
    properties?: ExtendedComponentProperty[];
    variants?: ComponentVariant[];
    autoLayout?: AutoLayoutConfig;
    constraints?: ConstraintConfig;
    fills?: Paint[];
    strokes?: Paint[];
    cornerRadius?: number;
    strokeWeight?: number;
    strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
}

export interface ComponentVariant {
    name: string;
    properties: { [key: string]: any };
    description?: string;
}

export interface Paint {
    type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
    color?: FigmaColor;
    gradientStops?: ColorStop[];
    gradientTransform?: Transform;
    imageHash?: string;
    scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
    imageTransform?: Transform;
    scalingMode?: 'CROP' | 'FILL';
    rotation?: number;
    opacity?: number;
    visible?: boolean;
    blendMode?: BlendMode;
}

export interface ColorStop {
    position: number;
    color: FigmaColor;
}

export interface Transform {
    m00: number;
    m01: number;
    m02: number;
    m10: number;
    m11: number;
    m12: number;
}

export type BlendMode =
    | 'NORMAL'
    | 'DARKEN'
    | 'MULTIPLY'
    | 'LINEAR_BURN'
    | 'COLOR_BURN'
    | 'LIGHTEN'
    | 'SCREEN'
    | 'LINEAR_DODGE'
    | 'COLOR_DODGE'
    | 'OVERLAY'
    | 'SOFT_LIGHT'
    | 'HARD_LIGHT'
    | 'DIFFERENCE'
    | 'EXCLUSION'
    | 'HUE'
    | 'SATURATION'
    | 'COLOR'
    | 'LUMINOSITY';

// Enhanced Component Types
export interface EnhancedComponent {
    id: string;
    name: string;
    type: 'COMPONENT' | 'COMPONENT_SET' | 'FRAME' | 'TEXT' | 'RECTANGLE' | 'ELLIPSE' | 'LINE' | 'VECTOR';
    properties: { [key: string]: any };
    children: EnhancedComponent[];
    parent?: EnhancedComponent;
    figmaNode?: ComponentNode | FrameNode | TextNode | RectangleNode | EllipseNode | LineNode | VectorNode;
    antdMapping?: AntDesignMapping;
    layout?: LayoutConfig;
    constraints?: ConstraintConfig;
    autoLayout?: AutoLayoutConfig;
    variants?: ComponentVariant[];
    documentation?: ComponentDocumentation;
}

export interface ComponentDocumentation {
    description: string;
    usage: string;
    examples: ComponentExample[];
    props: PropDocumentation[];
    variants: VariantDocumentation[];
    relatedComponents: string[];
}

export interface ComponentExample {
    name: string;
    description: string;
    code: string;
    preview?: string;
}

export interface PropDocumentation {
    name: string;
    type: string;
    description: string;
    defaultValue?: any;
    required: boolean;
    examples: any[];
}

export interface VariantDocumentation {
    name: string;
    description: string;
    properties: { [key: string]: any };
    usage: string;
}

// Processing Types
export interface ProcessingOptions {
    createVariants: boolean;
    generateDocumentation: boolean;
    createDesignTokens: boolean;
    optimizeLayout: boolean;
    validateComponents: boolean;
    createComponentSets: boolean;
}

export interface ProcessingResult {
    success: boolean;
    components: EnhancedComponent[];
    errors: ProcessingError[];
    warnings: ProcessingWarning[];
    designTokens?: FigmaDesignTokens;
    documentation?: ComponentDocumentation[];
    statistics: ProcessingStatistics;
}

export interface ProcessingError {
    code: string;
    message: string;
    component?: string;
    line?: number;
    column?: number;
    suggestion?: string;
}

export interface ProcessingWarning {
    code: string;
    message: string;
    component?: string;
    line?: number;
    column?: number;
    suggestion?: string;
}

export interface ProcessingStatistics {
    totalComponents: number;
    successfulComponents: number;
    failedComponents: number;
    totalVariants: number;
    totalProperties: number;
    processingTime: number;
    memoryUsage: number;
}

// Utility Types
export type NodeType =
    | 'DOCUMENT'
    | 'CANVAS'
    | 'FRAME'
    | 'GROUP'
    | 'VECTOR'
    | 'BOOLEAN_OPERATION'
    | 'STAR'
    | 'LINE'
    | 'ELLIPSE'
    | 'REGULAR_POLYGON'
    | 'RECTANGLE'
    | 'TEXT'
    | 'SLICE'
    | 'COMPONENT'
    | 'COMPONENT_SET'
    | 'INSTANCE';

export type ComponentPropertyType =
    | 'BOOLEAN'
    | 'TEXT'
    | 'VARIANT'
    | 'NUMBER'
    | 'COLOR'
    | 'INSTANCE_SWAP';

export type LayoutDirection = 'HORIZONTAL' | 'VERTICAL';
export type ConstraintType = 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
