import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Renderer crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          color: '#e6edf3',
          background: '#0d1117',
          fontFamily: 'sans-serif',
          minHeight: '100vh',
        }}>
          <h1 style={{ marginTop: 0 }}>EasyGit crashed while loading</h1>
          <pre style={{
            whiteSpace: 'pre-wrap',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 8,
            padding: 16,
            overflow: 'auto',
          }}>
            {this.state.error.stack ?? this.state.error.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
