import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import AuthPanel from '../components/Ui/AuthPanel';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard' },
    { to: '/projekty', label: 'Projekty' },
    { to: '/klienci', label: 'Klienci' },
    { to: '/kalendarz', label: 'Kalendarz' },
    { to: '/projektowanie', label: 'Projektowanie' },
    { to: '/cnc', label: 'CNC' },
    { to: '/produkcja', label: 'Produkcja' },
    { to: '/magazyn', label: 'Magazyn' },
    { to: '/podwykonawcy', label: 'Podwykonawcy' },
    { to: '/zapotrzebowania', label: 'Zapotrzebowania' }
];

export default function BootstrapLayout() {
    const { Header, Sider, Content } = Layout;
    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sider width={300} breakpoint="lg" collapsedWidth={0} style={{ background: 'var(--bg-secondary)' }}>
                <div style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>FabrykaManage</div>
                <Menu theme="dark" mode="inline" selectable={false} items={NAV_ITEMS.map(item => ({
                    key: item.to,
                    label: <RouterLink to={item.to}>{item.label}</RouterLink>
                }))} />
                <div style={{ padding: 12 }}>
                    <AuthPanel />
                </div>
            </Sider>
            <Layout style={{ background: 'var(--bg-primary)' }}>
                <Header style={{ background: 'var(--bg-secondary)', padding: '0 16px', borderBottom: '1px solid var(--border-medium)' }}>
                    <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>FabrykaManage</Typography.Title>
                </Header>
                <Content id="main-content" role="main" style={{ padding: 16, overflow: 'auto' }}>
                    <div style={{ maxWidth: 'var(--content-max, 1280px)', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
