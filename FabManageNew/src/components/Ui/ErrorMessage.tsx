import React from 'react'
import { Alert, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ErrorMessageProps {
    error?: string | string[] | null
    type?: 'field' | 'form' | 'global'
    showIcon?: boolean
    className?: string
    style?: React.CSSProperties
}

export function ErrorMessage({
    error,
    type = 'field',
    showIcon = true,
    className,
    style
}: ErrorMessageProps) {
    if (!error) return null

    const errors = Array.isArray(error) ? error : [error]

    if (type === 'field') {
        return (
            <Typography.Text
                type="danger"
                style={{
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                    ...style
                }}
                className={className}
            >
                {showIcon && <ExclamationCircleOutlined />}
                {errors[0]}
            </Typography.Text>
        )
    }

    if (type === 'form') {
        return (
            <Alert
                type="error"
                showIcon={showIcon}
                message="Błędy w formularzu"
                description={
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {errors.map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                }
                style={{ marginBottom: '16px', ...style }}
                className={className}
            />
        )
    }

    // Global error type
    return (
        <Alert
            type="error"
            showIcon={showIcon}
            message={errors.length === 1 ? errors[0] : 'Wystąpiły błędy'}
            description={errors.length > 1 ? (
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {errors.map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            ) : undefined}
            style={style}
            className={className}
        />
    )
}

interface FormErrorSummaryProps {
    errors: Record<string, any>
    fieldLabels?: Record<string, string>
    className?: string
    style?: React.CSSProperties
}

export function FormErrorSummary({
    errors,
    fieldLabels = {},
    className,
    style
}: FormErrorSummaryProps) {
    const errorEntries = Object.entries(errors).filter(([, error]) => error)

    if (errorEntries.length === 0) return null

    const errorMessages = errorEntries.map(([field, error]) => {
        const label = fieldLabels[field] || field
        const message = error?.message || error
        return `${label}: ${message}`
    })

    return (
        <ErrorMessage
            error={errorMessages}
            type="form"
            className={className}
            style={style}
        />
    )
}

export default ErrorMessage
