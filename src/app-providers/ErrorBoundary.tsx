import React from 'react'
import { type ErrorInfo, Suspense, type ReactNode } from 'react'
import { ErrorPage } from '@/pages/error-page/ErrorPage.tsx'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  reloadApp = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    const { hasError, error } = this.state

    if (hasError) {
      return (
        <Suspense fallback={null}>
          <ErrorPage reloadApp={this.reloadApp} error={error} />
        </Suspense>
      )
    }
    return this.props.children
  }
}
