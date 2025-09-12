import { Component } from 'react'
import type { ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError() { return { hasError: true } }

    componentDidCatch(error: unknown) {
        // lazy import logger to avoid cycles
        import('../lib/logger').then(({ logger }) => logger.error('Unhandled UI error', error))
    }

    render() {
        if (this.state.hasError) {
            return <div className="alert alert-danger">Wystąpił błąd. Odśwież stronę lub spróbuj ponownie.</div>
        }
        return this.props.children
    }
}

