"use client";

import { Component, ReactNode } from "react";

type Props = { children: ReactNode; fallbackLabel?: string };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6 text-center text-sm text-zinc-400">
          ⚠️ {this.props.fallbackLabel || "Something went wrong loading this section."}
        </div>
      );
    }
    return this.props.children;
  }
}
