import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Result, Button, Typography, Card, Collapse, Alert } from 'antd'
import { BugOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons'
import { config } from '../../lib/config'

const { Paragraph, Text } = Typography

interface Props {
    children: ReactNode
    fallback?: ReactNode
    level?: 'page' | 'component' | 'global'
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
    errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: ''
        }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
            errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo
        })

        // Log error to console in development
        if (config.environment === 'development') {
            console.group('🚨 Error Boundary Caught Error')
            console.error('Error:', error)
            console.error('Error Info:', errorInfo)
            console.error('Component Stack:', errorInfo.componentStack)
            console.groupEnd()
        }

        // Call custom error handler
        this.props.onError?.(error, errorInfo)

        // Report to monitoring service in production
        if (config.environment === 'production') {
            this.reportError(error, errorInfo)
        }
    }

    private reportError = (error: Error, errorInfo: ErrorInfo) => {
        try {
            // Here you would integrate with error reporting service
            // Example: Sentry, LogRocket, Bugsnag, etc.

            const errorReport = {
                errorId: this.state.errorId,
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                userId: localStorage.getItem('userId'), // if available
                level: this.props.level || 'component',
                environment: config.environment
            }

            // Mock error reporting - replace with actual service
            console.warn('Error reported:', errorReport)

            // Example Sentry integration:
            // Sentry.captureException(error, {
            //     tags: {
            //         errorBoundary: true,
            //         level: this.props.level
            //     },
            //     extra: errorReport
            // })

        } catch (reportingError) {
            console.error('Failed to report error:', reportingError)
        }
    }

    private handleReload = () => {
        window.location.reload()
    }

    private handleGoHome = () => {
        window.location.href = '/'
    }

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: ''
        })
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            const { error, errorInfo } = this.state
            const { level = 'component' } = this.props

            // Different UI based on error level
            if (level === 'component') {
                return (
                    <Card
                        style={{
                            margin: '16px 0',
                            border: '1px solid #ff4d4f',
                            backgroundColor: '#fff2f0'
                        }}
                    >
                        <Result
                            status="error"
                            icon={<BugOutlined />}
                            title="Błąd komponentu"
                            subTitle="Wystąpił problem z tym komponentem. Spróbuj odświeżyć stronę."
                            extra={[
                                <Button key="retry" onClick={this.handleRetry}>
                                    Spróbuj ponownie
                                </Button>,
                                <Button key="reload" type="primary" icon={<ReloadOutlined />} onClick={this.handleReload}>
                                    Odśwież stronę
                                </Button>
                            ]}
                        />

                        {config.environment === 'development' && error && (
                            <Collapse ghost>
                                <Collapse.Panel header="Szczegóły błędu (tryb deweloperski)" key="details">
                                    <Alert
                                        type="error"
                                        message={error.message}
                                        description={
                                            <div>
                                                <Paragraph>
                                                    <Text strong>ID błędu:</Text> {this.state.errorId}
                                                </Paragraph>
                                                <Paragraph>
                                                    <Text strong>Stack trace:</Text>
                                                    <pre style={{
                                                        fontSize: '12px',
                                                        backgroundColor: '#f5f5f5',
                                                        padding: '8px',
                                                        borderRadius: '4px',
                                                        overflow: 'auto',
                                                        maxHeight: '200px'
                                                    }}>
                                                        {error.stack}
                                                    </pre>
                                                </Paragraph>
                                                {errorInfo && (
                                                    <Paragraph>
                                                        <Text strong>Component stack:</Text>
                                                        <pre style={{
                                                            fontSize: '12px',
                                                            backgroundColor: '#f5f5f5',
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            overflow: 'auto',
                                                            maxHeight: '200px'
                                                        }}>
                                                            {errorInfo.componentStack}
                                                        </pre>
                                                    </Paragraph>
                                                )}
                                            </div>
                                        }
                                    />
                                </Collapse.Panel>
                            </Collapse>
                        )}
                    </Card>
                )
            }

            if (level === 'page') {
                return (
                    <div style={{ padding: '24px', minHeight: '50vh' }}>
                        <Result
                            status="500"
                            title="Błąd strony"
                            subTitle="Przepraszamy, wystąpił nieoczekiwany błąd na tej stronie."
                            extra={[
                                <Button key="home" icon={<HomeOutlined />} onClick={this.handleGoHome}>
                                    Strona główna
                                </Button>,
                                <Button key="reload" type="primary" icon={<ReloadOutlined />} onClick={this.handleReload}>
                                    Odśwież stronę
                                </Button>
                            ]}
                        />

                        {config.environment === 'development' && error && (
                            <Card style={{ marginTop: '24px' }}>
                                <Collapse>
                                    <Collapse.Panel header="Szczegóły błędu (tryb deweloperski)" key="details">
                                        <Alert
                                            type="error"
                                            message={error.message}
                                            description={
                                                <div>
                                                    <Paragraph>
                                                        <Text strong>ID błędu:</Text> {this.state.errorId}
                                                    </Paragraph>
                                                    <Paragraph>
                                                        <Text strong>Stack trace:</Text>
                                                        <pre style={{
                                                            fontSize: '12px',
                                                            backgroundColor: '#f5f5f5',
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            overflow: 'auto',
                                                            maxHeight: '300px'
                                                        }}>
                                                            {error.stack}
                                                        </pre>
                                                    </Paragraph>
                                                </div>
                                            }
                                        />
                                    </Collapse.Panel>
                                </Collapse>
                            </Card>
                        )}
                    </div>
                )
            }

            // Global level
            return (
                <div style={{
                    padding: '48px 24px',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                }}>
                    <div style={{ maxWidth: '600px', width: '100%' }}>
                        <Result
                            status="500"
                            title="Krytyczny błąd aplikacji"
                            subTitle={`Wystąpił poważny błąd aplikacji. Kod błędu: ${this.state.errorId}`}
                            extra={[
                                <Button key="reload" type="primary" size="large" icon={<ReloadOutlined />} onClick={this.handleReload}>
                                    Odśwież aplikację
                                </Button>
                            ]}
                        />

                        {config.environment === 'development' && error && (
                            <Card style={{ marginTop: '24px' }}>
                                <Typography.Title level={4}>Szczegóły błędu (tryb deweloperski)</Typography.Title>
                                <Alert
                                    type="error"
                                    message={error.message}
                                    description={
                                        <pre style={{
                                            fontSize: '12px',
                                            backgroundColor: '#f5f5f5',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            overflow: 'auto',
                                            maxHeight: '400px'
                                        }}>
                                            {error.stack}
                                        </pre>
                                    }
                                />
                            </Card>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    )

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

    return WrappedComponent
}

export default ErrorBoundary
