'use client';

import React, { useState } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { playClickSound, playConfirmationSound, useExperienceDirector } from '@/features/experience';
import { 
  Navigation2, Compass, Cpu, Route, ShieldAlert,
  Clock, Zap, CheckCircle2 
} from 'lucide-react';

interface ChuteStatus {
  id: string;
  name: string;
  capacity: string;
  flowRate: number;
  status: 'clear' | 'congested' | 'emergency';
}

interface Benchmark {
  id: string;
  profile: string;
  time: string;
  speed: string;
  elevators: number;
  hazards: number;
}

export default function NavigationPage() {
  const [chutes, setChutes] = useState<ChuteStatus[]>([
    { id: 'CHT-N1', name: 'North Outer Evacuation Chute', capacity: '12,000 p/h', flowRate: 85, status: 'clear' },
    { id: 'CHT-S2', name: 'South Lower Concourse Chute', capacity: '8,500 p/h', flowRate: 24, status: 'congested' },
    { id: 'CHT-V3', name: 'VIP Lower Escarpment Tunnel', capacity: '4,000 p/h', flowRate: 120, status: 'clear' },
    { id: 'CHT-E4', name: 'East Main Access Ramp', capacity: '15,000 p/h', flowRate: 92, status: 'clear' }
  ]);

  const role = useExperienceDirector((s) => s.role);
  const ticketType = useExperienceDirector((s) => s.ticketType);
  const accompanyingDisability = useExperienceDirector((s) => s.accompanyingDisability);

  const allowedTabs = React.useMemo(() => {
    if (role !== 'fan') return ['standard', 'accessible', 'vip', 'emergency'] as const;
    if (ticketType === 'vip') return ['standard', 'accessible', 'vip', 'emergency'] as const;
    return ['standard', 'accessible', 'emergency'] as const;
  }, [role, ticketType]);

  const [activeProfileTab, setActiveProfileTab] = useState<'standard' | 'accessible' | 'vip' | 'emergency'>(
    role === 'fan' && accompanyingDisability ? 'accessible' : 'standard'
  );

  const benchmarks: Record<'standard' | 'accessible' | 'vip' | 'emergency', Benchmark> = {
    standard: { id: 'BM-STD', profile: 'Standard', time: '4m 12s', speed: '1.4 m/s', elevators: 0, hazards: 0 },
    accessible: { id: 'BM-ACC', profile: 'Accessible', time: '6m 28s', speed: '1.1 m/s', elevators: 2, hazards: 0 },
    vip: { id: 'BM-VIP', profile: 'VIP Express', time: '3m 05s', speed: '1.6 m/s', elevators: 1, hazards: 0 },
    emergency: { id: 'BM-EMG', profile: 'Emergency', time: '1m 45s', speed: '2.5 m/s', elevators: 0, hazards: 0 }
  };

  const [queryLogs, setQueryLogs] = useState<string[]>([
    'Routing engine initialized.',
    'Compiled spatial navigation index (68 intersections, 92 vertices).',
    'Graph builder parsed 138 path segments successfully.'
  ]);

  const toggleChuteStatus = (id: string) => {
    playClickSound();
    setChutes(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextStatus: ChuteStatus['status'] = 
          ch.status === 'clear' ? 'congested' : 
          ch.status === 'congested' ? 'emergency' : 'clear';
        return { ...ch, status: nextStatus, flowRate: nextStatus === 'emergency' ? 0 : nextStatus === 'congested' ? 24 : 95 };
      }
      return ch;
    }));
  };

  const handleTestQuery = () => {
    playConfirmationSound();
    const mockQueries = [
      `Standard route planned: Gate A → Stadium Pitch (Resolved in 0.4ms)`,
      `Accessible route planned: Gate B → VIP Executive Club via West Lift Core A (Resolved in 0.8ms)`,
      `Emergency route planned: Section 104 → South Evacuation Exit (Resolved in 0.3ms)`,
      `VIP route planned: Gate D → VIP Executive Club (Resolved in 0.5ms)`
    ];
    const randomQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)] || '';
    setQueryLogs(prev => [...prev, randomQuery]);
  };

  const activeBenchmark = benchmarks[activeProfileTab];

  const statusColors: Record<ChuteStatus['status'], { bg: string; border: string; text: string; badge: string; badgeBorder: string; badgeText: string }> = {
    clear: {
      bg: 'var(--surface-elevated)',
      border: 'var(--border-subtle)',
      text: 'var(--text-primary)',
      badge: 'var(--color-green-50)',
      badgeBorder: 'var(--brand-emerald)',
      badgeText: 'var(--brand-emerald)',
    },
    congested: {
      bg: 'var(--color-amber-50)',
      border: 'var(--brand-gold)',
      text: 'var(--text-primary)',
      badge: 'var(--color-amber-50)',
      badgeBorder: 'var(--brand-gold)',
      badgeText: 'var(--brand-gold)',
    },
    emergency: {
      bg: 'var(--color-red-50)',
      border: 'var(--brand-red)',
      text: 'var(--text-primary)',
      badge: 'var(--color-red-50)',
      badgeBorder: 'var(--brand-red)',
      badgeText: 'var(--brand-red)',
    },
  };

  return (
    <PageTransition className="w-full h-full font-sans max-w-7xl mx-auto p-6 md:p-8 space-y-8 select-none" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-blue)' }}>
            <Navigation2 className="w-4 h-4" />
            Navigation
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>Intelligent Routing Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Route planning and analytics
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="flex flex-col rounded-xl p-3 min-w-[90px]" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Vertices</span>
            <span className="font-bold mt-0.5" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}>92</span>
          </div>
          <div className="flex flex-col rounded-xl p-3 min-w-[90px]" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Edges</span>
            <span className="font-bold mt-0.5" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}>138</span>
          </div>
          <div className="flex flex-col rounded-xl p-3 min-w-[90px]" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Density</span>
            <span className="font-bold mt-0.5" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}>0.18</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 space-y-3 relative overflow-hidden" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Avg. Transit Time</span>
            <Clock className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>4m 12s</h2>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Across all stadium zones</span>
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3 relative overflow-hidden" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Solver Speed</span>
            <Cpu className="w-4 h-4" style={{ color: 'var(--brand-emerald)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>0.45 ms</h2>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Computation speed</span>
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3 relative overflow-hidden" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active Queries</span>
            <Compass className="w-4 h-4" style={{ color: 'var(--brand-gold)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>1,842</h2>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Solved in the last 10 minutes</span>
          </div>
        </div>

        <div className="rounded-xl p-4 space-y-3 relative overflow-hidden" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
          <div className="flex justify-between items-start">
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Route Health</span>
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>100%</h2>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No blocked routes</span>
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Route Channels */}
        <div className="lg:col-span-7 rounded-xl p-5 md:p-6 space-y-5" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Route Channels</h2>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Tap to change status</span>
          </div>

          <div className="space-y-3">
            {chutes.map(ch => {
              const colors = statusColors[ch.status];
              return (
                <div
                  key={ch.id}
                  onClick={() => toggleChuteStatus(ch.id)}
                  className={`p-3.5 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center cursor-pointer transition-all gap-3 ${ch.status === 'emergency' ? 'animate-pulse' : ''}`}
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{ch.id}</span>
                      <h4 className="text-sm font-semibold" style={{ color: colors.text }}>{ch.name}</h4>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Capacity: <span style={{ fontFamily: 'var(--font-mono)' }}>{ch.capacity}</span></span>
                  </div>

                  <div className="flex items-center gap-4 text-xs justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs block" style={{ color: 'var(--text-tertiary)' }}>Flow</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{ch.flowRate} p/m</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{
                        background: colors.badge,
                        border: `1px solid ${colors.badgeBorder}`,
                        color: colors.badgeText,
                      }}
                    >
                      {ch.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Routing Profile Benchmarks & Test Queries */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Benchmarks Panel */}
          <div className="rounded-xl p-5 md:p-6 space-y-4" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <Route className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Benchmarks</h2>
            </div>

            {/* Profile Tabs */}
            <div className="grid gap-1 text-xs rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${allowedTabs.length}, minmax(0, 1fr))`, background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
              {allowedTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => { playClickSound(); setActiveProfileTab(tab); }}
                  className="py-2 text-center transition-all cursor-pointer truncate capitalize text-sm"
                  style={{
                    background: activeProfileTab === tab ? 'var(--surface-elevated)' : 'transparent',
                    color: activeProfileTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontWeight: activeProfileTab === tab ? 600 : 400,
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: activeProfileTab === tab ? 'var(--elevation-1)' : 'none',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Benchmark display */}
            <div className="p-4 rounded-lg space-y-3 text-sm" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Profile</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{activeBenchmark.profile}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Estimated Time</span>
                <span className="font-semibold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}>{activeBenchmark.time}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Avg. Travel Speed</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeBenchmark.speed}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Lift Crossings</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeBenchmark.elevators}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-tertiary)' }}>Constraints</span>
                <span style={{ color: activeBenchmark.hazards > 0 ? 'var(--brand-gold)' : 'var(--brand-emerald)' }}>
                  {activeBenchmark.hazards > 0 ? '⚠️ Obstruction bypass' : '✓ Direct'}
                </span>
              </div>
            </div>
          </div>

          {/* Pathfinder Tester */}
          <div className="rounded-xl p-5 md:p-6 space-y-4" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--elevation-1)' }}>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pathfinder Tester</h2>
              </div>
              <button
                onClick={handleTestQuery}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: 'var(--color-blue-50)',
                  border: '1px solid var(--brand-blue)',
                  color: 'var(--brand-blue)',
                }}
              >
                Run Query
              </button>
            </div>

            <div className="h-32 rounded-lg p-3 text-xs overflow-y-auto space-y-1.5 scrollbar-none" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', fontFamily: 'var(--font-mono)' }}>
              {queryLogs.map((log, index) => (
                <div key={index} className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span suppressHydrationWarning style={{ color: 'var(--text-disabled)' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </PageTransition>
  );
}
