"use client";

import React from "react";
import { Mic, Globe2 } from "lucide-react";

export default function VolunteerTranslatePage() {
  return (
    <div className="p-4 h-full flex flex-col space-y-6">
      <div className="space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Real-time Translate</h1>
        <p className="text-sm text-[var(--text-secondary)]">Assist fans across language barriers.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Language Selectors */}
        <div className="flex items-center gap-2 bg-[var(--surface-elevated)] p-2 rounded-xl border border-[var(--border-subtle)] shrink-0">
          <select className="flex-1 bg-transparent text-sm font-medium outline-none p-2 appearance-none text-center">
            <option>English</option>
            <option>Spanish</option>
          </select>
          <div className="w-8 h-8 rounded-full bg-[var(--surface-base)] flex items-center justify-center border border-[var(--border-subtle)] shrink-0">
            <Globe2 className="w-4 h-4 text-[var(--text-tertiary)]" />
          </div>
          <select className="flex-1 bg-transparent text-sm font-medium outline-none p-2 appearance-none text-center">
            <option>Spanish</option>
            <option>English</option>
          </select>
        </div>

        {/* Translation Area */}
        <div className="flex-1 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-2xl flex flex-col p-6 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 pointer-events-none" />
          
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center relative shadow-inner mb-8">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
            <Mic className="w-10 h-10 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Listening...</h3>
          <p className="text-[var(--text-secondary)] text-center text-sm max-w-[200px]">
            Speak clearly into your device to translate instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
