/**
 * Stadium Configuration — Phase 6 Priority 1.1 GLB-Anchored.
 *
 * All values are derived from the verified GLB bounding box analysis.
 * Optimized for the Jeju World Cup Stadium MVP — no multi-stadium abstraction.
 *
 * Post-transform world coordinates (after scale 0.40 + Y↔Z swap):
 *   X: -110 to +110 (east-west, stadium wider axis)
 *   Z: -100 to +100 (north-south, stadium narrower axis)
 *   Y:    0 to  32  (ground to roof peak)
 */

export const STADIUM_CONFIG = {
  // ─── Asset ────────────────────────────────────────────────────────
  asset: {
    path: '/models/stadium.glb' as const,
    name: 'KOREA Jeju World Cup Stadium 4K',
    attribution: {
      creator: 'Sketchfab Community',
      license: 'CC BY 4.0',
      source: 'Sketchfab',
      originalName: 'KOREA Jeju World Cup Stadium 4K gkb',
    },
  },

  // ─── Scene Adapter Transform ──────────────────────────────────────
  transform: {
    scale: [0.40, 0.40, 0.40] as const,
    position: [0, 1.0, 0] as const,
    rotation: [0, 0, 0] as const,
  },

  // ─── Verified Bounding Box ────────────────────────────────────────
  bounds: {
    raw: {
      min: [-274.55, -250.68, -2.46] as const,
      max: [273.64, 250.53, 79.03] as const,
      dimensions: [548.18, 501.21, 81.49] as const,
    },
    world: {
      // After scale 0.40 + Y↔Z swap applied
      xRange: [-110, 110] as const,
      zRange: [-100, 100] as const,
      yRange: [0, 32] as const,
    },
  },

  // ─── Camera Profiles ──────────────────────────────────────────────
  camera: {
    profiles: {
      hero: {
        position: [0, 65, 140] as const,
        target: [0, 6, 0] as const,
        fov: 45,
        transitionDuration: 3.5,
        damping: 0.4,
      },
      landing: {
        orbitRadius: 155,
        orbitHeight: 55,
        orbitSpeed: 0.04,
        lookAtTarget: [0, 6, 0] as const,
      },
      overview: {
        position: [0, 80, 130] as const,
        target: [0, 4, 0] as const,
        transitionDuration: 2,
        damping: 0.4,
      },
      navigation: {
        position: [0, 45, 85] as const,
        target: [0, 2, 0] as const,
        transitionDuration: 1.5,
        damping: 0.3,
      },
      operations: {
        position: [55, 50, 90] as const,
        target: [15, 4, -8] as const,
        transitionDuration: 1.5,
        damping: 0.3,
      },
      accessibility: {
        position: [-75, 22, 40] as const,
        target: [-68, 6, 4] as const,
        transitionDuration: 1.5,
        damping: 0.3,
      },
      journey: {
        transitionDuration: 1.0,
        damping: 0.2,
      },
      emergency: {
        position: [0, 120, 0.1] as const,
        target: [0, 0, 0] as const,
        transitionDuration: 0.8,
        damping: 0.1,
      },
    },
  },

  // ─── Lighting Presets ─────────────────────────────────────────────
  lighting: {
    presets: {
      matchDay: {
        sunPosition: [80, 120, 40] as const,
        sunIntensity: 1.4,
        ambientIntensity: 0.5,
        rimIntensity: 0.5,
        rimColor: '#88bbee',
        skyTurbidity: 0.06,
        skyRayleigh: 0.08,
        fogNear: 120,
        fogFar: 500,
      },
      goldenHour: {
        sunPosition: [200, 40, 80] as const,
        sunIntensity: 1.0,
        ambientIntensity: 0.35,
        rimIntensity: 0.7,
        rimColor: '#ffccaa',
        skyTurbidity: 2,
        skyRayleigh: 1,
        fogNear: 60,
        fogFar: 500,
      },
      morning: {
        sunPosition: [-80, 100, 120] as const,
        sunIntensity: 0.9,
        ambientIntensity: 0.45,
        rimIntensity: 0.4,
        rimColor: '#aaddff',
        skyTurbidity: 0.04,
        skyRayleigh: 0.06,
        fogNear: 100,
        fogFar: 700,
      },
      night: {
        sunPosition: [0, -50, 0] as const,
        sunIntensity: 0.05,
        ambientIntensity: 0.15,
        rimIntensity: 0.2,
        rimColor: '#223344',
        skyTurbidity: 0,
        skyRayleigh: 0,
        fogNear: 30,
        fogFar: 300,
      },
    },
    defaultPreset: 'matchDay' as const,
  },
} as const;

export type CameraProfile = keyof typeof STADIUM_CONFIG.camera.profiles;
export type LightingPreset = keyof typeof STADIUM_CONFIG.lighting.presets;
