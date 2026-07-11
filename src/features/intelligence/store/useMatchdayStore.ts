import { create } from 'zustand';

export type MatchPhase = 
  | 'before-gates-open'
  | 'arrival'
  | 'pre-match'
  | 'kickoff'
  | 'first-half'
  | 'half-time'
  | 'second-half'
  | 'full-time'
  | 'exit';

interface MatchdayStore {
  currentPhase: MatchPhase;
  setPhase: (phase: MatchPhase) => void;
  
  // Computed values / derived context based on phase could be accessed through a hook, 
  // but for simplicity we keep state minimal here.
}

export const useMatchdayStore = create<MatchdayStore>((set) => ({
  currentPhase: 'pre-match',
  setPhase: (phase) => set({ currentPhase: phase }),
}));
