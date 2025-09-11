// DXF layer-to-operation mapping and machine parameters
// Viewer logic normalizes layer names to lowercase before lookup

export type OperationType = 'cut' | 'mill' | 'drill' | 'ignore'

export interface LayerOperation {
    type: OperationType
    speed?: number // m/min for cut/mill
    drillTime?: number // seconds per hole for drill
    depthMm?: number // optional milling depth for partial pockets
}

export interface DxfMachineParams {
    machineMaxSpeed: number // m/min for rapids
    filePrepTime: number // minutes
    materialHandlingTime: number // minutes
    stepdownMm?: number // default pass depth for milling
}

export interface DxfConfig {
    layerOperations: Record<string, LayerOperation>
    machineParams: DxfMachineParams
}

export const dxfConfig: DxfConfig = {
    layerOperations: {
        '_ploter/_wycinanie': { type: 'cut', speed: 15 },
        '_ploter/frez/_plaski/gl_9.0mm': { type: 'mill', speed: 10, depthMm: 9.0 },
        '_ploter/frez/_plaski/gl_8.0mm': { type: 'mill', speed: 10, depthMm: 8.0 },
        '_ploter/frez/_plaski/gl_4.0mm': { type: 'mill', speed: 12, depthMm: 4.0 },
        '_ploter/frez/_plaski/gl_11.1mm': { type: 'mill', speed: 9, depthMm: 11.1 },
        '_ploter/frez/_plaski/gl_6.1mm': { type: 'mill', speed: 11, depthMm: 6.1 },
        '_ploter/frez/_plaski/gl_10.0mm': { type: 'mill', speed: 10, depthMm: 10.0 },
        '_ploter/nazwy': { type: 'mill', speed: 20 },
        '_ploter/otwor/d_4.0mm': { type: 'drill', drillTime: 3 },
        '_ploter/otwor/d_4.0mm/gl_10.0mm': { type: 'drill', drillTime: 4 },
        // Layers to ignore in calculations
        '_material/mdf/18mm/trudnopal': { type: 'ignore' },
        '_opisowe/-opisy': { type: 'ignore' },
        '_ploter/ilosci': { type: 'ignore' },
        '0': { type: 'ignore' },
        'default': { type: 'cut', speed: 12 }
    },
    machineParams: {
        machineMaxSpeed: 25,
        filePrepTime: 15,
        materialHandlingTime: 10,
        stepdownMm: 3.0
    }
}

export function resolveOperation(layerName: string) {
    const raw = (layerName || '')
    const key = raw.toLowerCase()
    // Direct mapping first
    const direct = dxfConfig.layerOperations[key]
    if (direct) return direct

    // Heuristic 1: any layer containing "otwor" is a drill layer
    if (key.includes('otwor')) {
        const anyDrill = Object.values(dxfConfig.layerOperations).find(o => o.type === 'drill')
        return anyDrill || { type: 'drill', drillTime: 3 }
    }

    // Heuristic 2: milling flat with depth variations GL_10mm vs GL_10.0mm
    const m = key.match(/frez\/_plaski\/gl_(\d+(?:\.\d+)?)mm/)
    if (m) {
        const depth = parseFloat(m[1])
        // try to reuse closest predefined speed
        const base = dxfConfig.layerOperations['_ploter/frez/_plaski/gl_10.0mm'] || { type: 'mill', speed: 10 }
        return { type: 'mill', speed: base.speed, depthMm: depth }
    }

    // Heuristic 3: cutting layer marker
    if (key.includes('_wycinanie')) {
        return dxfConfig.layerOperations['_ploter/_wycinanie'] || { type: 'cut', speed: 12 }
    }

    return dxfConfig.layerOperations['default']
}


