import { callEdgeFunction } from '../lib/httpClient'
import type { TileMaterial } from '../types/tiles.types'

export type SpeckleObjectGeometry = {
    objectId: string
    bbox?: {
        minX: number
        minY: number
        minZ: number
        maxX: number
        maxY: number
        maxZ: number
    }
    volume?: number
    area?: number
    type?: string
}

export type MaterialAssignmentRequest = {
    tileId: string
    objectIds: string[]
    materialId: string
    streamUrl?: string
    geometryData?: SpeckleObjectGeometry[]
}

export type MaterialAssignmentResponse = {
    success: boolean
    assignments: TileMaterial[]
    estimatedPlates?: number
    totalVolume?: number
    totalArea?: number
    error?: string
}

export type BOMGenerationRequest = {
    tileId: string
    streamUrl?: string
    materialAssignments: {
        objectId: string
        materialId: string
        geometry?: SpeckleObjectGeometry
    }[]
}

export type BOMGenerationResponse = {
    success: boolean
    bom: {
        materialId: string
        materialName: string
        totalQuantity: number
        unit: string
        estimatedPlates: number
        wastePercentage: number
        cost?: number
    }[]
    error?: string
}

/**
 * Assign material to selected Speckle objects
 */
export async function assignMaterialToObjects(
    tileId: string,
    objectIds: string[],
    materialId: string,
    streamUrl?: string,
    geometryData?: SpeckleObjectGeometry[]
): Promise<MaterialAssignmentResponse> {
    try {
        const request: MaterialAssignmentRequest = {
            tileId,
            objectIds,
            materialId,
            streamUrl,
            geometryData
        }

        const response = await callEdgeFunction<MaterialAssignmentResponse>(
            'assign-material-to-objects',
            request
        )

        return response
    } catch (error) {
        console.error('Failed to assign material to objects:', error)
        return {
            success: false,
            assignments: [],
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Generate BOM from material assignments
 */
export async function generateBOMFromAssignments(
    tileId: string,
    materialAssignments: BOMGenerationRequest['materialAssignments'],
    streamUrl?: string
): Promise<BOMGenerationResponse> {
    try {
        const request: BOMGenerationRequest = {
            tileId,
            streamUrl,
            materialAssignments
        }

        const response = await callEdgeFunction<BOMGenerationResponse>(
            'generate-bom-from-assignments',
            request
        )

        return response
    } catch (error) {
        console.error('Failed to generate BOM:', error)
        return {
            success: false,
            bom: [],
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Get geometry data for Speckle objects
 */
export async function getObjectGeometry(
    streamUrl: string,
    objectIds: string[]
): Promise<SpeckleObjectGeometry[]> {
    try {
        const response = await callEdgeFunction<SpeckleObjectGeometry[]>(
            'get-speckle-object-geometry',
            { streamUrl, objectIds }
        )

        return response
    } catch (error) {
        console.error('Failed to get object geometry:', error)
        return []
    }
}

/**
 * Calculate plate estimation for given geometry and material
 */
export function calculatePlateEstimation(
    geometry: SpeckleObjectGeometry,
    materialDimensions: { width: number; height: number; thickness?: number },
    wastePercentage: number = 15
): {
    estimatedPlates: number
    totalArea: number
    wasteArea: number
} {
    const { bbox } = geometry

    if (!bbox) {
        return { estimatedPlates: 0, totalArea: 0, wasteArea: 0 }
    }

    // Calculate bounding box dimensions
    const dx = Math.max(0, bbox.maxX - bbox.minX)
    const dy = Math.max(0, bbox.maxY - bbox.minY)
    const dz = Math.max(0, bbox.maxZ - bbox.minZ)

    // Calculate surface area (simplified - assumes rectangular faces)
    const totalArea = 2 * (dx * dy + dx * dz + dy * dz)

    // Calculate how many plates are needed
    const plateArea = materialDimensions.width * materialDimensions.height
    const requiredArea = totalArea * (1 + wastePercentage / 100)
    const estimatedPlates = Math.ceil(requiredArea / plateArea)

    const wasteArea = requiredArea - totalArea

    return {
        estimatedPlates,
        totalArea,
        wasteArea
    }
}

/**
 * Extract stream and commit info from Speckle URL
 */
export function parseSpeckleUrl(url: string): {
    server: string
    streamId?: string
    commitId?: string
    objectId?: string
} | null {
    try {
        const u = new URL(url)
        const parts = u.pathname.split('/').filter(Boolean)
        const server = `${u.protocol}//${u.host}`

        let streamId: string | undefined
        let commitId: string | undefined
        let objectId: string | undefined

        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === 'streams' && parts[i + 1]) streamId = parts[i + 1]
            if (parts[i] === 'commits' && parts[i + 1]) commitId = parts[i + 1]
            if (parts[i] === 'objects' && parts[i + 1]) objectId = parts[i + 1]
        }

        return { server, streamId, commitId, objectId }
    } catch {
        return null
    }
}

/**
 * Create tile from Speckle object selection
 */
export async function createTileFromSpeckleSelection(
    projectId: string,
    objectIds: string[],
    streamUrl: string,
    tileName?: string
): Promise<{ success: boolean; tileId?: string; error?: string }> {
    try {
        const response = await callEdgeFunction<{ success: boolean; tileId?: string; error?: string }>(
            'create-tile-from-speckle-selection',
            {
                projectId,
                objectIds,
                streamUrl,
                tileName: tileName || `Element z selekcji (${objectIds.length} obiektów)`
            }
        )

        return response
    } catch (error) {
        console.error('Failed to create tile from selection:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

