import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--surface-base)] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-60" />
      </div>

      <div className="z-10 text-center max-w-4xl px-6 space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-emerald)] animate-pulse mr-3" />
            <span className="text-[var(--font-size-xs)] font-medium text-[var(--text-secondary)] tracking-widest uppercase">
              FIFA World Cup 2026™
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            The Stadium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Thinks.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
            The official AI-powered Stadium Intelligence Platform. Experience unparalleled operational clarity and fan engagement.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/experience"
            className="inline-flex items-center gap-3 bg-[var(--brand-blue)] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Choose Your Experience
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
