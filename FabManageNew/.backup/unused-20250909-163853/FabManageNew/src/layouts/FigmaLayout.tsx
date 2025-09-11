import { Outlet } from 'react-router-dom';
import { Layout, Typography } from 'antd';

export default function FigmaLayout() {
    const { Header, Content } = Layout;
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '0 16px' }}>
                <Typography.Title level={4} style={{ margin: 0 }}>Klienci</Typography.Title>
            </Header>
            <Content style={{ padding: 16 }}>
                <Outlet />
            </Content>
        </Layout>
    );
}
