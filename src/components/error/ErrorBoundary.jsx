import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Logged for now; swap for a real logging service (Sentry, etc.)
    // once you're closer to production.
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-arena-bg px-4">
          <div className="w-full max-w-sm text-center">
            <p className="font-mono text-[10px] tracking-widest text-red-400 mb-3">
              ARENA_STATUS // ERROR
            </p>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              An unexpected error occurred. This has been logged — try returning
              to the dashboard.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-accent-cyan hover:bg-cyan-400 text-arena-bg font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
