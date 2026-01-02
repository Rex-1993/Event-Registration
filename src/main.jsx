// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return <div style={{padding: 20, color: 'red'}}>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error?.toString()}</pre>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {console.log("%c WEBSITE VERSION v1.6 LOADED ", "background: purple; color: white; font-size: 20px;")}
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
