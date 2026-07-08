import * as THREE from "three";

export class RouteAnimator {
  private static curveCache: Map<string, THREE.CatmullRomCurve3> = new Map();

  /**
   * Generates or retrieves a cached centripetal Catmull-Rom spline from a series of 3D points.
   * This avoids recreation inside the render loop.
   */
  public static getSpline(routeId: string, points: [number, number, number][]): THREE.CatmullRomCurve3 | null {
    if (points.length < 2) return null;

    const cacheKey = `${routeId}:${points.length}`;
    if (this.curveCache.has(cacheKey)) {
      return this.curveCache.get(cacheKey)!;
    }

    const vector3Points = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    // Use centripetal Catmull-Rom curve type for smooth pathing
    const curve = new THREE.CatmullRomCurve3(vector3Points, false, "centripetal");
    
    this.curveCache.set(cacheKey, curve);
    return curve;
  }

  /**
   * Clears the spline cache when routes are reset.
   */
  public static clearCache(): void {
    this.curveCache.clear();
  }

  /**
   * Computes the camera target and follow position along a spline at a given progress t.
   */
  public static sampleJourney(
    curve: THREE.CatmullRomCurve3,
    t: number,
    followDistance = 25,
    heightOffset = 18
  ): { target: THREE.Vector3; position: THREE.Vector3 } {
    const target = curve.getPointAt(t);

    // Get tangent vector at t to orient camera behind the travel direction
    const tangent = curve.getTangentAt(t).normalize();

    // Calculate camera position: behind target along tangent + height offset
    const position = target.clone()
      .sub(tangent.clone().multiplyScalar(followDistance))
      .add(new THREE.Vector3(0, heightOffset, 0));

    // Fallback if tangent calculations become singular/unstable at endpoints
    if (isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
      position.copy(target).add(new THREE.Vector3(followDistance, heightOffset, followDistance));
    }

    return { target, position };
  }
}
