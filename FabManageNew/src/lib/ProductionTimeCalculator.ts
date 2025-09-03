import type { DxfConfig } from './dxfConfig'
import { resolveOperation } from './dxfConfig'

export interface DxfEntity {
    type: string
    layer?: string
    // Common geometry fields used by calculator
    start?: { x: number; y: number }
    end?: { x: number; y: number }
    vertices?: { x: number; y: number; bulge?: number }[]
    closed?: boolean
    center?: { x: number; y: number }
    radius?: number
    startAngle?: number
    endAngle?: number
    name?: string // for INSERT block name
}

export interface ProductionCalcResult {
    totalCutTimeMin: number
    totalMillTimeMin: number
    totalDrillCount: number
    totalDrillTimeMin: number
    totalMachineTimeMin: number
    totalProjectTimeMin: number
    totalPathLengthM: number
}

// If DXF units are mm, convert to meters by dividing by 1000.
// Here we assume inputs are in mm from common CAD exports.
const toMeters = (v: number) => v / 1000

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.hypot(dx, dy)
}

function parseDrillDiameterHintMm(layer: string | undefined) {
    if (!layer) return undefined
    const m = /d[_-]?(\d+(?:\.\d+)?)mm/i.exec(layer)
    if (!m) return undefined
    return parseFloat(m[1])
}

function sumPolylineBulgeSweepDeg(vertices: { x: number; y: number; bulge?: number }[], closed: boolean | undefined) {
    if (!vertices || vertices.length < 2) return 0
    let sumDeg = 0
    const n = vertices.length
    const segCount = closed ? n : n - 1
    for (let i = 0; i < segCount; i++) {
        const a = vertices[i]
        const bulge = a.bulge ?? 0
        if (!bulge) continue
        const theta = 4 * Math.atan(bulge) // radians
        sumDeg += Math.abs((theta * 180) / Math.PI)
    }
    return sumDeg
}

export function getLineLength(e: DxfEntity) {
    if (!e.start || !e.end) return 0
    return toMeters(distance(e.start, e.end))
}

export function getPolylineLength(e: DxfEntity) {
    const v = e.vertices || []
    if (v.length < 2) return 0
    let len = 0
    for (let i = 1; i < v.length; i++) len += distance(v[i - 1], v[i])
    if (e.closed) len += distance(v[v.length - 1], v[0])
    return toMeters(len)
}

export function getCircleLength(e: DxfEntity) {
    if (!e.radius) return 0
    return toMeters(2 * Math.PI * e.radius)
}

export function getArcLength(e: DxfEntity) {
    if (!e.radius || e.startAngle === undefined || e.endAngle === undefined) return 0
    // Most DXF libraries provide degrees; convert to radians
    const sweepDeg = Math.abs(e.endAngle - e.startAngle)
    const sweepRad = (sweepDeg * Math.PI) / 180
    return toMeters(sweepRad * e.radius)
}

function getEntityLength(e: DxfEntity) {
    switch (e.type) {
        case 'LINE':
        case 'Line':
            return getLineLength(e)
        case 'LWPOLYLINE':
        case 'POLYLINE':
        case 'Polyline':
            return getPolylineLength(e)
        case 'CIRCLE':
        case 'Circle':
            return getCircleLength(e)
        case 'ARC':
        case 'Arc':
            return getArcLength(e)
        default:
            return 0
    }
}

export function calculateProductionTime(
    entities: DxfEntity[],
    config: DxfConfig
): ProductionCalcResult {
    let totalCutTime = 0
    let totalMillTime = 0
    let totalDrillCount = 0
    let totalPathLength = 0

    // Pre-pass on drill layers: fast count for circles/points/inserts and
    // group arcs by center+radius to detect full circles split into 2x 180° arcs
    const arcGroups: Record<string, number> = {}
    const makeKey = (cx: number, cy: number, r: number) => {
        // round to 0.1 mm for grouping robustness
        const rx = Math.round(cx * 10) / 10
        const ry = Math.round(cy * 10) / 10
        const rr = Math.round(r * 10) / 10
        return `${rx}|${ry}|${rr}`
    }

    for (const entity of entities) {
        const op = resolveOperation(entity.layer || '')
        if (op.type !== 'drill') continue
        const t = (entity.type || '').toUpperCase()
        if (t === 'CIRCLE' || t === 'POINT' || t === 'INSERT') {
            totalDrillCount += 1
            continue
        }
        if (t === 'ARC' && entity.center && typeof entity.radius === 'number' && entity.startAngle !== undefined && entity.endAngle !== undefined) {
            const sweepDeg = Math.abs(entity.endAngle - entity.startAngle) % 360
            const key = makeKey(entity.center.x, entity.center.y, entity.radius)
            arcGroups[key] = (arcGroups[key] || 0) + sweepDeg
        }
    }

    // Convert grouped arc sweeps to hole counts (>= 330° considered a full hole)
    for (const key of Object.keys(arcGroups)) {
        const sumDeg = arcGroups[key]
        if (sumDeg >= 330) {
            const holes = Math.max(1, Math.round(sumDeg / 360))
            totalDrillCount += holes
        }
    }

    for (const entity of entities) {
        const op = resolveOperation(entity.layer || '')
        if (op.type === 'drill') {
            const t = (entity.type || '').toUpperCase()
            if (t === 'POINT' || t === 'CIRCLE' || t === 'INSERT' || t === 'ARC') continue
            // Heuristic: closed small polyline on drill layer -> treat as a hole outline
            if ((t === 'LWPOLYLINE' || t === 'POLYLINE' || t === 'POLYGON') && entity.vertices && entity.vertices.length >= 2) {
                const xs = entity.vertices.map(v => v.x)
                const ys = entity.vertices.map(v => v.y)
                const w = Math.max(...xs) - Math.min(...xs)
                const h = Math.max(...ys) - Math.min(...ys)
                const diaHint = parseDrillDiameterHintMm(entity.layer)
                const diaEstMm = Math.max(w, h)
                // Accept near-circular small shapes (<= 1.6x hint or <= 12mm default)
                const limit = (diaHint ? diaHint * 1.8 : 16)
                const nearCircular = Math.abs(w - h) <= Math.max(0.5, Math.min(w, h) * 0.25)
                const bulgeSum = sumPolylineBulgeSweepDeg(entity.vertices as any, entity.closed)
                const circleByBulge = bulgeSum >= 330
                if ((entity.closed || Math.abs(distance(entity.vertices[0], entity.vertices[entity.vertices.length - 1])) < 0.5)
                    && (nearCircular || circleByBulge) && diaEstMm <= limit) {
                    totalDrillCount += 1
                    continue
                }
            }
            continue
        }
        if ((op as any).type === 'ignore') continue

        const length = getEntityLength(entity)
        if (length <= 0) continue
        totalPathLength += length

        const speed = op.speed || 0
        if (speed > 0) {
            // For milling with specified depth, estimate number of passes using stepdown
            let multiplier = 1
            if (op.type === 'mill' && (op as any).depthMm) {
                const step = config.machineParams.stepdownMm || 3
                multiplier = Math.max(1, Math.ceil(((op as any).depthMm as number) / step))
            }
            const timeMin = (length / speed) * multiplier // minutes
            if (op.type === 'cut') totalCutTime += timeMin
            else if (op.type === 'mill') totalMillTime += timeMin
        }
    }

    // Determine drill time: pick first configured drill layer with drillTime or default to 3s
    const drillOp = Object.values(config.layerOperations).find(l => l.type === 'drill')
    const drillTimeSec = drillOp?.drillTime ?? 3
    const totalDrillTimeMin = (totalDrillCount * drillTimeSec) / 60

    const totalMachineTimeMin = totalCutTime + totalMillTime + totalDrillTimeMin
    const totalProjectTimeMin = totalMachineTimeMin + config.machineParams.filePrepTime + config.machineParams.materialHandlingTime

    return {
        totalCutTimeMin: round(totalCutTime),
        totalMillTimeMin: round(totalMillTime),
        totalDrillCount,
        totalDrillTimeMin: round(totalDrillTimeMin),
        totalMachineTimeMin: round(totalMachineTimeMin),
        totalProjectTimeMin: round(totalProjectTimeMin),
        totalPathLengthM: round(totalPathLength)
    }
}

function round(v: number) {
    return Math.round(v * 100) / 100
}


