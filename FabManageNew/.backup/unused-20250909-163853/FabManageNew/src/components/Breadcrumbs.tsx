import { NavLink, useLocation, useParams } from 'react-router-dom'

export default function Breadcrumbs() {
    const location = useLocation()
    const params = useParams()
    const segments = location.pathname.split('/').filter(Boolean)

    const items = [{ label: 'Home', to: '/' }, ...segments.map((seg, idx) => {
        const to = '/' + segments.slice(0, idx + 1).join('/')
        let label = seg.toUpperCase()
        if (seg === 'projekty') label = 'Projekty'
        if (seg === 'klienci') label = 'Klienci'
        if (seg === 'cnc') label = 'CNC'
        if (seg === 'magazyn') label = 'Magazyn'
        if (seg === 'produkcja') label = 'Produkcja'
        if (seg === 'projektowanie') label = 'Projektowanie'
        if (segments[idx - 1] === 'projekt') label = params.id || seg
        if (seg === 'projekt') label = 'Projekt'
        return { label, to }
    })]

    return (
        <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
                {items.map((it, i) => (
                    <li key={i} className={`breadcrumb-item ${i === items.length - 1 ? 'active' : ''}`} aria-current={i === items.length - 1 ? 'page' : undefined}>
                        {i === items.length - 1 ? it.label : <NavLink to={it.to}>{it.label}</NavLink>}
                    </li>
                ))}
            </ol>
        </nav>
    )
}


