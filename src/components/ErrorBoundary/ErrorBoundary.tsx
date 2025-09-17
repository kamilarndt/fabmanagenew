import { ReloadOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          padding: '20px'
        }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please try again or contact support if the problem persists."
            extra={[
              <Button type="primary" key="reload" icon={<ReloadOutlined />} onClick={this.handleReload}>
                Reload Page
              </Button>,
              <Button key="retry" onClick={this.handleReset}>
                Try Again
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'left', maxWidth: '600px' }}>
              <Paragraph>
                <Text strong>Error Details:</Text>
              </Paragraph>
              <Paragraph code style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
              </Paragraph>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <>
                  <Paragraph>
                    <Text strong>Component Stack:</Text>
                  </Paragraph>
                  <Paragraph code style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo.componentStack}
                  </Paragraph>
                </>
              )}
            </div>
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}