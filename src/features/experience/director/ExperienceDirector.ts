/**
 * Experience Director
 * Central state machine for Phase 6.
 * Coordinates roles, preferences, and onboarding states.
 */

import { create } from 'zustand';

export type ExperienceRole = 'fan' | 'volunteer' | 'venue-operations';

interface ExperienceStore {
  // Experience Role Selection
  role: ExperienceRole;
  setRole: (role: ExperienceRole) => void;

  // Onboarding state for simulated Fan flow
  ticketType: 'standard' | 'vip' | null;
  accompanyingDisability: boolean;
  onboardingCompleted: boolean;
  
  setOnboardingParams: (ticketType: 'standard' | 'vip', accompanyingDisability: boolean) => void;
  resetOnboarding: () => void;
  syncFromStorage: () => void;

  // App-wide Audio Context
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

export const useExperienceDirector = create<ExperienceStore>((set) => ({
  role: 'fan',

  ticketType: null,
  accompanyingDisability: false,
  onboardingCompleted: false,
  
  setOnboardingParams: (ticketType, accompanyingDisability) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheris_onboarding_completed', 'true');
      localStorage.setItem('aetheris_ticket_type', ticketType);
      localStorage.setItem('aetheris_accompanying_disability', String(accompanyingDisability));
    }
    set({ ticketType, accompanyingDisability, onboardingCompleted: true });
  },
  
  resetOnboarding: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aetheris_onboarding_completed');
      localStorage.removeItem('aetheris_ticket_type');
      localStorage.removeItem('aetheris_accompanying_disability');
    }
    set({ ticketType: null, accompanyingDisability: false, onboardingCompleted: false });
  },

  syncFromStorage: () => {
    if (typeof window !== 'undefined') {
      const isOps = window.location.pathname.startsWith('/operations') || window.location.pathname.startsWith('/venue-operations');
      
      if (isOps) {
        localStorage.setItem('aetheris_role', 'venue-operations');
        set({
          role: 'venue-operations',
          onboardingCompleted: false,
          ticketType: null,
          accompanyingDisability: false
        });
        return;
      }

      const savedRole = localStorage.getItem('aetheris_role') as ExperienceRole | null;
      const isCompleted = localStorage.getItem('aetheris_onboarding_completed') === 'true';
      const savedTicket = localStorage.getItem('aetheris_ticket_type') as 'standard' | 'vip' | null;
      const savedDisability = localStorage.getItem('aetheris_accompanying_disability') === 'true';

      set({
        role: savedRole || 'fan',
        onboardingCompleted: isCompleted,
        ticketType: savedTicket,
        accompanyingDisability: savedDisability
      });
    }
  },

  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  
  setRole: (role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheris_role', role);
    }
    set({ role });
  }
}));
