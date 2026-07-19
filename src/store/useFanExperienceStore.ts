import { create } from 'zustand';

export type CrowdDensity = 'low' | 'medium' | 'high' | 'critical';

export interface StadiumZone {
  id: string;
  name: string;
  density: CrowdDensity;
  description: string;
}

export interface DigitalTicket {
  match: string;
  date: string;
  gate: string;
  sector: string;
  row: string;
  seat: string;
  kickoffTime: string; // ISO String
}

export interface FanAlert {
  id: string;
  title: string;
  description: string;
  type: 'routing' | 'info' | 'urgent';
  actionLabel?: string;
}

interface FanExperienceState {
  activeZoneId: string | null;
  zones: Record<string, StadiumZone>;
  ticket: DigitalTicket;
  alerts: FanAlert[];
  
  // Actions
  setActiveZone: (id: string | null) => void;
  updateZoneDensity: (id: string, density: CrowdDensity) => void;
  dismissAlert: (id: string) => void;
  setTicket: (ticket: DigitalTicket) => void;
  setAlerts: (alerts: FanAlert[]) => void;
}

// Initial mock data for Estadio Azteca Fan Experience
const initialZones: Record<string, StadiumZone> = {
  'north-gate': { id: 'north-gate', name: 'North Gate (Access C)', density: 'high', description: 'Main entry point. Currently experiencing high traffic.' },
  'south-gate': { id: 'south-gate', name: 'South Gate (Access A)', density: 'low', description: 'Alternative entry. Fast access recommended.' },
  'sector-104': { id: 'sector-104', name: 'Sector 104', density: 'medium', description: 'Your seating sector.' },
  'vip-lounge': { id: 'vip-lounge', name: 'VIP Lounge', density: 'low', description: 'Exclusive hospitality area.' },
  'concourse-east': { id: 'concourse-east', name: 'East Concourse', density: 'critical', description: 'Congested area near food vendors.' },
};

const initialTicket: DigitalTicket = {
  match: 'Mexico vs Argentina',
  date: 'July 4, 2026',
  gate: 'Gate C',
  sector: '104',
  row: 'G',
  seat: '22',
  kickoffTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 mins from now
};

const initialAlerts: FanAlert[] = [
  {
    id: 'alert-1',
    title: 'Smart Route Available',
    description: 'Gate C is currently busy. Routing you through Gate D will save you 12 minutes.',
    type: 'routing',
    actionLabel: 'Show Route'
  }
];

export const useFanExperienceStore = create<FanExperienceState>((set) => ({
  activeZoneId: null,
  zones: initialZones,
  ticket: initialTicket,
  alerts: initialAlerts,
  
  setActiveZone: (id) => set({ activeZoneId: id }),
  
  updateZoneDensity: (id, density) => set((state) => {
    if (!state.zones[id]) return state;
    return {
      zones: {
        ...state.zones,
        [id]: { ...state.zones[id], density }
      }
    };
  }),
  
  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== id)
  })),

  setTicket: (ticket) => set({ ticket }),
  setAlerts: (alerts) => set({ alerts })
}));
