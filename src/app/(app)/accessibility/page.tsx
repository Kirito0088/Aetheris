'use client';

import React, { useState } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { useDigitalTwinStore } from '@/features/digital-twin/store/useDigitalTwinStore';
import { playClickSound, playConfirmationSound } from '@/features/experience';
import { 
  Accessibility, Layers, Settings, Eye,
  ArrowRight, ShieldCheck
} from 'lucide-react';

interface ElevatorStatus {
  id: string;
  name: string;
  deck: string;
  load: string;
  health: number;
  status: 'active' | 'standby' | 'maintenance';
}

interface AssistanceRequest {
  id: string;
  type: string;
  location: string;
  details: string;
  status: 'pending' | 'dispatched' | 'completed';
}

export default function AccessibilityPage() {
  const reducedMotion = useDigitalTwinStore((s) => s.environment.reducedMotion);
  const setReducedMotion = useDigitalTwinStore((s) => s.setReducedMotion);

  // Local state for other accessibility preferences
  const [contrastBoost, setContrastBoost] = useState(false);
  const [stepFreeOnly, setStepFreeOnly] = useState(true);
  const [voiceOverGuide, setVoiceOverGuide] = useState(false);

  const [elevators, setElevators] = useState<ElevatorStatus[]>([
    { id: 'ELV-A1', name: 'West Lift Core A', deck: 'Ground ➔ Suite Deck', load: '320 kg', health: 98, status: 'active' },
    { id: 'ELV-B2', name: 'East Lift Core B', deck: 'Concourse ➔ Upper Tier', load: '120 kg', health: 96, status: 'active' },
    { id: 'ELV-C3', name: 'North Pitch Elevator', deck: 'Tunnel ➔ Pitch Level', load: '0 kg', health: 100, status: 'standby' },
    { id: 'RMP-N1', name: 'North Concourse Ramp', deck: 'Main Outer Ring', load: 'Clear', health: 95, status: 'active' }
  ]);

  const [requests, setRequests] = useState<AssistanceRequest[]>([
    { id: 'REQ-301', type: 'Wheelchair Escort', location: 'Gate B (East Entrance)', details: 'Elderly fan requires assistance to Seat Block 102.', status: 'pending' },
    { id: 'REQ-302', type: 'Tactical Audio Beacon', location: 'Gate A (North Entrance)', details: 'Visually impaired fan requested audio headset sync.', status: 'dispatched' },
    { id: 'REQ-303', type: 'Steward Support', location: 'VIP Executive Club', details: 'Accessible ramp assistance request for wheelchair party.', status: 'pending' }
  ]);

  const toggleElevatorStatus = (id: string) => {
    playClickSound();
    setElevators(prev => prev.map(elv => {
      if (elv.id === id) {
        const nextStatus: ElevatorStatus['status'] = 
          elv.status === 'active' ? 'standby' : 
          elv.status === 'standby' ? 'maintenance' : 'active';
        return { ...elv, status: nextStatus, health: nextStatus === 'maintenance' ? 45 : 98 };
      }
      return elv;
    }));
  };

  const handleDispatchSteward = (id: string) => {
    playConfirmationSound();
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'dispatched' };
      }
      return req;
    }));
  };

  return (
    <PageTransition className="w-full h-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 select-none" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
      
      {/* Page Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-emerald)' }}>
            <Accessibility className="w-4 h-4" />
            Accessibility · Active monitoring
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
            Accessibility Guidance
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Aetheris compliance module · FIFA standards
          </p>
        </div>
        
        <div className="flex gap-3 text-xs">
          <div
            className="flex flex-col rounded-xl p-3 min-w-[130px]"
            style={{
              background: 'var(--color-green-50)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>ADA Compliance</span>
            <span className="font-semibold mt-0.5" style={{ color: 'var(--brand-emerald)' }}>
              ✓ <span style={{ fontFamily: 'var(--font-mono)' }}>100%</span> Verified
            </span>
          </div>
          <div
            className="flex flex-col rounded-xl p-3 min-w-[130px]"
            style={{
              background: reducedMotion ? 'var(--color-green-50)' : 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>Reduced motion</span>
            <span className="font-semibold mt-0.5" style={{ color: reducedMotion ? 'var(--brand-emerald)' : 'var(--text-disabled)' }}>
              {reducedMotion ? '● Active' : '○ Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Preference Switchboard & Elevators */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preferences Switchboard */}
          <div
            className="p-5 md:p-6 space-y-5"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <Settings className="w-4 h-4" style={{ color: 'var(--brand-emerald)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>System controls</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Reduced Motion Toggle - Real binding! */}
              <div 
                onClick={() => { playConfirmationSound(); setReducedMotion(!reducedMotion); }}
                className="p-4 flex flex-col space-y-2 cursor-pointer transition-all select-none"
                style={{
                  border: reducedMotion ? '1px solid var(--brand-emerald)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  background: reducedMotion ? 'var(--color-green-50)' : 'var(--surface-elevated)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Reduced motion</span>
                  <div className="w-8 h-[18px] rounded-full p-0.5 transition-colors" style={{ background: reducedMotion ? 'var(--brand-emerald)' : 'var(--border-default)' }}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-3.5' : 'translate-x-0'}`} style={{ boxShadow: 'var(--elevation-1)' }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Simplifies complex 3D camera animations and transitions to reduce motion fatigue.
                </p>
              </div>

              {/* Step-Free Only Toggle */}
              <div 
                onClick={() => { playClickSound(); setStepFreeOnly(!stepFreeOnly); }}
                className="p-4 flex flex-col space-y-2 cursor-pointer transition-all select-none"
                style={{
                  border: stepFreeOnly ? '1px solid var(--brand-emerald)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  background: stepFreeOnly ? 'var(--color-green-50)' : 'var(--surface-elevated)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Step-free routing</span>
                  <div className="w-8 h-[18px] rounded-full p-0.5 transition-colors" style={{ background: stepFreeOnly ? 'var(--brand-emerald)' : 'var(--border-default)' }}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${stepFreeOnly ? 'translate-x-3.5' : 'translate-x-0'}`} style={{ boxShadow: 'var(--elevation-1)' }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Prefers ramps and elevator routes over staircases when finding paths.
                </p>
              </div>

              {/* Contrast Boost Toggle */}
              <div 
                onClick={() => { playClickSound(); setContrastBoost(!contrastBoost); }}
                className="p-4 flex flex-col space-y-2 cursor-pointer transition-all select-none"
                style={{
                  border: contrastBoost ? '1px solid var(--brand-emerald)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  background: contrastBoost ? 'var(--color-green-50)' : 'var(--surface-elevated)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Contrast boost</span>
                  <div className="w-8 h-[18px] rounded-full p-0.5 transition-colors" style={{ background: contrastBoost ? 'var(--brand-emerald)' : 'var(--border-default)' }}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${contrastBoost ? 'translate-x-3.5' : 'translate-x-0'}`} style={{ boxShadow: 'var(--elevation-1)' }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Increases text contrast for better readability in bright or outdoor conditions.
                </p>
              </div>

              {/* Voice-Over Assist Toggle */}
              <div 
                onClick={() => { playClickSound(); setVoiceOverGuide(!voiceOverGuide); }}
                className="p-4 flex flex-col space-y-2 cursor-pointer transition-all select-none"
                style={{
                  border: voiceOverGuide ? '1px solid var(--brand-emerald)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  background: voiceOverGuide ? 'var(--color-green-50)' : 'var(--surface-elevated)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Voice guidance</span>
                  <div className="w-8 h-[18px] rounded-full p-0.5 transition-colors" style={{ background: voiceOverGuide ? 'var(--brand-emerald)' : 'var(--border-default)' }}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${voiceOverGuide ? 'translate-x-3.5' : 'translate-x-0'}`} style={{ boxShadow: 'var(--elevation-1)' }} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Speaks navigation cues when hovering zones or selecting routes.
                </p>
              </div>

            </div>
          </div>

          {/* Lift Cores Status */}
          <div
            className="p-5 md:p-6 space-y-4"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" style={{ color: 'var(--brand-emerald)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Lift core status</h2>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Tap to cycle states</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {elevators.map(elv => (
                <div
                  key={elv.id}
                  onClick={() => toggleElevatorStatus(elv.id)}
                  className={`p-3 space-y-2 transition-all cursor-pointer ${elv.status === 'maintenance' ? 'animate-pulse' : ''}`}
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    border: elv.status === 'active'
                      ? '1px solid var(--brand-emerald)'
                      : elv.status === 'standby'
                        ? '1px solid var(--border-subtle)'
                        : '1px solid var(--brand-red)',
                    background: elv.status === 'active'
                      ? 'var(--color-green-50)'
                      : elv.status === 'standby'
                        ? 'var(--surface-elevated)'
                        : 'var(--color-red-50)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate max-w-[70%]" style={{ color: 'var(--text-primary)' }}>
                      {elv.name}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: elv.status === 'active'
                          ? 'var(--color-green-50)'
                          : elv.status === 'standby'
                            ? 'var(--surface-sunken)'
                            : 'var(--color-red-50)',
                        color: elv.status === 'active'
                          ? 'var(--brand-emerald)'
                          : elv.status === 'standby'
                            ? 'var(--text-tertiary)'
                            : 'var(--brand-red)',
                        border: elv.status === 'active'
                          ? '1px solid var(--brand-emerald)'
                          : elv.status === 'standby'
                            ? '1px solid var(--border-subtle)'
                            : '1px solid var(--brand-red)',
                      }}
                    >
                      {elv.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{elv.deck}</p>
                  <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>
                      Load: <span style={{ fontFamily: 'var(--font-mono)' }}>{elv.load}</span>
                    </span>
                    <span style={{ color: elv.health > 80 ? 'var(--brand-emerald)' : 'var(--brand-red)', fontFamily: 'var(--font-mono)' }}>
                      Health: {elv.health}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Active Assistance Dispatch Requests */}
        <div
          className="lg:col-span-5 p-5 md:p-6 space-y-5"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--elevation-1)',
          }}
        >
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: 'var(--brand-emerald)' }} />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Assistance requests</h2>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--color-amber-50)',
                color: 'var(--brand-gold)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {requests.filter(r => r.status === 'pending').length} pending
            </span>
          </div>

          <div className="space-y-3">
            {requests.map(req => (
              <div 
                key={req.id}
                className="p-4 space-y-3"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  border: req.status === 'pending'
                    ? '1px solid var(--border-subtle)'
                    : '1px solid var(--brand-emerald)',
                  background: req.status === 'pending'
                    ? 'var(--surface-elevated)'
                    : 'var(--color-green-50)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{req.type}</h4>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{req.id}</span> · {req.location}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: req.status === 'pending' ? 'var(--color-amber-50)' : 'var(--color-green-50)',
                      color: req.status === 'pending' ? 'var(--brand-gold)' : 'var(--brand-emerald)',
                      border: req.status === 'pending'
                        ? '1px solid var(--brand-gold)'
                        : '1px solid var(--brand-emerald)',
                    }}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{req.details}</p>

                {req.status === 'pending' && (
                  <button
                    onClick={() => handleDispatchSteward(req.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                      background: 'var(--brand-emerald)',
                      color: '#fff',
                      borderRadius: 'var(--radius-xl)',
                      border: 'none',
                      boxShadow: 'var(--elevation-2)',
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Dispatch steward
                  </button>
                )}
                
                {req.status === 'dispatched' && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold" style={{ color: 'var(--brand-emerald)' }}>
                    <ShieldCheck className="w-4 h-4" />
                    Steward dispatched
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </PageTransition>
  );
}
