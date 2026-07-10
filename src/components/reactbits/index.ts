/**
 * ReactBits registry components (Phase 6).
 *
 * These files were fetched from the ReactBits shadcn-compatible registry
 * (https://reactbits.dev/r/{name}) — see components.json `registries.@reactbits`
 * — and adapted only at the import layer: the registry ships `motion/react`
 * imports, and this project already depends on `framer-motion@12` (which
 * exposes the identical hook surface), so imports were repointed to avoid
 * adding a duplicate animation dependency. Component logic is unchanged.
 *
 * Provenance and per-component rationale are documented in
 * docs/REACTBITS_INTEGRATION.md.
 */
export { default as CountUp } from './CountUp';
export { default as ShinyText } from './ShinyText';
export { default as GradientText } from './GradientText';
export { default as SpotlightCard } from './SpotlightCard';
