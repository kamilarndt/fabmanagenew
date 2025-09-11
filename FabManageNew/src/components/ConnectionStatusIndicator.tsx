/**
 * Component showing database connection status and allowing manual refresh
 */

import { Badge, Tooltip, Button, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useConnectionStatus } from '../lib/connectionMonitor'

export default function ConnectionStatusIndicator() {
    const { status, forceCheck, canUseDatabase } = useConnectionStatus()

    const getStatusColor = () => {
        switch (status.source) {
            case 'database': return 'success'
            case 'local': return 'warning'
            case 'mock': return 'default'
            default: return 'error'
        }
    }

    const getStatusText = () => {
        switch (status.source) {
            case 'database': return 'Baza danych'
            case 'local': return 'Dane lokalne'
            case 'mock': return 'Dane testowe'
            default: return 'Błąd połączenia'
        }
    }


    const getTooltipContent = () => {
        return (
            <div>
                <div><strong>Status:</strong> {getStatusText()}</div>
                <div><strong>Ostatnie sprawdzenie:</strong> {status.lastCheck.toLocaleTimeString()}</div>
                {status.error && (
                    <div><strong>Błąd:</strong> {status.error}</div>
                )}
                {!canUseDatabase && (
                    <div style={{ color: '#faad14', marginTop: 8 }}>
                        ⚠️ Używane są dane offline
                    </div>
                )}
            </div>
        )
    }

    return (
        <Tooltip title={getTooltipContent()} placement="bottomRight">
            <Space size="small">
                <Badge
                    status={getStatusColor()}
                    text={getStatusText()}
                />
                <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={forceCheck}
                    style={{ padding: '0 4px' }}
                />
            </Space>
        </Tooltip>
    )
}
