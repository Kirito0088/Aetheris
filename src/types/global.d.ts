/**
 * Aetheris Global TypeScript Declarations
 *
 * Module augmentations and ambient declarations for non-TypeScript assets.
 */

// CSS side-effect imports (used in layout.tsx for globals.css)
// Allows `import "@/styles/globals.css"` without type errors.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// SVG imports as React components (for future use)
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// GLTF/GLB 3D model imports (for React Three Fiber — Phase 2)
declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.gltf" {
  const src: string;
  export default src;
}

// HDR environment maps (for Three.js — Phase 2)
declare module "*.hdr" {
  const src: string;
  export default src;
}
