'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Ticket, Accessibility, ArrowRight, User } from 'lucide-react';
import { useExperienceDirector, playConfirmationSound, playClickSound } from '../index';

export function TicketOnboardingModal() {
  const role = useExperienceDirector((s) => s.role);
  const onboardingCompleted = useExperienceDirector((s) => s.onboardingCompleted);
  const setOnboardingParams = useExperienceDirector((s) => s.setOnboardingParams);

  // Wizard state: 'google' | 'ticket' | 'accessibility'
  const [step, setStep] = useState<'google' | 'ticket' | 'accessibility'>('google');
  
  // Selection states
  const [ticketType, setTicketType] = useState<'standard' | 'vip'>('standard');
  const [accompanyingDisability, setAccompanyingDisability] = useState<boolean>(false);

  // If already completed onboarding or not in Fan role, don't show
  if (role !== 'fan' || onboardingCompleted) {
    return null;
  }

  const handleNextStep = () => {
    playClickSound();
    if (step === 'google') {
      setStep('ticket');
    } else if (step === 'ticket') {
      setStep('accessibility');
    }
  };

  const handleFinish = () => {
    playConfirmationSound();
    setOnboardingParams(ticketType, accompanyingDisability);
  };

  const stepVariants = {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number] } },
    exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.25, ease: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number] } }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 select-none"
      style={{
        background: 'hsla(40, 38%, 98%, 0.7)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden"
        style={{
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--elevation-4)',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
        }}
      >

        <AnimatePresence mode="wait">
          {step === 'google' && (
            <motion.div
              key="step-google"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsla(214, 86%, 55%, 0.08)' }}
                >
                  <User className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome to Aetheris</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Spectator account verified</p>
                </div>
              </div>

              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Status</span>
                  <span className="font-medium flex items-center gap-1.5" style={{ color: 'var(--brand-emerald)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand-emerald)' }} />
                    Authorized
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-tertiary)' }}>Identity</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>spectator@aetheris.ai</span>
                </div>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Let&apos;s set up your ticket type and accessibility preferences to personalize your stadium experience.
              </p>

              <button
                onClick={handleNextStep}
                className="w-full py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: 'var(--brand-blue)',
                  color: 'white',
                  boxShadow: 'var(--glow-blue)',
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'ticket' && (
            <motion.div
              key="step-ticket"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsla(214, 86%, 55%, 0.08)' }}
                >
                  <Ticket className="w-5 h-5" style={{ color: 'var(--brand-blue)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ticket Type</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Select your admission level</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Standard option */}
                <div
                  onClick={() => { playClickSound(); setTicketType('standard'); }}
                  className="p-4 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                  style={{
                    background: ticketType === 'standard' ? 'var(--color-blue-50)' : 'var(--surface-sunken)',
                    border: `1px solid ${ticketType === 'standard' ? 'hsla(214, 86%, 55%, 0.2)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Standard Admission</span>
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Standard gates, concessions, and seating.</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      border: `2px solid ${ticketType === 'standard' ? 'var(--brand-blue)' : 'var(--border-strong)'}`,
                      background: ticketType === 'standard' ? 'var(--brand-blue)' : 'transparent',
                    }}
                  >
                    {ticketType === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* VIP option */}
                <div
                  onClick={() => { playClickSound(); setTicketType('vip'); }}
                  className="p-4 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                  style={{
                    background: ticketType === 'vip' ? 'var(--color-blue-50)' : 'var(--surface-sunken)',
                    border: `1px solid ${ticketType === 'vip' ? 'hsla(214, 86%, 55%, 0.2)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>VIP Lounge</span>
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>VIP express routes and premium elevators.</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      border: `2px solid ${ticketType === 'vip' ? 'var(--brand-blue)' : 'var(--border-strong)'}`,
                      background: ticketType === 'vip' ? 'var(--brand-blue)' : 'transparent',
                    }}
                  >
                    {ticketType === 'vip' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: 'var(--brand-blue)',
                  color: 'white',
                  boxShadow: 'var(--glow-blue)',
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'accessibility' && (
            <motion.div
              key="step-accessibility"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsla(160, 84%, 39%, 0.08)' }}
                >
                  <Accessibility className="w-5 h-5" style={{ color: 'var(--brand-emerald)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Accessibility</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Step-free routing preferences</p>
                </div>
              </div>

              <div
                className="p-4 rounded-xl space-y-4"
                style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Mobility assistance needed?</span>
                    <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Prioritize step-free paths, elevators, and ramps.</p>
                  </div>
                  <button
                    onClick={() => { playClickSound(); setAccompanyingDisability(!accompanyingDisability); }}
                    className="w-10 h-6 rounded-full transition-all relative flex items-center p-0.5 cursor-pointer"
                    style={{
                      background: accompanyingDisability ? 'var(--brand-blue)' : 'var(--border-strong)',
                    }}
                  >
                    <motion.div
                      layout
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                      animate={{ x: accompanyingDisability ? 14 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                When enabled, all navigation routes will prioritize elevators, lifts, and ramps for a fully step-free experience.
              </p>

              <button
                onClick={handleFinish}
                className="w-full py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: 'var(--brand-blue)',
                  color: 'white',
                  boxShadow: 'var(--glow-blue)',
                }}
              >
                Start Exploring
                <ShieldCheck className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
