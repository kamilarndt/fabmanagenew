import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard' },
    { to: '/projekty', label: 'Projekty' },
    { to: '/klienci', label: 'Klienci' },
    { to: '/projektowanie', label: 'Projektowanie' },
    { to: '/cnc', label: 'CNC' },
    { to: '/produkcja', label: 'Produkcja' },
    { to: '/magazyn', label: 'Magazyn' },
    { to: '/zapotrzebowania', label: 'Zapotrzebowania' }
];

export default function BootstrapLayout() {
    const { Header, Sider, Content } = Layout;
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={280} breakpoint="lg" collapsedWidth={0}>
                <div style={{ padding: '16px', color: '#fff', fontWeight: 600 }}>FabrykaManage</div>
                <Menu theme="dark" mode="inline" selectable={false} items={NAV_ITEMS.map(item => ({
                    key: item.to,
                    label: <RouterLink to={item.to}>{item.label}</RouterLink>
                }))} />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 16px' }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>FabrykaManage</Typography.Title>
                </Header>
                <Content id="main-content" role="main" style={{ padding: 16 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
