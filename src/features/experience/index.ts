/**
 * Experience Feature Layer
 * Decoupled interactive and sensory enhancements.
 */

export { MOTION_TIMINGS, MOTION_EASINGS } from './tokens/motion-tokens';
export type { MotionTiming } from './tokens/motion-tokens';

export { useExperienceDirector } from './director/ExperienceDirector';
export type { ExperienceRole } from './director/ExperienceDirector';

export { playConfirmationSound, playClickSound } from './audio/useSynthAudio';
