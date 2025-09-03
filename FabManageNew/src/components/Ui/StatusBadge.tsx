export function StatusBadge({ status }: { status: string }) {
    const cls = (() => {
        switch (status) {
            case 'Active':
                return 'badge bg-success'
            case 'On Hold':
                return 'badge bg-warning'
            case 'Done':
                return 'badge bg-info'
            default:
                return 'badge bg-secondary'
        }
    })()

    return <span className={cls}>{status}</span>
}
