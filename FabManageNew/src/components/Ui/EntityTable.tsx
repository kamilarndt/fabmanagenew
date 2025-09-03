import React from 'react'

export type Column<T> = {
    key: keyof T | string
    header: string
    width?: number | string
    render?: (row: T) => React.ReactNode
}

type Props<T> = {
    rows: T[]
    columns: Column<T>[]
    rowKey: (row: T) => string
    onRowClick?: (row: T) => void
}

export function EntityTable<T>({ rows, columns, rowKey, onRowClick }: Props<T>) {
    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        {columns.map(col => (
                            <th key={String(col.key)} style={{ width: col.width }}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={rowKey(row)} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                            {columns.map(col => (
                                <td key={String(col.key)}>
                                    {col.render ? col.render(row) : (row as any)[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


