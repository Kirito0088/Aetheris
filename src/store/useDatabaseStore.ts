import { create } from 'zustand';

// ============================================================================
// DATABASE SCHEMA TYPES (Mirrors future Supabase tables)
// ============================================================================

export type Priority = 'high' | 'medium' | 'low';
export type CrowdDensity = 'low' | 'medium' | 'high' | 'critical';

export interface DBTicket {
  id: string;
  userId: string;
  match: string;
  date: string;
  gate: string;
  sector: string;
  row: string;
  seat: string;
  status: 'valid' | 'scanned';
}

export interface DBZone {
  id: string;
  name: string;
  crowdDensity: CrowdDensity;
  metrics: {
    throughput: number; // people per minute
    capacity: number;   // max people allowed
  };
}

export interface DBIncident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'resolved';
  priority: Priority;
  locationZoneId: string;
  reportedAt: string; // ISO Date
}

export interface DBTask {
  id: string;
  title: string;
  description: string;
  type: 'incident' | 'assistance' | 'logistics';
  priority: Priority;
  status: 'pending' | 'active' | 'completed';
  assignedTo: string | null;
  createdAt: string; // ISO Date
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface DatabaseState {
  // Tables
  tickets: Record<string, DBTicket>;
  zones: Record<string, DBZone>;
  incidents: Record<string, DBIncident>;
  tasks: Record<string, DBTask>;

  // Actions (Simulating DB mutations)
  updateZoneMetric: (id: string, throughput: number, density: CrowdDensity) => void;
  reportIncident: (incident: Omit<DBIncident, 'id' | 'reportedAt'>) => string;
  acceptTask: (taskId: string, volunteerId: string) => void;
  completeTask: (taskId: string) => void;
}

// ============================================================================
// MOCK SEED DATA
// ============================================================================

const seedTickets: Record<string, DBTicket> = {
  'ticket-1': {
    id: 'ticket-1',
    userId: 'user-jd',
    match: 'Mexico vs Argentina',
    date: 'July 4, 2026',
    gate: 'Gate C',
    sector: '104',
    row: 'G',
    seat: '22',
    status: 'valid',
  }
};

const seedZones: Record<string, DBZone> = {
  'north-gate': { id: 'north-gate', name: 'North Gate (Access C)', crowdDensity: 'high', metrics: { throughput: 120, capacity: 5000 } },
  'south-gate': { id: 'south-gate', name: 'South Gate (Access A)', crowdDensity: 'low', metrics: { throughput: 45, capacity: 5000 } },
  'sector-104': { id: 'sector-104', name: 'Sector 104', crowdDensity: 'medium', metrics: { throughput: 0, capacity: 800 } },
  'vip-lounge': { id: 'vip-lounge', name: 'VIP Lounge', crowdDensity: 'low', metrics: { throughput: 10, capacity: 300 } },
  'concourse-east': { id: 'concourse-east', name: 'East Concourse', crowdDensity: 'critical', metrics: { throughput: 350, capacity: 2000 } },
};

const seedIncidents: Record<string, DBIncident> = {
  'inc-1': {
    id: 'inc-1',
    title: 'Crowd Congestion',
    description: 'Severe bottleneck forming at main turnstiles.',
    status: 'open',
    priority: 'high',
    locationZoneId: 'north-gate',
    // Fixed fixture timestamps keep SSR and client hydration deterministic.
    reportedAt: '2026-07-04T16:55:00.000Z',
  }
};

const seedTasks: Record<string, DBTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Crowd Control Assist',
    description: 'Deploy to Gate C to assist with crowd dispersion. Guide fans to Gate D if possible.',
    type: 'logistics',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    createdAt: '2026-07-04T16:50:00.000Z',
  },
  'task-2': {
    id: 'task-2',
    title: 'Wheelchair Assistance',
    description: 'Fan requested assistance from Entry Gate A to Section 102.',
    type: 'assistance',
    priority: 'medium',
    status: 'pending',
    assignedTo: null,
    createdAt: '2026-07-04T16:35:00.000Z',
  }
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useDatabaseStore = create<DatabaseState>((set) => ({
  tickets: seedTickets,
  zones: seedZones,
  incidents: seedIncidents,
  tasks: seedTasks,

  updateZoneMetric: (id, throughput, density) => set((state) => {
    if (!state.zones[id]) return state;
    return {
      zones: {
        ...state.zones,
        [id]: {
          ...state.zones[id],
          crowdDensity: density,
          metrics: { ...state.zones[id].metrics, throughput }
        }
      }
    };
  }),

  reportIncident: (incident) => {
    const id = `inc-${Date.now()}`;
    const newIncident: DBIncident = {
      ...incident,
      id,
      reportedAt: new Date().toISOString()
    };
    set((state) => ({
      incidents: { ...state.incidents, [id]: newIncident }
    }));
    return id;
  },

  acceptTask: (taskId, volunteerId) => set((state) => {
    if (!state.tasks[taskId]) return state;
    return {
      tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], status: 'active', assignedTo: volunteerId }
      }
    };
  }),

  completeTask: (taskId) => set((state) => {
    if (!state.tasks[taskId]) return state;
    return {
      tasks: {
        ...state.tasks,
        [taskId]: { ...state.tasks[taskId], status: 'completed' }
      }
    };
  })
}));
