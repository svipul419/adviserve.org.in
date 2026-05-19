import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ink-base">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-accent-blue text-2xl">!</span>
            </div>
            <h1 className="font-display text-[40px] uppercase tracking-[0.04em] text-white mb-4">Something went wrong</h1>
            <p className="text-[15px] text-white/75 mb-8 leading-relaxed">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-[10px] uppercase tracking-[0.16em] bg-[#1a1a2e] text-white px-8 py-4 min-h-[44px] hover:bg-accent-blueHover hover:text-black transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
