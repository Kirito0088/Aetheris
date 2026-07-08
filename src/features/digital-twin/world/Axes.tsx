import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

export function Axes() {
  const axesVisible = useDigitalTwinStore((state) => state.environment.axesVisible);

  if (!axesVisible) return null;

  return <axesHelper args={[100]} />;
}
