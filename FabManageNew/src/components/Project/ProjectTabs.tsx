import type { Project } from '../../types/projects.types'
import { Tabs, Card } from 'antd'

type TabId = 'overview' | 'koncepcja' | 'wycena' | 'elementy' | 'zakupy' | 'logistyka' | 'zakwaterowanie' | 'kalendarz'

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
    , { id: 'kalendarz' as const, label: 'Kalendarz', icon: 'ri-calendar-line', requiredModule: null }
] as const

export default function ProjectTabs({ activeTab, onTabChange, project }: ProjectTabsProps) {
    const modules = new Set(project?.modules || [])

    return (
        <Card>
            <Tabs
                activeKey={activeTab}
                onChange={(key) => onTabChange(key as TabId)}
                items={TABS.map(tab => ({
                    key: tab.id,
                    label: (
                        <span style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}>
                            <i className={tab.icon} style={{ marginRight: 8 }}></i>
                            {tab.label}
                        </span>
                    )
                    , disabled: tab.requiredModule ? !modules.has(tab.requiredModule as any) : false
                }))}
            />
        </Card>
    )
}
