import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import BrandedSidebar from '../components/Layout/BrandedSidebar'
import ContextualHeader from '../components/Layout/ContextualHeader'
import ConnectionStatusIndicator from '../components/ConnectionStatusIndicator'
import { SearchProvider } from '../contexts/SearchContext'

const { Content } = Layout

export default function BrandedLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <SearchProvider>
            <Layout style={{ minHeight: '100vh' }}>
                {/* Branded Sidebar */}
                <BrandedSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                />

                {/* Main Layout */}
                <Layout
                    style={{
                        marginLeft: sidebarCollapsed ? 80 : 280,
                        transition: 'margin-left 0.2s',
                        minHeight: '100vh'
                    }}
                >
                    {/* Contextual Header */}
                    <ContextualHeader />

                    {/* Content Area */}
                    <Content
                        style={{
                            margin: 0,
                            padding: 24,
                            background: 'var(--bg-primary)',
                            minHeight: 'calc(100vh - 64px)',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                    >
                        {/* Connection Status Indicator */}
                        <div style={{
                            position: 'absolute',
                            top: 8,
                            right: 24,
                            zIndex: 1000
                        }}>
                            <ConnectionStatusIndicator />
                        </div>

                        <div style={{
                            maxWidth: 'none',
                            background: 'transparent'
                        }}>
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </SearchProvider>
    )
}
