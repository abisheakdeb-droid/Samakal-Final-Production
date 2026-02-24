"use client";

import dynamic from 'next/dynamic';
import { ArticleData } from './types';


const Editor = dynamic(() => import('./Editor').then(mod => mod.Editor), { 
  ssr: false,
  loading: () => <p className="p-8 text-gray-500">Editor loading...</p>
});

import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Editor Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-bold mb-2">Editor Failed to Load</h3>
          <pre className="text-xs overflow-auto">{this.state.error?.message}</pre>
          <pre className="text-xs text-gray-500 mt-2">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function EditorWrapper({ initialData }: { initialData?: ArticleData }) {
  return (
    <ErrorBoundary>
      <Editor initialData={initialData} />
    </ErrorBoundary>
  );
}
