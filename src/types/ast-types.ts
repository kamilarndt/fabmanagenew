// Advanced TypeScript AST Types for React/TSX Parsing
export interface ComponentProps {
    [key: string]: any;
}

export interface JSXStructure {
    rootElement: JSXElement | null;
    depth: number;
    components: JSXComponent[];
    textNodes: JSXText[];
}

export interface JSXElement {
    id: string;
    name: string;
    props: { [key: string]: any };
    children: JSXElement[];
    position: { x: number; y: number };
    type: 'element' | 'component' | 'text';
}

export interface JSXComponent {
    id: string;
    name: string;
    props: { [key: string]: any };
    children: JSXComponent[];
    position: { x: number; y: number };
    type: 'component' | 'element' | 'text';
    antdComponent?: string;
    figmaMapping?: FigmaMapping;
}

export interface JSXText {
    content: string;
    position: { x: number; y: number };
    style?: TextStyle;
}

export interface TextStyle {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface ConditionalExpression {
    condition: string;
    trueExpression: string;
    falseExpression: string;
    type: 'ternary' | 'logical' | 'if';
}

export interface DynamicProperty {
    propertyName: string;
    dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
    defaultValue: any;
    sourcePath: string;
    targetElement: string;
    transformation?: string;
    isRequired?: boolean;
}

export interface EventHandler {
    name: string;
    type: 'click' | 'hover' | 'change' | 'focus' | 'blur' | 'submit';
    target: string;
    action: string;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

export interface StyleAnalysis {
    classes: string[];
    inlineStyles: { [key: string]: any };
    themeTokens: string[];
    cssVariables: { [key: string]: string };
    mediaQueries: MediaQuery[];
}

export interface MediaQuery {
    condition: string;
    styles: { [key: string]: any };
}

export interface LayoutAnalysis {
    type: 'flex' | 'grid' | 'absolute' | 'relative' | 'sticky';
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    spacing: number;
    alignment?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export interface ReactComponentAnalysis {
    componentName: string;
    imports: { [library: string]: string[] };
    props: ComponentProps;
    jsx: JSXStructure;
    antdComponents: AntDesignComponent[];
    conditionalRendering: ConditionalExpression[];
    dynamicProps: DynamicProperty[];
    eventHandlers: EventHandler[];
    styling: StyleAnalysis;
    layout: LayoutAnalysis;
    hooks: ReactHook[];
    state: StateVariable[];
    effects: EffectHook[];
}

export interface AntDesignComponent {
    type: string;
    props: { [key: string]: any };
    children: AntDesignComponent[];
    conditionalRender?: string;
    dynamicProps: string[];
    position: { x: number; y: number };
    figmaMapping?: FigmaMapping;
}

export interface ReactHook {
    name: string;
    type: 'useState' | 'useEffect' | 'useCallback' | 'useMemo' | 'useRef' | 'useContext';
    dependencies?: string[];
    returnType?: string;
}

export interface StateVariable {
    name: string;
    type: string;
    initialValue: any;
    setter: string;
}

export interface EffectHook {
    name: string;
    dependencies: string[];
    cleanup?: string;
    async?: boolean;
}

export interface FigmaMapping {
    componentType: 'frame' | 'text' | 'rectangle' | 'ellipse' | 'line' | 'vector';
    properties: { [key: string]: any };
    variants: { [key: string]: any };
    constraints: {
        horizontal: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
        vertical: 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
    };
    autoLayout?: {
        direction: 'HORIZONTAL' | 'VERTICAL';
        padding: { top: number; right: number; bottom: number; left: number };
        gap: number;
    };
}

export interface ParsedStructure {
    components: ReactComponentAnalysis[];
    designTokens: DesignTokens;
    imports: string[];
    exports: string[];
    errors: ParseError[];
    warnings: ParseWarning[];
}

export interface DesignTokens {
    colors: { [key: string]: string };
    typography: { [key: string]: TypographyToken };
    spacing: { [key: string]: number };
    borderRadius: { [key: string]: number };
    shadows: { [key: string]: ShadowToken };
    breakpoints: { [key: string]: number };
}

export interface TypographyToken {
    fontSize: number;
    fontWeight: number | string;
    fontFamily: string;
    lineHeight?: number;
    letterSpacing?: number;
}

export interface ShadowToken {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadRadius: number;
    color: string;
}

export interface ParseError {
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'warning' | 'info';
    code: string;
    suggestion?: string;
}

export interface ParseWarning {
    message: string;
    line: number;
    column: number;
    code: string;
    suggestion?: string;
}

// Utility types
export type ComponentType = 'atom' | 'molecule' | 'organism' | 'template' | 'page';
export type PropertyType = 'BOOLEAN' | 'TEXT' | 'VARIANT' | 'NUMBER' | 'COLOR' | 'INSTANCE_SWAP';
export type LayoutDirection = 'HORIZONTAL' | 'VERTICAL';
export type ConstraintType = 'MIN' | 'MAX' | 'STRETCH' | 'CENTER' | 'SCALE';
