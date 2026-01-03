import React from 'react';
import { Button } from "./ui/Button";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
             <h2 className="text-2xl font-bold text-red-600 mb-4">系統發生錯誤</h2>
             <p className="text-neutral-600 mb-4">很抱歉，應用程式遇到不可預期的錯誤而停止運作。</p>
             
             <div className="bg-neutral-900 text-neutral-50 p-4 rounded-lg overflow-auto max-h-[300px] text-xs font-mono mb-6">
               <p className="text-red-400 font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
               <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
             </div>

             <div className="flex gap-4">
               <Button onClick={() => window.location.reload()} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                 重新整理頁面
               </Button>
               <Button onClick={() => window.location.href = '#/admin/login'} variant="outline" className="flex-1">
                 回首頁
               </Button>
             </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default GlobalErrorBoundary;
