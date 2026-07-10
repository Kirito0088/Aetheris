import { Grid } from '@react-three/drei';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { useExperienceDirector } from '../../experience/director/ExperienceDirector';

export function SpatialGrid() {
  const gridVisible = useDigitalTwinStore((state) => state.environment.gridVisible);
  const gridOpacity = useExperienceDirector((state) => state.gridOpacityMultiplier);

  if (!gridVisible) return null;

  // Calculate faded grid colors dynamically
  const cellColor = `rgba(180, 170, 155, ${gridOpacity * 0.3})`;
  const sectionColor = `rgba(160, 148, 130, ${gridOpacity * 0.5})`;

  return (
    <Grid
      position={[0, 0, 0]}
      args={[200, 200]}
      cellSize={10}
      cellThickness={1}
      cellColor={cellColor}
      sectionSize={50}
      sectionThickness={1.5}
      sectionColor={sectionColor}
      fadeDistance={200}
      fadeStrength={1}
    />
  );
}
