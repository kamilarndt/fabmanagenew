import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { Card, Input, Button, Select, Space, Tag } from 'antd'

export default function AuthPanel() {
    const { user, roles, signIn, signOut, setRoles, loading } = useAuthStore()
    const [email, setEmail] = useState('')

    return (
        <Card size="small" title={<span><i className="ri-user-line" style={{ marginRight: 6 }}></i>Auth</span>}>
            {user ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>Zalogowano: <Tag color="blue">{user.email}</Tag></div>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Wybierz role"
                        value={roles}
                        onChange={(r) => setRoles(r as any)}
                        options={['designer', 'production', 'warehouse', 'manager'].map(r => ({ value: r, label: r }))}
                    />
                    <Button onClick={signOut}>Wyloguj</Button>
                </Space>
            ) : (
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Button type="primary" loading={loading} onClick={() => signIn(email)}>Zaloguj</Button>
                </Space.Compact>
            )}
        </Card>
    )
}
