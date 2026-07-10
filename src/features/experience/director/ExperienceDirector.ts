/**
 * Experience Director
 * Central state machine for Phase 6 Foundation Stabilization.
 * Coordinates camera, lighting, environment, transitions, and initialization stages.
 */

import { create } from 'zustand';

export type ExperienceState = 
  | 'BOOTING'        // Initial app load, black screen and logo
  | 'INITIALIZING'   // Sequential check of active spatial/nav systems
  | 'READY'          // All system checks succeeded, ready to show
  | 'REVEAL'         // Fading in, light sweeps, camera drone establishing fly-in
  | 'INTERACTIVE'    // Full operational user control, HUD visible
  | 'FOCUS'          // Camera frames a selected entity, background dimmed
  | 'ROUTE'          // Active path follow camera animation
  | 'IDLE';          // Passive idle stadium breathing

export type SystemStep = 'experience' | 'renderer' | 'spatial' | 'navigation' | 'environment' | 'camera';
export type ExperienceRole = 'fan' | 'organizer';

export interface SystemInitStatus {
  experience: 'pending' | 'success' | 'failed';
  renderer: 'pending' | 'success' | 'failed';
  spatial: 'pending' | 'success' | 'failed';
  navigation: 'pending' | 'success' | 'failed';
  environment: 'pending' | 'success' | 'failed';
  camera: 'pending' | 'success' | 'failed';
}

export interface BootStepDescription {
  id: SystemStep;
  label: string;
}

export const SYSTEM_STEPS: BootStepDescription[] = [
  { id: 'experience', label: 'Initializing Experience Director' },
  { id: 'renderer', label: 'Setting up WebGL & Canvas' },
  { id: 'spatial', label: 'Loading Digital Twin Spatial Layers' },
  { id: 'navigation', label: 'Building Egress Navigation Graph' },
  { id: 'environment', label: 'Synchronizing Environment & Lights' },
  { id: 'camera', label: 'Calibrating Drone Camera Controls' }
];

interface ExperienceStore {
  // Experience State Machine
  state: ExperienceState;
  setExperienceState: (state: ExperienceState) => void;

  // Experience Role Selection
  role: ExperienceRole;
  setRole: (role: ExperienceRole) => void;

  // System Initialization Status
  initStatus: SystemInitStatus;
  initError: string | null;
  setStepStatus: (step: SystemStep, status: 'pending' | 'success' | 'failed') => void;
  setInitError: (error: string | null) => void;
  resetInitialization: () => void;

  // Onboarding state for simulated Fan flow
  ticketType: 'standard' | 'vip' | null;
  accompanyingDisability: boolean;
  onboardingCompleted: boolean;
  setOnboardingParams: (ticketType: 'standard' | 'vip', accompanyingDisability: boolean) => void;
  resetOnboarding: () => void;

  // Persistence Sync
  syncFromStorage: () => void;

  // Reactive Camera Controls Registration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cameraControls: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCameraControls: (controls: any) => void;

  // Environment & Lighting Multipliers
  ambientIntensityMultiplier: number;
  gridOpacityMultiplier: number;
  setEnvironmentParams: (ambient: number, grid: number) => void;

  // Web Audio Toggle
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;

  // Selection & Hover
  hoveredEntityId: string | null;
  hoveredPosition: [number, number, number] | null;
  selectedEntityId: string | null;
  selectedPosition: [number, number, number] | null;

  setHoveredEntity: (id: string | null, position: [number, number, number] | null) => void;
  setSelectedEntity: (id: string | null, position: [number, number, number] | null) => void;
}

const initialInitStatus: SystemInitStatus = {
  experience: 'pending',
  renderer: 'pending',
  spatial: 'pending',
  navigation: 'pending',
  environment: 'pending',
  camera: 'pending'
};

export const useExperienceDirector = create<ExperienceStore>((set) => ({
  state: 'BOOTING',
  role: 'fan',
  initStatus: initialInitStatus,
  initError: null,
  cameraControls: null,

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
      const isOps = window.location.pathname.startsWith('/operations');
      
      if (isOps) {
        // Direct access to /operations always forces organizer role and skips fan onboarding
        localStorage.setItem('aetheris_role', 'organizer');
        set({
          role: 'organizer',
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

  ambientIntensityMultiplier: 0,
  gridOpacityMultiplier: 0,

  audioEnabled: false,

  hoveredEntityId: null,
  hoveredPosition: null,
  selectedEntityId: null,
  selectedPosition: null,

  setExperienceState: (state) => set(() => {
    // If transitioning to operational control states, fully establish bright multipliers
    if (state === 'INTERACTIVE' || state === 'FOCUS' || state === 'ROUTE' || state === 'IDLE') {
      return { 
        state, 
        ambientIntensityMultiplier: 1, 
        gridOpacityMultiplier: 1 
      };
    }
    return { state };
  }),

  setRole: (role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aetheris_role', role);
    }
    set({ role });
  },

  setStepStatus: (step, status) => set((state) => {
    const nextStatus = { ...state.initStatus, [step]: status };
    
    // Auto transition state to INITIALIZING once experience has successfully initialized
    let nextState = state.state;
    if (state.state === 'BOOTING' && nextStatus.experience === 'success') {
      nextState = 'INITIALIZING';
    }

    return { 
      initStatus: nextStatus,
      state: nextState
    };
  }),

  setInitError: (error) => set({ initError: error }),

  resetInitialization: () => set(() => ({
    state: 'BOOTING',
    initStatus: {
      experience: 'pending',
      renderer: 'pending',
      spatial: 'pending',
      navigation: 'pending',
      environment: 'pending',
      camera: 'pending'
    },
    initError: null,
    cameraControls: null,
    ambientIntensityMultiplier: 0,
    gridOpacityMultiplier: 0,
    hoveredEntityId: null,
    selectedEntityId: null
  })),

  setCameraControls: (controls) => set((state) => {
    const nextStatus = { ...state.initStatus };
    if (controls) {
      nextStatus.camera = 'success';
    } else {
      nextStatus.camera = 'pending';
    }
    return {
      cameraControls: controls,
      initStatus: nextStatus
    };
  }),

  setEnvironmentParams: (ambient, grid) => set({
    ambientIntensityMultiplier: ambient,
    gridOpacityMultiplier: grid,
  }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  setHoveredEntity: (id, position) => set((prev) => {
    // Navigate state between IDLE and INTERACTIVE dynamically based on hovering
    const nextState = prev.state === 'INTERACTIVE' || prev.state === 'IDLE'
      ? (id ? 'IDLE' : 'INTERACTIVE')
      : prev.state;
    return {
      hoveredEntityId: id,
      hoveredPosition: position,
      state: nextState
    };
  }),

  setSelectedEntity: (id, position) => set(() => {
    const nextState = id ? 'FOCUS' : 'INTERACTIVE';
    return {
      selectedEntityId: id,
      selectedPosition: position,
      state: nextState
    };
  }),
}));
