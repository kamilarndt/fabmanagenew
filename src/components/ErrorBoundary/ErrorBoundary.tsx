import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { ReloadOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
    };

    // In a real application, you would send this to your error monitoring service
    // For now, we'll just log it to console and localStorage for debugging
    console.error('Error logged to monitoring service:', errorData);
    
    // Store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorData);
      // Keep only last 10 errors
      const recentErrors = existingErrors.slice(-10);
      localStorage.setItem('app_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }
  };

  private getCurrentUserId = (): string | null => {
    // In a real app, you would get this from your auth context/store
    return localStorage.getItem('user_id') || null;
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Szczegóły błędu zostały skopiowane do schowka');
      })
      .catch(() => {
        alert('Nie udało się skopiować szczegółów błędu');
      });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-2xl w-full">
            <div className="text-center mb-6">
              <BugOutlined className="text-6xl text-red-500 mb-4" />
              <Title level={2} className="text-red-600">
                Ups! Coś poszło nie tak
              </Title>
              <Paragraph className="text-gray-600">
                Wystąpił nieoczekiwany błąd w aplikacji. Nasz zespół został powiadomiony.
              </Paragraph>
            </div>

            <Alert
              message="Informacje o błędzie"
              description={
                <div>
                  <Text code>ID błędu: {this.state.errorId}</Text>
                  <br />
                  <Text type="secondary">
                    Czas: {new Date().toLocaleString('pl-PL')}
                  </Text>
                </div>
              }
              type="error"
              showIcon
              className="mb-6"
            />

            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                block
              >
                Odśwież stronę
              </Button>
              
              <Button
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
                block
              >
                Przejdź do strony głównej
              </Button>
              
              <Button
                onClick={this.handleReset}
                block
              >
                Spróbuj ponownie
              </Button>
            </Space>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6">
                <Button
                  type="dashed"
                  onClick={this.copyErrorDetails}
                  block
                >
                  Kopiuj szczegóły błędu (tryb deweloperski)
                </Button>
                
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-600">
                    Szczegóły techniczne
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    {this.state.error?.stack}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;