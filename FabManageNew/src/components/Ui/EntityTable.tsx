import React, { useState } from 'react'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

export type SortDirection = 'asc' | 'desc' | null

export type Column<T> = {
    key: keyof T | string
    header: string
    width?: number | string
    render?: (row: T) => React.ReactNode
    sortable?: boolean
    sorter?: (a: T, b: T) => number
}

type Props<T> = {
    rows: T[]
    columns: Column<T>[]
    rowKey: (row: T) => string
    onRowClick?: (row: T) => void
    defaultSortKey?: keyof T | string
    defaultSortDirection?: SortDirection
    initialHiddenColumns?: Array<keyof T | string>
}

export function EntityTable<T>({
    rows,
    columns,
    rowKey,
    onRowClick,
    defaultSortKey,
    defaultSortDirection = 'asc',
    initialHiddenColumns = []
}: Props<T>) {
    const [sortKey, setSortKey] = useState<keyof T | string | null>(defaultSortKey || null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection)

    const [hidden, setHidden] = useState<Set<string>>(new Set(initialHiddenColumns.map(String)))

    const toggleColumn = (key: string) => {
        setHidden(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key); else next.add(key)
            return next
        })
    }

    const visibleColumns = React.useMemo(() => columns.filter(c => !hidden.has(String(c.key))), [columns, hidden])

    const handleSort = (columnKey: keyof T | string, column: Column<T>) => {
        if (!column.sortable) return

        if (sortKey === columnKey) {
            // Toggle direction or clear sort
            if (sortDirection === 'asc') {
                setSortDirection('desc')
            } else if (sortDirection === 'desc') {
                setSortKey(null)
                setSortDirection(null)
            }
        } else {
            // New column sort
            setSortKey(columnKey)
            setSortDirection('asc')
        }
    }

    const sortedRows = React.useMemo(() => {
        if (!sortKey || !sortDirection) return rows

        const column = visibleColumns.find(col => col.key === sortKey)
        if (!column || !column.sortable) return rows

        return [...rows].sort((a, b) => {
            let result: number

            if (column.sorter) {
                result = column.sorter(a, b)
            } else {
                // Default string sort
                const aVal = String((a as any)[sortKey] || '')
                const bVal = String((b as any)[sortKey] || '')
                result = aVal.localeCompare(bVal, 'pl', { sensitivity: 'base' })
            }

            return sortDirection === 'desc' ? -result : result
        })
    }, [rows, sortKey, sortDirection, visibleColumns])

    const getSortIcon = (columnKey: keyof T | string) => {
        if (sortKey !== columnKey) return null

        return sortDirection === 'asc' ? (
            <CaretUpOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
        ) : (
            <CaretDownOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
        )
    }

    return (
        <div className="table-responsive">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: '#888' }}>Kolumny:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginLeft: 8 }}>
                    {columns.map(col => (
                        <label key={String(col.key)} style={{ fontSize: 12, color: '#666', userSelect: 'none' }}>
                            <input type="checkbox" checked={!hidden.has(String(col.key))} onChange={() => toggleColumn(String(col.key))} style={{ marginRight: 4 }} />
                            {col.header}
                        </label>
                    ))}
                </div>
            </div>
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        {visibleColumns.map(col => (
                            <th
                                key={String(col.key)}
                                style={{
                                    width: col.width,
                                    cursor: col.sortable ? 'pointer' : 'default',
                                    userSelect: 'none'
                                }}
                                onClick={() => handleSort(col.key, col)}
                            >
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    {col.header}
                                    {getSortIcon(col.key)}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map(row => (
                        <tr key={rowKey(row)} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                            {visibleColumns.map(col => (
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


