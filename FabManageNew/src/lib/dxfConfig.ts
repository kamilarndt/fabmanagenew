export interface DxfConfig {
    layerOperations: Record<string, LayerOperation>
    materialSettings: MaterialSettings
    machineParams: MachineParams
    cutSpeed: number // mm/min
    punchSpeed: number // punches/min
    drillSpeed: number // holes/min
    setupTime: number // minutes
}

export interface LayerOperation {
    type: 'cut' | 'punch' | 'drill' | 'engrave' | 'mill'
    speed?: number // mm/min for cut/engrave/mill, operations/min for punch/drill
    depth?: number
    passes?: number
    drillTime?: number // seconds per hole for drill operations
    depthMm?: number // depth in mm for mill operations
}

export interface MachineParams {
    stepdownMm: number // mm per pass for milling
    filePrepTime: number // minutes
    materialHandlingTime: number // minutes
}

export interface MaterialSettings {
    thickness: number // mm
    material: string // 'steel' | 'aluminum' | 'wood' | etc.
    density?: number // kg/m³
}

// Default configuration
export const defaultDxfConfig: DxfConfig = {
    layerOperations: {
        'CUT': {
            type: 'cut',
            speed: 1500 // mm/min
        },
        'PUNCH': {
            type: 'punch',
            speed: 60 // punches/min
        },
        'DRILL': {
            type: 'drill',
            speed: 30, // holes/min
            drillTime: 3 // seconds per hole
        },
        'ENGRAVE': {
            type: 'engrave',
            speed: 800 // mm/min
        },
        'MILL': {
            type: 'mill',
            speed: 600, // mm/min
            depthMm: 3
        }
    },
    materialSettings: {
        thickness: 3,
        material: 'steel'
    },
    machineParams: {
        stepdownMm: 3, // mm per pass
        filePrepTime: 10, // minutes
        materialHandlingTime: 5 // minutes
    },
    cutSpeed: 1500,
    punchSpeed: 60,
    drillSpeed: 30,
    setupTime: 15 // minutes
}

// Helper function to resolve operation from layer name
export function resolveOperation(layerName: string, config: DxfConfig = defaultDxfConfig): LayerOperation {
    const upperLayer = layerName.toUpperCase()

    // Try exact match first
    if (config.layerOperations[upperLayer]) {
        return config.layerOperations[upperLayer]
    }

    // Try pattern matching
    if (upperLayer.includes('CUT') || upperLayer.includes('CUTTING')) {
        return config.layerOperations['CUT'] || { type: 'cut', speed: config.cutSpeed }
    }

    if (upperLayer.includes('PUNCH') || upperLayer.includes('PUNCHING')) {
        return config.layerOperations['PUNCH'] || { type: 'punch', speed: config.punchSpeed }
    }

    if (upperLayer.includes('DRILL') || upperLayer.includes('DRILLING')) {
        return config.layerOperations['DRILL'] || { type: 'drill', speed: config.drillSpeed, drillTime: 3 }
    }

    if (upperLayer.includes('ENGRAV') || upperLayer.includes('ETCH')) {
        return config.layerOperations['ENGRAVE'] || { type: 'engrave', speed: 800 }
    }

    if (upperLayer.includes('MILL') || upperLayer.includes('MILLING')) {
        return config.layerOperations['MILL'] || { type: 'mill', speed: 600, depthMm: 3 }
    }

    // Default to cutting
    return config.layerOperations['CUT'] || { type: 'cut', speed: config.cutSpeed }
}
