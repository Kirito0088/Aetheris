import type { SpatialEntityConfig, EntityType, POICategory } from "../entities/types";
import { ZONE_DEFINITIONS, GATE_DEFINITIONS, POI_DEFINITIONS } from "./entity-definitions";

export class EntityRegistry {
  private static instance: EntityRegistry | null = null;
  private entities: Map<string, SpatialEntityConfig> = new Map();

  private constructor() {
    this.initialize();
  }

  public static getInstance(): EntityRegistry {
    if (!EntityRegistry.instance) {
      EntityRegistry.instance = new EntityRegistry();
    }
    return EntityRegistry.instance;
  }

  private initialize() {
    // Load static definitions
    [...ZONE_DEFINITIONS, ...GATE_DEFINITIONS, ...POI_DEFINITIONS].forEach((entity) => {
      this.register(entity);
    });
  }

  /**
   * Registers a new spatial entity in the system.
   * Enables dynamic runtime registration by future systems.
   */
  public register(entity: SpatialEntityConfig): void {
    if (this.entities.has(entity.id)) {
      console.warn(`Entity with ID ${entity.id} is already registered. Overwriting.`);
    }
    this.entities.set(entity.id, entity);
  }

  /**
   * Unregisters an entity by ID.
   */
  public unregister(id: string): boolean {
    return this.entities.delete(id);
  }

  /**
   * Retrieves all registered entities.
   */
  public getAll(): SpatialEntityConfig[] {
    return Array.from(this.entities.values());
  }

  /**
   * Retrieves a single entity by its stable identifier.
   */
  public getById(id: string): SpatialEntityConfig | undefined {
    return this.entities.get(id);
  }

  /**
   * Filters entities by type (zone, gate, poi).
   */
  public getByType(type: EntityType): SpatialEntityConfig[] {
    return this.getAll().filter((entity) => entity.type === type);
  }

  /**
   * Filters POIs by their category.
   */
  public getByCategory(category: POICategory): SpatialEntityConfig[] {
    return this.getAll().filter(
      (entity) => entity.type === "poi" && entity.metadata.category === category
    );
  }

  /**
   * Searches entities by name or description.
   */
  public search(query: string): SpatialEntityConfig[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((entity) => {
      const nameMatch = entity.name.toLowerCase().includes(lowerQuery);
      const descMatch =
        entity.metadata.description &&
        String(entity.metadata.description).toLowerCase().includes(lowerQuery);
      return nameMatch || descMatch;
    });
  }

  /**
   * Finds entities within a given radius in 3D space.
   */
  public getNearby(position: [number, number, number], radius: number): SpatialEntityConfig[] {
    const [x1, y1, z1] = position;
    return this.getAll().filter((entity) => {
      const [x2, y2, z2] = entity.position;
      const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
      return distance <= radius;
    });
  }

  /**
   * Resets the registry to initial static definitions.
   */
  public reset(): void {
    this.entities.clear();
    this.initialize();
  }
}
