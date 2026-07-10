'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceDirector, SYSTEM_STEPS, playClickSound, playConfirmationSound } from '../index';
import type { SystemStep } from '../index';
import { GraphBuilder } from '../../navigation/graph/GraphBuilder';
import { useDigitalTwinStore } from '../../digital-twin/store/useDigitalTwinStore';
import { MOTION_TIMINGS, MOTION_EASINGS } from '../tokens/motion-tokens';
import { RotateCcw, Home, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

export function LoadingExperience() {
  const router = useRouter();
  
  // Experience Director store states
  const state = useExperienceDirector((s) => s.state);
  const initStatus = useExperienceDirector((s) => s.initStatus);
  const initError = useExperienceDirector((s) => s.initError);
  const reducedMotion = useDigitalTwinStore((s) => s.environment.reducedMotion);
  
  const setStepStatus = useExperienceDirector((s) => s.setStepStatus);
  const setInitError = useExperienceDirector((s) => s.setInitError);
  const setExperienceState = useExperienceDirector((s) => s.setExperienceState);
  const resetInitialization = useExperienceDirector((s) => s.resetInitialization);

  const [statusMessage, setStatusMessage] = useState('Preparing stadium…');

  // Helper to defer state changes
  const updateMessage = useCallback((msg: string) => {
    setTimeout(() => setStatusMessage(msg), 0);
  }, []);

  // 1. Boot phase
  useEffect(() => {
    if (state === 'BOOTING') {
      updateMessage('Connecting to stadium twin…');
    }
  }, [state, updateMessage]);

  // 2. Real System Initialization steps
  useEffect(() => {
    if (state === 'BOOTING') {
      setStepStatus('experience', 'success');
      updateMessage('Building navigation graph…');
      playClickSound();

      try {
        GraphBuilder.build();
        setStepStatus('navigation', 'success');
        updateMessage('Navigation ready');
        playClickSound();
      } catch {
        setStepStatus('navigation', 'failed');
        setInitError('Failed to build navigation graph.');
      }
    }
  }, [state, setStepStatus, setInitError, updateMessage]);

  // 3. Monitor initialization steps
  useEffect(() => {
    if (state === 'INITIALIZING') {
      if (initStatus.renderer === 'success') {
        updateMessage('Rendering engine ready');
      }
      if (initStatus.spatial === 'success') {
        updateMessage('Stadium model loaded');
      }
      if (initStatus.environment === 'success') {
        updateMessage('Environment synchronized');
      }
      if (initStatus.camera === 'success') {
        updateMessage('Camera calibrated');
      }
    }
  }, [initStatus, state, updateMessage]);

  // 4. All checks passed → READY
  useEffect(() => {
    if (state === 'INITIALIZING') {
      const allSuccess = Object.values(initStatus).every((status) => status === 'success');
      if (allSuccess) {
        setExperienceState('READY');
        playConfirmationSound();
        updateMessage('All systems ready');
      }
    }
  }, [initStatus, state, setExperienceState, updateMessage]);

  // 5. READY → REVEAL
  useEffect(() => {
    if (state === 'READY') {
      const timer = setTimeout(() => {
        setExperienceState('REVEAL');
      }, MOTION_TIMINGS.context);
      return () => clearTimeout(timer);
    }
  }, [state, setExperienceState]);

  // 6. REVEAL → INTERACTIVE
  useEffect(() => {
    if (state === 'REVEAL') {
      const timer = setTimeout(() => {
        setExperienceState('INTERACTIVE');
      }, reducedMotion ? 100 : 2400);
      return () => clearTimeout(timer);
    }
  }, [state, setExperienceState, reducedMotion]);

  // 7. Safety timeout
  useEffect(() => {
    if (state === 'BOOTING' || state === 'INITIALIZING') {
      const timer = setTimeout(() => {
        const status = useExperienceDirector.getState().initStatus;
        let blockingStep: SystemStep | null = null;
        
        for (const key of Object.keys(status) as SystemStep[]) {
          if (status[key] === 'pending') {
            setStepStatus(key, 'failed');
            if (!blockingStep) blockingStep = key;
          }
        }

        const msg = blockingStep 
          ? `Verification failed at step: '${SYSTEM_STEPS.find(s => s.id === blockingStep)?.label || blockingStep}'.`
          : 'System verification timed out.';
        
        setInitError(msg);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [state, setStepStatus, setInitError]);

  // If interactive, hide
  if (state !== 'BOOTING' && state !== 'INITIALIZING' && state !== 'READY' && state !== 'REVEAL') {
    return null;
  }

  const totalStepsCount = SYSTEM_STEPS.length;
  const completedCount = Object.values(initStatus).filter((s) => s === 'success').length;
  const progressPercent = Math.round((completedCount / totalStepsCount) * 100);

  const handleRetry = () => {
    playConfirmationSound();
    resetInitialization();
  };

  const handleReturnHome = () => {
    playConfirmationSound();
    resetInitialization();
    router.push('/');
  };

  return (
    <AnimatePresence>
      {(state === 'BOOTING' || state === 'INITIALIZING' || state === 'READY' || state === 'REVEAL') && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_TIMINGS.hero / 1000, ease: MOTION_EASINGS.emphasized }}
          className="fixed inset-0 w-full h-full z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background: 'var(--surface-base)',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="w-full max-w-md px-6 flex flex-col items-center space-y-8 z-10">
            
            {initError ? (
              /* ERROR STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full rounded-2xl p-6 md:p-8 space-y-6"
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--elevation-3)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-red-50)' }}
                  >
                    <ShieldAlert className="w-5 h-5" style={{ color: 'var(--brand-red)' }} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Loading Failed
                    </h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--brand-red)' }}>{initError}</p>
                  </div>
                </div>

                {/* Subsystem Status */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <div className="text-[10px] font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    System Status
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    {SYSTEM_STEPS.map((step) => {
                      const status = initStatus[step.id];
                      return (
                        <div 
                          key={step.id} 
                          className="flex items-center justify-between p-2 rounded-lg"
                          style={{ background: 'var(--surface-sunken)' }}
                        >
                          <span style={{ color: 'var(--text-secondary)' }}>{step.label}</span>
                          <span
                            className="font-semibold text-[9px]"
                            style={{
                              color: status === 'success' ? 'var(--brand-emerald)' :
                                     status === 'failed' ? 'var(--brand-red)' : 'var(--text-disabled)',
                            }}
                          >
                            {status === 'success' ? '✓' : status === 'failed' ? '✗' : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleRetry}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    style={{ background: 'var(--brand-blue)', color: 'white', boxShadow: 'var(--glow-blue)' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry
                  </button>
                  <button
                    onClick={handleReturnHome}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      background: 'var(--surface-sunken)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              </motion.div>
            ) : (
              /* LOADING STATE */
              <div className="flex flex-col items-center space-y-8 w-full">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-3"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--brand-blue)', color: 'white' }}
                  >
                    <span className="text-sm font-bold">A</span>
                  </div>
                  <h1
                    className="text-lg font-bold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Aetheris
                  </h1>
                </motion.div>

                {/* Progress */}
                <div className="w-full max-w-xs space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div
                      className="w-full h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--border-default)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'var(--brand-blue)', boxShadow: 'var(--glow-blue)' }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: MOTION_TIMINGS.feedback / 1000, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: 'var(--text-tertiary)' }}>{statusMessage}</span>
                      <span
                        className="font-medium"
                        style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-mono)' }}
                      >
                        {progressPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Step indicators */}
                  <div className="space-y-1.5">
                    {SYSTEM_STEPS.map((step) => {
                      const status = initStatus[step.id];
                      return (
                        <div
                          key={step.id}
                          className="flex items-center justify-between py-1 text-[10px]"
                        >
                          <span style={{ color: status === 'success' ? 'var(--text-primary)' : 'var(--text-disabled)' }}>
                            {step.label}
                          </span>
                          {status === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--brand-emerald)' }} />
                          ) : (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--text-disabled)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-center" style={{ color: 'var(--text-disabled)' }}>
                  FIFA World Cup 2026 · Lusail Stadium
                </div>
              </div>
            )}
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default LoadingExperience;
