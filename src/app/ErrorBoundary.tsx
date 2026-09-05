import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Đã xảy ra lỗi không mong muốn
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Ứng dụng gặp sự cố trong quá trình kết xuất. Bạn có thể tải lại trang để tiếp tục.
            </p>

            {this.state.error && (
              <details className="text-left mb-6 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl text-xs text-rose-600 dark:text-rose-400 overflow-auto max-h-40">
                <summary className="font-mono cursor-pointer mb-1 text-slate-700 dark:text-slate-300">
                  {this.state.error.name}: {this.state.error.message}
                </summary>
                <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <Button
              onClick={this.handleReset}
              variant="primary"
              className="w-full justify-center"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Tải lại ứng dụng
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}