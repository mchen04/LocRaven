'use client';

import React, { Component, ReactNode } from 'react';
import { Button, Card } from '../atoms';
import { AlertCard } from '../molecules';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorId: this.generateErrorId(),
    };
  }

  private generateErrorId = (): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error tracking service (e.g., Sentry, LogRocket, etc.)
    this.props.onError?.(error, errorInfo);
    
    // In development, provide more detailed error information
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state when reset keys change
    if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error state when any prop changes (if enabled)
    if (hasError && resetOnPropsChange) {
      const propsChanged = Object.keys(this.props).some(
        key => (this.props as any)[key] !== (prevProps as any)[key]
      );

      if (propsChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorId: this.generateErrorId(),
      });
    }, 100);
  };

  reloadPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  reportError = () => {
    const { error, errorId } = this.state;
    
    // Create error report
    const errorReport = {
      errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace available',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    };

    
    // Here you would typically send the error report to your error tracking service
    // For now, we'll copy it to clipboard if available
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
        .then(() => {
          alert('Error report copied to clipboard. Please share this with support.');
        })
        .catch(() => {
          alert('Unable to copy error report. Please take a screenshot.');
        });
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI using our design system
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full" padding="lg">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && error && (
                <AlertCard
                  variant="error"
                  title="Development Error Details"
                  message={error.message}
                  className="mb-6 text-left"
                />
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.resetErrorBoundary}
                  variant="primary"
                  size="md"
                  className="flex-1 sm:flex-initial"
                >
                  Try Again
                </Button>
                
                <Button
                  onClick={this.reloadPage}
                  variant="outline"
                  size="md"
                  className="flex-1 sm:flex-initial"
                >
                  Reload Page
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={this.reportError}
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                  >
                    Report Error
                  </Button>
                )}
              </div>

              {/* Error ID for support */}
              <p className="text-xs text-gray-400 mt-4">
                Error ID: {this.state.errorId}
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component wrapper for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for functional components to trigger error boundary
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  if (error) {
    throw error;
  }

  return { captureError, resetError };
}

export default ErrorBoundary;