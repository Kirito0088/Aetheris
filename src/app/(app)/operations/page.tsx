'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { playClickSound, playConfirmationSound } from '@/features/experience';
import { 
  Activity, CheckCircle2, Radio, Users, 
  Wind, Thermometer, Shield, UserCheck, 
  MapPin, Clock
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  location: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: string;
  description: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'patrolling' | 'responding';
  zone: string;
}

export default function OperationsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-2081',
      title: 'Gate B Turnstile Congestion',
      location: 'Gate B (East Entrance)',
      severity: 'critical',
      status: 'active',
      timestamp: '10:04:12',
      description: 'Egress queuing threshold exceeded. Telemetry indicates 42 people/min flow rate bottleneck.'
    },
    {
      id: 'INC-2082',
      title: 'Section 104 Crowd Obstruction',
      location: 'East Stand - Concourse',
      severity: 'warning',
      status: 'investigating',
      timestamp: '10:05:44',
      description: 'Crowd density sensor registers 4.8 people/sqm near concession stands. Slow egress warning.'
    },
    {
      id: 'INC-2083',
      title: 'First Aid Medical Dispatch',
      location: 'First Aid Station 1 (North)',
      severity: 'info',
      status: 'resolved',
      timestamp: '09:48:15',
      description: 'Wheelchair escort dispatched to seat 12-B for heat exhaustion. Status: Cleared by medical lead.'
    },
    {
      id: 'INC-2084',
      title: 'Ramp A Lighting Drop',
      location: 'Gate A (North Entrance)',
      severity: 'warning',
      status: 'active',
      timestamp: '10:07:02',
      description: 'Segment voltage drop. Standby auxiliary lighting activated. Repair crew notified.'
    }
  ]);

  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 'ST-101', name: 'Commander Vance', role: 'Security Coordinator', status: 'patrolling', zone: 'Gate A (North Entrance)' },
    { id: 'ST-102', name: 'Marshal Sterling', role: 'Crowd Specialist', status: 'responding', zone: 'Gate B (East Entrance)' },
    { id: 'ST-103', name: 'Lieutenant Reyes', role: 'Tactical Supervisor', status: 'patrolling', zone: 'East Stand' },
    { id: 'ST-104', name: 'Officer Chen', role: 'Medical Responder', status: 'idle', zone: 'First Aid Station 1' },
    { id: 'ST-105', name: 'Officer Miller', role: 'Accessibility Lead', status: 'patrolling', zone: 'VIP Executive Club' }
  ]);

  const [selectedIncidentFilter, setSelectedIncidentFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const handleIncidentStatus = (id: string, newStatus: 'investigating' | 'resolved') => {
    playConfirmationSound();
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));
  };

  const handleStaffZoneChange = (id: string, newZone: string) => {
    playClickSound();
    setStaffList(prev => prev.map(st => {
      if (st.id === id) {
        return { ...st, zone: newZone, status: 'patrolling' };
      }
      return st;
    }));
    setSelectedStaffId(null);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (selectedIncidentFilter === 'all') return true;
    return inc.status === selectedIncidentFilter;
  });

  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  const filterLabel = (f: string) => f.charAt(0).toUpperCase() + f.slice(1);

  const severityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'var(--brand-red)';
      case 'warning': return 'var(--brand-gold)';
      case 'info': return 'var(--brand-blue)';
    }
  };

  const statusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'active': return {
        bg: 'var(--color-red-50)',
        color: 'var(--brand-red)',
        border: 'var(--brand-red)',
      };
      case 'investigating': return {
        bg: 'var(--color-amber-50)',
        color: 'var(--brand-gold)',
        border: 'var(--brand-gold)',
      };
      case 'resolved': return {
        bg: 'var(--color-green-50)',
        color: 'var(--brand-emerald)',
        border: 'var(--brand-emerald)',
      };
    }
  };

  const staffStatusBadge = (status: Staff['status']) => {
    switch (status) {
      case 'responding': return {
        bg: 'var(--color-red-50)',
        color: 'var(--brand-red)',
        border: 'var(--brand-red)',
      };
      case 'patrolling': return {
        bg: 'var(--color-blue-50)',
        color: 'var(--brand-blue)',
        border: 'var(--brand-blue)',
      };
      case 'idle': return {
        bg: 'var(--surface-sunken)',
        color: 'var(--text-tertiary)',
        border: 'var(--border-subtle)',
      };
    }
  };

  return (
    <PageTransition className="w-full h-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 select-none"
      style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}
    >
      
      {/* Title & Telemetry Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: 'var(--brand-blue)' }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live operations · Secure channel
          </div>
          <h1
            className="text-2xl font-bold tracking-tight mt-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Venue Control Operations
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            FIFA WC 2026 Telemetry · GPS: 49°16′36″ N, 123°06′43″ W
          </p>
        </div>
        <div className="flex gap-3 text-[10px]">
          <div
            className="flex flex-col rounded-lg p-2.5 min-w-[90px]"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>System status</span>
            <span className="font-semibold mt-0.5" style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>● Online</span>
          </div>
          <div
            className="flex flex-col rounded-lg p-2.5 min-w-[90px]"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>Incidents</span>
            <span
              className={`font-semibold mt-0.5 ${activeIncidentsCount > 0 ? 'animate-pulse' : ''}`}
              style={{
                color: activeIncidentsCount > 0 ? 'var(--brand-gold)' : 'var(--brand-emerald)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {activeIncidentsCount} active
            </span>
          </div>
          <div
            className="flex flex-col rounded-lg p-2.5 min-w-[90px]"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>Latency</span>
            <span className="font-semibold mt-0.5" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}>12.4 ms</span>
          </div>
        </div>
      </div>

      {/* Telemetry metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Crowd volume */}
        <div
          className="rounded-xl p-4 space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--elevation-2)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Crowd volume</span>
            <Users className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>64,281</h2>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>95.2% capacity · BC Place</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
            <div className="h-full rounded-full" style={{ width: '95.2%', background: 'var(--brand-blue)' }} />
          </div>
        </div>

        {/* Egress throughput */}
        <div
          className="rounded-xl p-4 space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--elevation-2)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Egress throughput</span>
            <Activity className="w-4 h-4" style={{ color: 'var(--brand-emerald)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              28.4 <span className="text-[10px] font-sans" style={{ color: 'var(--text-tertiary)' }}>p/s</span>
            </h2>
            <span className="text-[10px]" style={{ color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)' }}>14 gates open · Optimal</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
            <div className="h-full rounded-full" style={{ width: '84%', background: 'var(--brand-emerald)' }} />
          </div>
        </div>

        {/* Staff dispatch */}
        <div
          className="rounded-xl p-4 space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--elevation-2)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Staff dispatch</span>
            <UserCheck className="w-4 h-4" style={{ color: 'var(--brand-gold)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              5 / 5 <span className="text-[10px] font-sans" style={{ color: 'var(--text-tertiary)' }}>active</span>
            </h2>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>100% coverage</span>
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
            <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--brand-gold)' }} />
          </div>
        </div>

        {/* Environment */}
        <div
          className="rounded-xl p-4 space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--elevation-2)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Environment</span>
            <Wind className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>21.5°C</h2>
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Wind: 8.4 km/h · Humidity: 48%</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--brand-blue)' }}>
            <Thermometer className="w-3.5 h-3.5" />
            Atmosphere synced
          </div>
        </div>
      </div>

      {/* Main Console Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Interactive Incidents Feed */}
        <div
          className="lg:col-span-7 p-5 md:p-6 space-y-6"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--elevation-2)',
          }}
        >
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--brand-gold)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Incident log</h2>
            </div>
            
            {/* Filter buttons */}
            <div
              className="flex rounded-lg overflow-hidden text-xs"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
              {(['all', 'active', 'investigating', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => { playClickSound(); setSelectedIncidentFilter(f); }}
                  className="px-3 py-1.5 transition-colors cursor-pointer"
                  style={{
                    borderRight: f !== 'resolved' ? '1px solid var(--border-subtle)' : 'none',
                    background: selectedIncidentFilter === f ? 'var(--surface-sunken)' : 'transparent',
                    color: selectedIncidentFilter === f ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontWeight: selectedIncidentFilter === f ? 600 : 400,
                  }}
                >
                  {filterLabel(f)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredIncidents.map(inc => {
                const badge = statusBadge(inc.status);
                return (
                  <motion.div
                    key={inc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg p-4 space-y-3 relative overflow-hidden transition-all"
                    style={{
                      background: 'var(--surface-base)',
                      border: `1px solid var(--border-subtle)`,
                      borderLeft: `3px solid ${severityColor(inc.severity)}`,
                    }}
                  >
                    <div className="flex items-start justify-between pl-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{inc.id}</span>
                          <span style={{ color: 'var(--text-disabled)' }}>·</span>
                          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            <MapPin className="w-3 h-3" style={{ color: 'var(--text-disabled)' }} />
                            {inc.location}
                          </div>
                        </div>
                        <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{inc.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${inc.status === 'active' ? 'animate-pulse' : ''}`}
                          style={{
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {filterLabel(inc.status)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed pl-1" style={{ color: 'var(--text-secondary)' }}>{inc.description}</p>

                    <div
                      className="flex items-center justify-between pt-3 pl-1 text-[10px]"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        Triggered {inc.timestamp}
                      </div>

                      <div className="flex gap-2">
                        {inc.status === 'active' && (
                          <button
                            onClick={() => handleIncidentStatus(inc.id, 'investigating')}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer"
                            style={{
                              background: 'var(--color-amber-50)',
                              color: 'var(--brand-gold)',
                              border: '1px solid var(--brand-gold)',
                            }}
                          >
                            Dispatch crew
                          </button>
                        )}
                        {inc.status !== 'resolved' && (
                          <button
                            onClick={() => handleIncidentStatus(inc.id, 'resolved')}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer"
                            style={{
                              background: 'var(--color-green-50)',
                              color: 'var(--brand-emerald)',
                              border: '1px solid var(--brand-emerald)',
                            }}
                          >
                            Resolve
                          </button>
                        )}
                        {inc.status === 'resolved' && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: 'var(--brand-emerald)' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolved
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredIncidents.length === 0 && (
              <div
                className="text-center py-12 text-xs rounded-lg"
                style={{
                  color: 'var(--text-disabled)',
                  border: '1px dashed var(--border-subtle)',
                  background: 'var(--surface-sunken)',
                }}
              >
                No incidents matching this filter
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Staff & Dispatch control */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="p-5 md:p-6 space-y-5"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            <div className="pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: 'var(--brand-blue)' }} />
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Personnel tracking</h2>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{staffList.length} staff logged</span>
              </div>
            </div>

            <div className="space-y-3">
              {staffList.map(st => {
                const stBadge = staffStatusBadge(st.status);
                return (
                  <div
                    key={st.id}
                    onClick={() => { playClickSound(); setSelectedStaffId(selectedStaffId === st.id ? null : st.id); }}
                    className="p-3 rounded-lg flex flex-col space-y-3 cursor-pointer transition-all"
                    style={{
                      border: selectedStaffId === st.id
                        ? '1px solid var(--brand-blue)'
                        : '1px solid var(--border-subtle)',
                      background: selectedStaffId === st.id
                        ? 'var(--color-blue-50)'
                        : 'var(--surface-base)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{st.name}</h4>
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{st.role}</span>
                      </div>

                      <span
                        className={`text-[9px] px-2.5 py-1 rounded-full font-medium ${st.status === 'responding' ? 'animate-pulse' : ''}`}
                        style={{
                          background: stBadge.bg,
                          color: stBadge.color,
                        }}
                      >
                        {filterLabel(st.status)}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between text-[10px] pt-2"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <span style={{ color: 'var(--text-tertiary)' }}>Assigned zone</span>
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{st.zone}</span>
                    </div>

                    {/* Dispatch control overlay */}
                    <AnimatePresence>
                      {selectedStaffId === st.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 space-y-2 overflow-hidden"
                          style={{ borderTop: '1px solid var(--border-subtle)' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>Reassign zone</span>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {[
                              'Gate A (North Entrance)',
                              'Gate B (East Entrance)',
                              'East Stand',
                              'First Aid Station 1',
                              'VIP Executive Club'
                            ].map(z => (
                              <button
                                key={z}
                                onClick={() => handleStaffZoneChange(st.id, z)}
                                disabled={st.zone === z}
                                className="p-2 rounded-lg text-left truncate transition-all cursor-pointer font-medium"
                                style={{
                                  border: st.zone === z
                                    ? '1px solid var(--brand-blue)'
                                    : '1px solid var(--border-subtle)',
                                  background: st.zone === z
                                    ? 'var(--color-blue-50)'
                                    : 'var(--surface-base)',
                                  color: st.zone === z
                                    ? 'var(--brand-blue)'
                                    : 'var(--text-secondary)',
                                  fontWeight: st.zone === z ? 600 : 400,
                                }}
                              >
                                {z.split(' (')[0]}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </PageTransition>
  );
}
