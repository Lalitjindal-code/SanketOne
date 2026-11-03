import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111817] flex items-center justify-center p-6 text-slate-200">
          <div className="max-w-md w-full bg-[#1A2421] border border-[#2B3934] rounded-2xl p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center mb-6 text-[#E05D44]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-display text-white mb-2">
              System Telemetry Interrupted
            </h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected runtime exception was encountered in this view. The error has been captured for diagnostic review.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-[#101715] border border-[#2B3934] rounded-lg font-mono text-xs text-red-300 break-words">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#245B56] hover:bg-[#31746E] text-white font-medium text-sm transition-colors shadow-lg shadow-[#245B56]/20"
            >
              <RotateCcw className="w-4 h-4" />
              Re-initialize Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

