/**
 * Experience Feature Layer
 * Decoupled interactive, cinematic, and sensory enhancements.
 */

export { MOTION_TIMINGS, MOTION_EASINGS } from './tokens/motion-tokens';
export type { MotionTiming } from './tokens/motion-tokens';

export { useExperienceDirector, SYSTEM_STEPS } from './director/ExperienceDirector';
export type { ExperienceState, SystemStep, BootStepDescription } from './director/ExperienceDirector';

export { LoadingExperience } from './transitions/LoadingExperience';
export { CameraExperienceManager } from './camera/CameraExperienceManager';
export { LandingCameraController } from './camera/LandingCameraController';
export { EnvironmentalSystems } from './environment/EnvironmentalSystems';
export { playConfirmationSound, playClickSound } from './audio/useSynthAudio';
export { TicketOnboardingModal } from './ui/TicketOnboardingModal';
