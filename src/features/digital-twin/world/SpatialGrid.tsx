import { Grid } from '@react-three/drei';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function SpatialGrid() {
  const gridVisible = useDigitalTwinStore((state) => state.environment.gridVisible);

  if (!gridVisible) return null;

  return (
    <Grid
      position={[0, 0, 0]}
      args={[200, 200]}
      cellSize={10}
      cellThickness={1}
      cellColor="#333333"
      sectionSize={50}
      sectionThickness={1.5}
      sectionColor="#555555"
      fadeDistance={200}
      fadeStrength={1}
    />
  );
}
