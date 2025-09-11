import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsStore } from '../stores/projectsStore'
import { useTilesStore } from '../stores/tilesStore'

type Suggestion = { type: 'project' | 'tile'; id: string; label: string; route?: string }

export default function GlobalSearch() {
    const { projects } = useProjectsStore()
    const { tiles } = useTilesStore()
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem('global_search_history') || '[]'))
    const nav = useNavigate()
    const ref = useRef<HTMLDivElement | null>(null)

    const suggestions = useMemo<Suggestion[]>(() => {
        const q = query.toLowerCase()
        const p = projects
            .filter(pr => pr.name.toLowerCase().includes(q) || pr.id.toLowerCase().includes(q) || pr.client.toLowerCase().includes(q))
            .slice(0, 5)
            .map(pr => ({ type: 'project' as const, id: pr.id, label: `${pr.id} • ${pr.name}`, route: `/projekt/${pr.id}` }))
        const t = tiles
            .filter(tl => tl.name.toLowerCase().includes(q) || tl.id.toLowerCase().includes(q))
            .slice(0, 5)
            .map(tl => ({ type: 'tile' as const, id: tl.id, label: `${tl.id} • ${tl.name}` }))
        return [...p, ...t]
    }, [projects, tiles, query])

    useEffect(() => {
        const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [])

    const submit = (s?: Suggestion) => {
        const nextHistory = Array.from(new Set([query, ...history])).slice(0, 5)
        setHistory(nextHistory)
        localStorage.setItem('global_search_history', JSON.stringify(nextHistory))
        if (s?.route) nav(s.route)
        setOpen(false)
    }

    return (
        <div className="position-relative w-100" ref={ref}>
            <div className="input-group">
                <span className="input-group-text bg-transparent"><i className="ri-search-line"></i></span>
                <input className="form-control" placeholder="Szukaj projektów, klientów..." value={query}
                    onChange={e => { setQuery(e.currentTarget.value); setOpen(true) }} onFocus={() => setOpen(true)} />
            </div>
            {open && (
                <div className="dropdown-menu show w-100" style={{ maxHeight: 260, overflowY: 'auto' }}>
                    {query.trim() === '' && history.length > 0 && (
                        <>
                            <h6 className="dropdown-header">Ostatnie wyszukiwania</h6>
                            {history.map((h, i) => (
                                <button key={i} className="dropdown-item" onClick={() => { setQuery(h); setOpen(false) }}>{h}</button>
                            ))}
                            <div className="dropdown-divider"></div>
                        </>
                    )}
                    {suggestions.length === 0 && <span className="dropdown-item text-muted">Brak wyników</span>}
                    {suggestions.map((s, i) => (
                        <button key={i} className="dropdown-item" onClick={() => submit(s)}>
                            <i className={`me-2 ${s.type === 'project' ? 'ri-briefcase-4-line' : 'ri-shape-2-line'}`}></i>{s.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}


