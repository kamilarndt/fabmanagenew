import { useState, useMemo } from 'react'
import { Drawer, Input, List, Avatar, Checkbox, Button, Space, Tag, Typography } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useUsersStore, type User } from '../../stores/usersStore'

const { Search } = Input
const { Text } = Typography

interface AddMemberModalProps {
    isOpen: boolean
    onClose: () => void
    currentMemberIds: string[]
    onAddMembers: (memberIds: string[]) => void
}

export default function AddMemberModal({ isOpen, onClose, currentMemberIds, onAddMembers }: AddMemberModalProps) {
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    const { getActiveUsers } = useUsersStore()
    const allUsers = getActiveUsers()

    const availableUsers = useMemo(() => {
        return allUsers.filter(user => !currentMemberIds.includes(user.id))
    }, [allUsers, currentMemberIds])

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return availableUsers

        return availableUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [availableUsers, searchTerm])

    const handleToggleMember = (memberId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleSubmit = () => {
        onAddMembers(selectedMemberIds)
        setSelectedMemberIds([])
        setSearchTerm('')
        onClose()
    }

    const selectedUsers = useMemo(() => {
        return allUsers.filter(user => selectedMemberIds.includes(user.id))
    }, [allUsers, selectedMemberIds])

    const getRoleColor = (role: User['role']) => {
        switch (role) {
            case 'designer': return 'blue'
            case 'manager': return 'green'
            case 'admin': return 'red'
            case 'team_lead': return 'orange'
            default: return 'default'
        }
    }

    const getRoleLabel = (role: User['role']) => {
        switch (role) {
            case 'designer': return 'Projektant'
            case 'manager': return 'Manager'
            case 'admin': return 'Administrator'
            case 'team_lead': return 'Lider zespołu'
            default: return role
        }
    }

    return (
        <Drawer
            title="Dodaj członków zespołu"
            open={isOpen}
            onClose={onClose}
            width={480}
            extra={
                <Space>
                    <Button onClick={onClose}>Anuluj</Button>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={handleSubmit}
                        disabled={selectedMemberIds.length === 0}
                    >
                        Dodaj ({selectedMemberIds.length})
                    </Button>
                </Space>
            }
        >
            <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: '0.875rem' }}>Wybrani członkowie:</Text>
                <div style={{ marginTop: 8 }}>
                    {selectedUsers.length > 0 ? (
                        <Space wrap>
                            {selectedUsers.map(user => (
                                <Tag
                                    key={user.id}
                                    color={getRoleColor(user.role)}
                                    closable
                                    onClose={() => handleToggleMember(user.id)}
                                >
                                    {user.name}
                                </Tag>
                            ))}
                        </Space>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '0.875rem' }}>Brak wybranych</Text>
                    )}
                </div>
            </div>

            <Search
                placeholder="Szukaj członków..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
                allowClear
            />

            <List
                dataSource={filteredMembers}
                style={{ maxHeight: 400, overflowY: 'auto' }}
                renderItem={(user) => (
                    <List.Item
                        key={user.id}
                        style={{
                            padding: '12px 0',
                            borderBottom: '1px solid var(--border-light)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Avatar
                                    src={user.avatar}
                                    size={40}
                                    style={{ marginRight: 12 }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                        marginBottom: 2
                                    }}>
                                        {user.name}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 2
                                    }}>
                                        <Tag color={getRoleColor(user.role)}>
                                            {getRoleLabel(user.role)}
                                        </Tag>
                                        {user.workload && (
                                            <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                                                Obciążenie: {user.workload}%
                                            </Text>
                                        )}
                                    </div>
                                    {user.skills && user.skills.length > 0 && (
                                        <div style={{ marginTop: 4 }}>
                                            <Space size={4} wrap>
                                                {user.skills.slice(0, 3).map(skill => (
                                                    <Tag key={skill} color="default">
                                                        {skill}
                                                    </Tag>
                                                ))}
                                                {user.skills.length > 3 && (
                                                    <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                                                        +{user.skills.length - 3} więcej
                                                    </Text>
                                                )}
                                            </Space>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Checkbox
                                checked={selectedMemberIds.includes(user.id)}
                                onChange={() => handleToggleMember(user.id)}
                            />
                        </div>
                    </List.Item>
                )}
            />
        </Drawer>
    )
}
