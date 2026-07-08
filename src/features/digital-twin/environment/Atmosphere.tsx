import { Sky } from '@react-three/drei';

export function Atmosphere() {
  return (
    <group>
      <fog attach="fog" args={['#0a0a0a', 50, 500]} />
      {/* We keep the sky subtle to maintain operational clarity */}
      <Sky
        distance={45000}
        sunPosition={[100, 150, 50]}
        inclination={0.49}
        azimuth={0.25}
        turbidity={0.1}
        rayleigh={0.1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
    </group>
  );
}
