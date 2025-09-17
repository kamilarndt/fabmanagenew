import { Button } from "@/new-ui/atoms/Button/Button";
import { Icon } from "@/new-ui/atoms/Icon/Icon";
import { Typography } from "@/new-ui/atoms/Typography/Typography";
import { Alert } from "@/new-ui/molecules/Alert/Alert";
import { Card } from "@/new-ui/molecules/Card/Card";
import { Collapse } from "@/new-ui/molecules/Collapse/Collapse";
import { Result } from "@/new-ui/molecules/Result/Result";
import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";
import { config } from "../../lib/config";

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: "page" | "component" | "global";
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundaryComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (config.environment === "development") {
      console.group("🚨 Error Boundary Caught Error");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to monitoring service in production
    if (config.environment === "production") {
      this.reportError(error, errorInfo);
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
        userId: localStorage.getItem("userId"), // if available
        level: this.props.level || "component",
        environment: config.environment,
      };

      // Mock error reporting - replace with actual service
      console.warn("Error reported:", errorReport);

      // Example Sentry integration:
      // Sentry.captureException(error, {
      //     tags: {
      //         errorBoundary: true,
      //         level: this.props.level
      //     },
      //     extra: errorReport
      // })
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const { level = "component" } = this.props;

      // Different UI based on error level
      if (level === "component") {
        return (
          <Card className="m-4 border-red-200 bg-red-50">
            <Result
              status="error"
              icon={<Icon name="bug" className="w-16 h-16 text-red-500" />}
              title="Błąd komponentu"
              subTitle="Wystąpił problem z tym komponentem. Spróbuj odświeżyć stronę."
              extra={[
                <Button
                  key="retry"
                  variant="secondary"
                  onClick={this.handleRetry}
                >
                  Spróbuj ponownie
                </Button>,
                <Button
                  key="reload"
                  variant="primary"
                  onClick={this.handleReload}
                >
                  <Icon name="refresh" className="w-4 h-4 mr-2" />
                  Odśwież stronę
                </Button>,
              ]}
            />

            {config.environment === "development" && error && (
              <Collapse ghost>
                <Collapse.Panel
                  header="Szczegóły błędu (tryb deweloperski)"
                  key="details"
                >
                  <Alert
                    variant="error"
                    title={error.message}
                    description={
                      <div>
                        <Paragraph>
                          <Text strong>ID błędu:</Text> {this.state.errorId}
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Stack trace:</Text>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-48">
                            {error.stack}
                          </pre>
                        </Paragraph>
                        {errorInfo && (
                          <Paragraph>
                            <Text strong>Component stack:</Text>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-48">
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
        );
      }

      if (level === "page") {
        return (
          <div className="p-6 min-h-[50vh]">
            <Result
              status="500"
              title="Błąd strony"
              subTitle="Przepraszamy, wystąpił nieoczekiwany błąd na tej stronie."
              extra={[
                <Button
                  key="home"
                  variant="secondary"
                  onClick={this.handleGoHome}
                >
                  <Icon name="home" className="w-4 h-4 mr-2" />
                  Strona główna
                </Button>,
                <Button
                  key="reload"
                  variant="primary"
                  onClick={this.handleReload}
                >
                  <Icon name="refresh" className="w-4 h-4 mr-2" />
                  Odśwież stronę
                </Button>,
              ]}
            />

            {config.environment === "development" && error && (
              <Card className="mt-6">
                <Collapse>
                  <Collapse.Panel
                    header="Szczegóły błędu (tryb deweloperski)"
                    key="details"
                  >
                    <Alert
                      variant="error"
                      title={error.message}
                      description={
                        <div>
                          <Paragraph>
                            <Text strong>ID błędu:</Text> {this.state.errorId}
                          </Paragraph>
                          <Paragraph>
                            <Text strong>Stack trace:</Text>
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-72">
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
        );
      }

      // Global level
      return (
        <div className="p-12 min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-2xl w-full">
            <Result
              status="500"
              title="Krytyczny błąd aplikacji"
              subTitle={`Wystąpił poważny błąd aplikacji. Kod błędu: ${this.state.errorId}`}
              extra={[
                <Button
                  key="reload"
                  variant="primary"
                  size="lg"
                  onClick={this.handleReload}
                >
                  <Icon name="refresh" className="w-4 h-4 mr-2" />
                  Odśwież aplikację
                </Button>,
              ]}
            />

            {config.environment === "development" && error && (
              <Card className="mt-6">
                <Typography variant="h4" className="mb-4">
                  Szczegóły błędu (tryb deweloperski)
                </Typography>
                <Alert
                  variant="error"
                  title={error.message}
                  description={
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
                      {error.stack}
                    </pre>
                  }
                />
              </Card>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryComponent {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryComponent>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export { ErrorBoundaryComponent as ErrorBoundary };
