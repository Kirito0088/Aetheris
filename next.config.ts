/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile Three.js and pmndrs packages for ESM compatibility with Next.js bundler.
  // Required for React Three Fiber to work in the App Router (ADR-003).
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],

  // Image optimisation configuration
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
