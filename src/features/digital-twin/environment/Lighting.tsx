import { Environment } from "@react-three/drei";

export function Lighting() {
  return (
    <group>
      {/* Soft ambient base */}
      <ambientLight intensity={0.35} />
      
      {/* Primary directional light (sun) */}
      <directionalLight
        position={[100, 150, 50]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
        shadow-bias={-0.0005}
      />
      
      {/* Subtle fill light to soften shadows from the opposite side */}
      <directionalLight
        position={[-100, 50, -50]}
        intensity={0.4}
        color="#88bbee"
      />

      {/* Rim Light - Highlights structural edges for depth and visual separation */}
      <directionalLight 
        position={[0, 30, -80]} 
        intensity={0.5} 
        color="#ffffff" 
      />

      {/* HDRI Environment mapping for premium reflections on stadium materials */}
      <Environment preset="city" />
    </group>
  );
}
