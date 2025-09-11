import { Layout, Menu, Button, Avatar, Typography, Dropdown } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    HomeOutlined,
    FolderOutlined,
    TeamOutlined,
    CalendarOutlined,
    BgColorsOutlined,
    ToolOutlined,
    BuildOutlined,
    InboxOutlined,
    TruckOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons'

const { Sider } = Layout
const { Text } = Typography

interface BrandedSidebarProps {
    collapsed: boolean
    onCollapse: (collapsed: boolean) => void
}

export default function BrandedSidebar({ collapsed, onCollapse }: BrandedSidebarProps) {
    const navigate = useNavigate()
    const location = useLocation()

    // Menu items zgodnie ze specyfikacją
    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Dashboard',
            path: '/'
        },
        {
            key: '/projects',
            icon: <FolderOutlined />,
            label: 'Projekty',
            path: '/projects'
        },
        {
            key: '/klienci',
            icon: <TeamOutlined />,
            label: 'Klienci',
            path: '/klienci'
        },
        {
            key: '/calendar',
            icon: <CalendarOutlined />,
            label: 'Kalendarz',
            path: '/calendar'
        },
        {
            key: '/projektowanie',
            icon: <BgColorsOutlined />,
            label: 'Dział Projektowy',
            path: '/projektowanie'
        },
        {
            key: '/cnc',
            icon: <ToolOutlined />,
            label: 'CNC',
            path: '/cnc'
        },
        {
            key: '/produkcja',
            icon: <BuildOutlined />,
            label: 'Produkcja',
            path: '/produkcja'
        },
        {
            key: '/magazyn',
            icon: <InboxOutlined />,
            label: 'Magazyn',
            path: '/magazyn'
        },
        {
            key: '/subcontractors',
            icon: <TruckOutlined />,
            label: 'Podwykonawcy',
            path: '/subcontractors'
        },
        {
            key: '/demands',
            icon: <ShoppingCartOutlined />,
            label: 'Zapotrzebowania',
            path: '/demands'
        }
    ]

    // Dropdown menu dla użytkownika
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Mój Profil'
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Ustawienia',
            path: '/settings'
        },
        {
            key: 'help',
            icon: <QuestionCircleOutlined />,
            label: 'Pomoc'
        },
        {
            type: 'divider' as const
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Wyloguj',
            danger: true
        }
    ]

    const handleMenuClick = (item: { key: string }) => {
        const menuItem = menuItems.find(m => m.key === item.key)
        if (menuItem) {
            navigate(menuItem.path)
        }
    }

    const handleUserMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                console.log('Otwórz profil użytkownika')
                break
            case 'settings':
                navigate('/settings')
                break
            case 'help':
                console.log('Otwórz pomoc')
                break
            case 'logout':
                console.log('Wyloguj użytkownika')
                // TODO: Implementuj wylogowanie
                break
        }
    }

    // Znajdź aktywny element menu na podstawie ścieżki
    const selectedKeys = [
        location.pathname.startsWith('/magazyn') ? '/magazyn' : location.pathname
    ]

    return (
        <Sider
            collapsed={collapsed}
            onCollapse={onCollapse}
            width={280}
            collapsedWidth={80}
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100,
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-main)'
            }}
        >
            {/* Logo Section */}
            <div
                style={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-main)',
                    padding: '0 24px',
                    background: 'var(--bg-secondary)'
                }}
            >
                {!collapsed ? (
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 'var(--font-semibold)',
                                color: 'var(--text-primary)',
                                lineHeight: 1.2,
                                marginBottom: 4,
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            🏭 Fabryka
                        </div>
                        <div
                            style={{
                                fontSize: 16,
                                color: 'var(--primary-main)',
                                fontWeight: 'var(--font-medium)',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            Dekoracji
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            fontSize: 24,
                            color: 'var(--primary-main)'
                        }}
                    >
                        🏭
                    </div>
                )}
            </div>

            {/* Collapse/Expand Button */}
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-main)'
                }}
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => onCollapse(!collapsed)}
                    style={{
                        fontSize: 16,
                        width: '100%',
                        height: 40,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        fontFamily: 'var(--font-family)',
                        fontWeight: 'var(--font-medium)'
                    }}
                >
                    {!collapsed && <span style={{ marginLeft: 8 }}>Zwiń menu</span>}
                </Button>
            </div>

            {/* Navigation Menu */}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={selectedKeys}
                style={{
                    border: 'none',
                    background: 'transparent',
                    flex: 1,
                    fontFamily: 'var(--font-family)'
                }}
                onClick={handleMenuClick}
                items={menuItems.map(item => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label
                }))}
            />

            {/* User Section at Bottom */}
            <div
                style={{
                    borderTop: '1px solid var(--border-main)',
                    padding: '16px',
                    background: 'var(--bg-secondary)'
                }}
            >
                <Dropdown
                    menu={{
                        items: userMenuItems,
                        onClick: handleUserMenuClick
                    }}
                    placement="topLeft"
                    trigger={['click']}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: 6,
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <Avatar
                            size={collapsed ? 32 : 40}
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: 'var(--primary-main)',
                                flexShrink: 0
                            }}
                        />
                        {!collapsed && (
                            <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                                <Text
                                    style={{
                                        color: 'var(--text-primary)',
                                        fontSize: 14,
                                        fontWeight: 'var(--font-medium)',
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontFamily: 'var(--font-family)'
                                    }}
                                >
                                    Kamil Arndt
                                </Text>
                                <Text
                                    style={{
                                        color: 'var(--text-muted)',
                                        fontSize: 12,
                                        display: 'block',
                                        fontFamily: 'var(--font-family)'
                                    }}
                                >
                                    Administrator
                                </Text>
                            </div>
                        )}
                    </div>
                </Dropdown>
            </div>
        </Sider>
    )
}
