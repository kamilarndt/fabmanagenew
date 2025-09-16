import { useEffect, useState } from 'react'
import { Modal, List, Typography, Button, Space, Input, Alert, Card, Tag, Divider } from 'antd'
import { SearchOutlined, LinkOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { listStreams, listCommits, buildCommitUrl, type SpeckleStream, type SpeckleCommit } from '../../services/speckle'

interface Props {
    open: boolean
    onClose: () => void
    onSelect: (commitUrl: string, streamInfo?: { streamId: string; commitId: string; streamName: string }) => void
    currentUrl?: string
    setCurrentUrl?: (url: string) => void
}

export default function SelectSpeckleModelModal({ open, onClose, onSelect, currentUrl, setCurrentUrl: _setCurrentUrl }: Props) {
    const [loading, setLoading] = useState(false)
    const [streams, setStreams] = useState<SpeckleStream[]>([])
    const [filteredStreams, setFilteredStreams] = useState<SpeckleStream[]>([])
    const [selectedStream, setSelectedStream] = useState<SpeckleStream | null>(null)
    const [commits, setCommits] = useState<SpeckleCommit[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [localCurrentUrl, setLocalCurrentUrl] = useState(currentUrl || '')

    useEffect(() => {
        if (!open) return
        setLoading(true)
        setError(null)
        listStreams()
            .then(setStreams)
            .catch(err => {
                setError('Nie udało się pobrać listy strumieni. Sprawdź połączenie z internetem i token Speckle.')
                console.error('Failed to load streams:', err)
            })
            .finally(() => setLoading(false))
    }, [open])

    useEffect(() => {
        if (!selectedStream) return
        setLoading(true)
        listCommits(selectedStream.id)
            .then(setCommits)
            .catch(err => {
                console.error('Failed to load commits:', err)
                setCommits([])
            })
            .finally(() => setLoading(false))
    }, [selectedStream])

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredStreams(streams)
        } else {
            const filtered = streams.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            setFilteredStreams(filtered)
        }
    }, [streams, searchTerm])

    const handleSelect = (stream: SpeckleStream, commit: SpeckleCommit) => {
        const commitUrl = buildCommitUrl(stream.id, commit.id)
        const streamInfo = {
            streamId: stream.id,
            commitId: commit.id,
            streamName: stream.name
        }
        onSelect(commitUrl, streamInfo)
        onClose()
    }

    const handleDirectUrl = () => {
        if (localCurrentUrl && localCurrentUrl.trim()) {
            onSelect(localCurrentUrl.trim())
            onClose()
        }
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={
                <Space>
                    <LinkOutlined />
                    Wybierz model ze Speckle
                </Space>
            }
            width={900}
        >
            {error && (
                <Alert
                    message="Błąd połączenia"
                    description={error}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Direct URL Input */}
                <Card size="small" title="Lub wklej bezpośredni link">
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="https://speckle.xyz/streams/..."
                            value={localCurrentUrl}
                            onChange={(e) => setLocalCurrentUrl(e.target.value)}
                            onPressEnter={handleDirectUrl}
                        />
                        <Button type="primary" onClick={handleDirectUrl}>
                            Użyj linku
                        </Button>
                    </Space.Compact>
                </Card>

                <Divider />

                {/* Stream Selection */}
                <div style={{ display: 'flex', gap: 16, height: 400 }}>
                    <div style={{ width: 360 }}>
                        <Space style={{ marginBottom: 8 }}>
                            <Typography.Title level={5} style={{ margin: 0 }}>Strumienie</Typography.Title>
                            <Tag color="blue">{filteredStreams.length}</Tag>
                        </Space>

                        <Input
                            placeholder="Szukaj strumieni..."
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: 8 }}
                        />

                        <List
                            loading={loading && streams.length === 0}
                            dataSource={filteredStreams}
                            style={{ height: 320, overflow: 'auto' }}
                            renderItem={(s) => (
                                <List.Item
                                    onClick={() => setSelectedStream(s)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedStream?.id === s.id ? '#e6f7ff' : 'transparent',
                                        borderRadius: 4,
                                        padding: '8px 12px',
                                        margin: '2px 0'
                                    }}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                {s.name}
                                                {s.id === selectedStream?.id && <Tag color="blue">Wybrany</Tag>}
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                {s.description && <div style={{ fontSize: 12, color: '#666' }}>{s.description}</div>}
                                                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                                                    ID: {s.id}
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <Typography.Title level={5}>Wersje (commits)</Typography.Title>
                        {selectedStream ? (
                            <List
                                loading={loading && commits.length === 0}
                                dataSource={commits}
                                style={{ height: 320, overflow: 'auto' }}
                                renderItem={(c) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="select"
                                                type="primary"
                                                size="small"
                                                onClick={() => handleSelect(selectedStream, c)}
                                            >
                                                Wybierz
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <Space>
                                                    {c.message || `Commit ${c.id.slice(0, 8)}`}
                                                    {c.authorName && <Tag color="green">{c.authorName}</Tag>}
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    {c.createdAt && <div style={{ fontSize: 12, color: '#666' }}>{c.createdAt}</div>}
                                                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                                                        ID: {c.id}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{
                                height: 320,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999'
                            }}>
                                <Space direction="vertical" align="center">
                                    <InfoCircleOutlined style={{ fontSize: 24 }} />
                                    <Typography.Text type="secondary">
                                        Wybierz strumień po lewej stronie
                                    </Typography.Text>
                                </Space>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <Alert
                    message="Instrukcje"
                    description={
                        <div>
                            <p>1. Wybierz strumień z listy po lewej stronie</p>
                            <p>2. Wybierz wersję (commit) z listy po prawej stronie</p>
                            <p>3. Lub wklej bezpośredni link do modelu w polu powyżej</p>
                            <p><strong>Uwaga:</strong> Do prywatnych strumieni wymagany jest token Speckle w zmiennych środowiskowych</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </Space>
        </Modal>
    )
}


