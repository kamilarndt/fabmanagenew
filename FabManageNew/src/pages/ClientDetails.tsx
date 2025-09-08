import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumb, Card, Row, Col, Typography, Descriptions, Tabs, Empty, Tag } from 'antd'
import { useClientDataStore } from '../stores/clientDataStore'
import type { ProcessedClient, ProcessedProject } from '../types/clientData.types'

export default function ClientDetails() {
    const { id } = useParams<{ id: string }>()
    const { getClientById, getProjectsByClient, loadData, loading } = useClientDataStore()

    const [client, setClient] = useState<ProcessedClient | null>(null)
    const [projects, setProjects] = useState<ProcessedProject[]>([])
    const [activeTab, setActiveTab] = useState<'contacts' | 'projects' | 'invoices'>('contacts')

    useEffect(() => {
        const run = async () => {
            if (!id) return
            await loadData()
            const c = getClientById(id)
            if (c) {
                setClient(c)
                setProjects(getProjectsByClient(c.companyName))
            }
        }
        run()
    }, [id, getClientById, getProjectsByClient, loadData])

    if (loading) return null
    if (!client) return <div style={{ padding: 24 }}><Empty description="Nie znaleziono klienta" /></div>

    return (
        <div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Breadcrumb items={[{ title: 'Home' }, { title: 'Klienci', href: '/klienci' }, { title: client.companyName }]} />
            </div>

            <Typography.Title level={4} style={{ marginTop: 0 }}>{client.companyName}</Typography.Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card bordered style={{ background: 'var(--bg-card)' }}>
                        <Descriptions title="Dane firmy" column={1} labelStyle={{ color: 'var(--text-secondary)' }}>
                            <Descriptions.Item label="NIP">{client.nip}</Descriptions.Item>
                            <Descriptions.Item label="REGON">{client.regon}</Descriptions.Item>
                            <Descriptions.Item label="Adres">{client.address.street} {client.address.houseNumber}{client.address.apartmentNumber ? `/${client.address.apartmentNumber}` : ''}</Descriptions.Item>
                            <Descriptions.Item label="Miasto">{client.address.city}</Descriptions.Item>
                            <Descriptions.Item label="Strona">{client.website || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Email">{client.email || '—'}</Descriptions.Item>
                        </Descriptions>
                        {client.description && (
                            <Typography.Paragraph type="secondary" style={{ marginTop: 12 }}>{client.description}</Typography.Paragraph>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card bordered style={{ background: 'var(--bg-card)' }}>
                        <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k as any)} items={[
                            {
                                key: 'contacts', label: 'Kontakty', children: (
                                    client.contacts?.length ? (
                                        <Row gutter={[12, 12]}>
                                            {client.contacts.map((c, idx) => (
                                                <Col xs={24} md={12} key={idx}>
                                                    <Card size="small" bordered style={{ background: 'var(--bg-secondary)' }}>
                                                        <Typography.Text strong>{c.imie} {c.nazwisko}</Typography.Text>
                                                        <div className="small text-muted">{c.opis}</div>
                                                        <div>{c.adres_email}</div>
                                                        <div>{c.telefon_kontaktowy}</div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : <Empty description="Brak kontaktów" />
                                )
                            },
                            {
                                key: 'projects', label: 'Projekty', children: (
                                    projects?.length ? (
                                        <Row gutter={[12, 12]}>
                                            {projects.map(p => (
                                                <Col xs={24} key={p.id}>
                                                    <Card size="small" bordered style={{ background: 'var(--bg-secondary)' }}>
                                                        <Typography.Text strong>{p.projectName}</Typography.Text>
                                                        <div className="small text-muted">
                                                            <Tag color="var(--primary-main)">Elementy: {p.elementsCount}</Tag>
                                                            <span style={{ marginLeft: 8 }}>Deadline: {new Date(p.deadline).toLocaleDateString('pl-PL')}</span>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : <Empty description="Brak projektów" />
                                )
                            },
                            { key: 'invoices', label: 'Faktury', children: <Empty description="Moduł faktur w przygotowaniu" /> }
                        ]} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}


