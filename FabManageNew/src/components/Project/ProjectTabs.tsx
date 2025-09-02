import type { Project } from '../../types/projects.types'

type TabId = 'overview' | 'koncepcja' | 'wycena' | 'elementy' | 'zakupy' | 'logistyka' | 'zakwaterowanie'

interface ProjectTabsProps {
    activeTab: TabId
    onTabChange: (tab: TabId) => void
    project: Project
}

const TABS = [
    { id: 'overview' as const, label: 'Overview', icon: 'ri-dashboard-line', requiredModule: null },
    { id: 'koncepcja' as const, label: 'Koncepcja', icon: 'ri-artboard-2-line', requiredModule: 'koncepcja' },
    { id: 'wycena' as const, label: 'Wycena', icon: 'ri-money-dollar-circle-line', requiredModule: 'wycena' },
    { id: 'elementy' as const, label: 'Elementy', icon: 'ri-layout-grid-line', requiredModule: 'projektowanie_techniczne' },
    { id: 'zakupy' as const, label: 'Materiały', icon: 'ri-shopping-cart-line', requiredModule: 'materialy' },
    { id: 'logistyka' as const, label: 'Logistyka', icon: 'ri-road-map-line', requiredModule: 'logistyka_montaz' },
    { id: 'zakwaterowanie' as const, label: 'Zakwaterowanie', icon: 'ri-hotel-bed-line', requiredModule: 'zakwaterowanie' }
] as const

export default function ProjectTabs({ activeTab, onTabChange, project }: ProjectTabsProps) {
    const availableTabs = TABS.filter(tab => {
        if (tab.requiredModule === null) return true
        return project?.modules?.includes(tab.requiredModule as any)
    })

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
                <nav className="nav nav-tabs border-0" role="tablist" style={{ marginBottom: '-1px' }}>
                    {availableTabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-link border-0 px-3 py-2 rounded-top ${activeTab === tab.id ? 'active bg-white text-primary border-bottom-0' : 'text-muted bg-transparent'}`}
                            onClick={() => onTabChange(tab.id)}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`panel-${tab.id}`}
                            id={`tab-${tab.id}`}
                            style={{
                                marginRight: '4px',
                                borderBottom: activeTab === tab.id ? '2px solid #0d6efd' : '2px solid transparent',
                                fontWeight: activeTab === tab.id ? '600' : '400'
                            }}
                        >
                            <i className={`${tab.icon} me-2`}></i>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
