import { useEffect, useRef, useState } from 'react'
import { dxfConfig } from '../lib/dxfConfig'
import { calculateProductionTime, type DxfEntity } from '../lib/ProductionTimeCalculator'

interface DxfPreviewProps { file?: File | null }

export default function DxfPreview({ file }: DxfPreviewProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [result, setResult] = useState<ReturnType<typeof calculateProductionTime> | null>(null)
    const [sheets, setSheets] = useState<{ count: number; areaM2: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let disposed = false
        async function load() {
            setError(null)
            setResult(null)
            if (!file) return
            try {
                const text = await file.text()
                // Parse using dxf-viewer internal parser API via global import
                // Fallback to dxf-parser if available in bundle
                const { default: Parser } = await import('dxf-parser')
                const parser = new (Parser as any)()
                const dxf = parser.parseSync(text)
                const rawEntities: any[] = dxf?.entities || []

                // Normalize entities to calculator-friendly format
                const entities: DxfEntity[] = rawEntities.map((e: any) => {
                    const type = e.type || e.EntityType || e.entityType
                    return {
                        type,
                        layer: e.layer || e.Layer,
                        name: e.name || e.block || e.BlockName || e.blockName,
                        start: e.start || (e.vertices && e.vertices[0]) || undefined,
                        end: e.end || undefined,
                        vertices: e.vertices || e.points || undefined,
                        closed: Boolean(e.closed || e.shape || e.IsClosed),
                        center: e.center || undefined,
                        radius: e.radius || undefined,
                        startAngle: e.startAngle,
                        endAngle: e.endAngle
                    }
                })

                if (disposed) return
                const r = calculateProductionTime(entities, dxfConfig)
                setResult(r)

                // Minimal rendering placeholder: show counts instead of full WebGL to keep bundle small
                if (canvasRef.current) {
                    canvasRef.current.innerHTML = ''
                    const el = document.createElement('div')
                    el.className = 'p-2 bg-light rounded border'
                    el.textContent = `Załadowano obiektów: ${entities.length}`
                    canvasRef.current.appendChild(el)
                }
            } catch (err: any) {
                setError(err?.message || 'Nie udało się wczytać DXF')
            }
        }
        load()
        return () => { disposed = true }
    }, [file])

    return (
        <div>
            <div ref={canvasRef} style={{ minHeight: 180 }} />
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {result && (
                <div className="mt-3">
                    <div className="card">
                        <div className="card-body p-3">
                            <h6 className="card-title mb-2">Szacowany czas produkcji</h6>
                            <ul className="list-unstyled mb-0 small">
                                <li><strong>Całkowity czas projektu:</strong> {result.totalProjectTimeMin} min</li>
                                <li><strong>Czas maszynowy:</strong> {result.totalMachineTimeMin} min</li>
                                <li><strong>Długość ścieżek:</strong> {result.totalPathLengthM} m</li>
                                <li><strong>Otwory:</strong> {result.totalDrillCount} szt</li>
                            </ul>
                            {/* Sheet estimator input */}
                            <div className="row g-2 mt-3">
                                <div className="col-6">
                                    <label className="form-label small">Szerokość płyty (mm)</label>
                                    <input id="sheet-w" type="number" defaultValue={3050} className="form-control form-control-sm" />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small">Wysokość płyty (mm)</label>
                                    <input id="sheet-h" type="number" defaultValue={2050} className="form-control form-control-sm" />
                                </div>
                            </div>
                            <div className="row g-2 mt-2">
                                <div className="col-6">
                                    <label className="form-label small">Grubość kerfu (mm)</label>
                                    <input id="kerf" type="number" defaultValue={4} className="form-control form-control-sm" />
                                </div>
                                <div className="col-6 d-flex align-items-end justify-content-end">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => {
                                            const w = (document.getElementById('sheet-w') as HTMLInputElement).valueAsNumber || 3050
                                            const h = (document.getElementById('sheet-h') as HTMLInputElement).valueAsNumber || 2050
                                            const areaM2 = (w * h) / 1_000_000
                                            // naive: assume 75% nesting efficiency by default
                                            const efficiency = 0.75
                                            // Use path length as proxy for complexity; 1m path per 0.5m^2 density -> heuristic
                                            const requiredArea = Math.max(areaM2 * 0.00001, (result.totalPathLengthM / 2) / 10) // small floor to avoid 0
                                            const count = Math.max(1, Math.ceil(requiredArea / (areaM2 * efficiency)))
                                            setSheets({ count, areaM2: Math.round(areaM2 * 100) / 100 })
                                        }}
                                    >
                                        Oblicz ilość płyt
                                    </button>
                                </div>
                            </div>
                            {sheets && (
                                <div className="alert alert-info mt-2 py-2">
                                    Szacowana liczba płyt: <strong>{sheets.count}</strong> (pow. płyty: {sheets.areaM2} m², eff=75%)
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


