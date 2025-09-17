/**
 * Component showing database connection status and allowing manual refresh
 */

import { Button } from '@/new-ui/atoms/Button/Button';
import { Badge } from '@/new-ui/atoms/Badge/Badge';
import { cn } from '@/new-ui/utils/cn';
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
        <div className="tw-flex tw-items-center tw-gap-2" title={getTooltipContent().toString()}>
            <Badge
                variant={getStatusColor() === 'success' ? 'default' : 'destructive'}
                className={cn(
                    getStatusColor() === 'success' && 'tw-bg-green-500',
                    getStatusColor() === 'warning' && 'tw-bg-yellow-500',
                    getStatusColor() === 'error' && 'tw-bg-red-500'
                )}
            >
                {getStatusText()}
            </Badge>
            <Button
                variant="ghost"
                size="sm"
                onClick={forceCheck}
                className="tw-p-1"
            >
                ↻
            </Button>
        </div>
    )
}
