# ADR-003 — Adopt React Three Fiber as the 3D Rendering Framework

> **Status:** Accepted
>
> **Date:** July 2026
>
> **Decision Makers:** Team Aetheris
>
> **Category:** Frontend Architecture
>
> **Supersedes:** None
>
> **Superseded By:** None

---

# Context

Aetheris is fundamentally built around the concept of a Living Digital Twin.

Unlike conventional dashboards or navigation applications, the primary interface of Aetheris is an interactive three-dimensional representation of the stadium.

The selected rendering framework must support:

- immersive 3D environments
- seamless integration with React
- high rendering performance
- interactive spatial interfaces
- reusable component architecture
- scalable scene management
- maintainable development workflows

The rendering engine therefore becomes a foundational architectural decision.

---

# Problem

Traditional web interfaces communicate operational information through menus, dashboards, charts, and tables.

While these approaches are effective for many enterprise systems, they are less suitable for communicating spatial relationships inside a stadium.

Aetheris requires users to understand:

- physical locations
- crowd movement
- navigation routes
- accessibility paths
- operational alerts
- transportation zones

These concepts are inherently spatial.

Representing them within two-dimensional interfaces introduces unnecessary cognitive effort.

---

# Decision

Aetheris will adopt **React Three Fiber (R3F)** as the primary framework for all interactive three-dimensional experiences.

Three.js will remain the underlying rendering engine, while React Three Fiber provides the declarative React renderer responsible for scene composition, lifecycle management, and integration with the React ecosystem.

Supporting libraries from the pmndrs ecosystem (such as Drei and React Postprocessing) will be used where appropriate.

---

# Rationale

React Three Fiber aligns closely with the architectural goals established by ADR-001 and ADR-002.

## Native React Integration

React Three Fiber allows three-dimensional scenes to behave as first-class React components.

This enables:

- reusable scene components
- predictable state management
- shared application state
- declarative rendering
- easier maintenance

Instead of managing separate UI and rendering systems, Aetheris operates within a unified React architecture.

---

## Component-Based Scene Architecture

Every spatial element can become an independent component.

Examples include:

- Stadium
- Gate
- Parking Zone
- Seating Block
- Crowd Layer
- Navigation Route
- Emergency Marker
- Accessibility Layer

This modular structure improves maintainability and reuse across the application.

---

## Ecosystem Maturity

React Three Fiber benefits from the mature pmndrs ecosystem.

Useful capabilities include:

- camera controls
- model loading
- post-processing
- animation utilities
- environment lighting
- performance helpers

These reduce implementation complexity while maintaining production quality.

---

## React State Synchronization

Operational data and 3D visualization remain synchronized through shared React state.

Examples include:

- crowd density updates
- AI recommendations
- navigation routes
- operational alerts
- transportation changes

The interface becomes a live reflection of application state rather than a disconnected rendering surface.

---

## Long-Term Maintainability

The declarative programming model improves readability and maintainability compared to imperative scene management.

This is especially important as the Living Digital Twin evolves over time.

---

# Alternatives Considered

## Option A — Three.js (Imperative)

Advantages

- maximum flexibility
- direct engine access
- extensive documentation

Reasons Rejected

- imperative scene management
- greater boilerplate
- weaker React integration
- duplicated lifecycle management
- higher maintenance cost

---

## Option B — Babylon.js

Advantages

- complete engine
- rich feature set
- editor ecosystem

Reasons Rejected

- larger engine footprint
- reduced alignment with React architecture
- unnecessary complexity for project requirements

---

## Option C — Spline

Advantages

- rapid visual prototyping
- designer-friendly workflow

Reasons Rejected

- limited engineering flexibility
- reduced programmatic control
- unsuitable as the primary interaction framework

Spline may still be used for experimentation or asset creation, but not as the rendering foundation.

---

## Option D — Unity WebGL

Advantages

- powerful rendering
- mature tooling
- game-engine capabilities

Reasons Rejected

- significantly larger bundle sizes
- slower loading
- disconnected frontend architecture
- reduced SEO
- more difficult web integration

---

## Option E — Two-Dimensional Interface

Advantages

- lower implementation complexity
- broader device compatibility

Reasons Rejected

- inconsistent with the product vision
- weaker spatial communication
- less memorable experience
- reduced differentiation

---

## Selected Option

React Three Fiber with Three.js.

---

# Consequences

Positive

- seamless React integration
- reusable scene components
- maintainable architecture
- rich ecosystem
- strong developer experience
- immersive user experience
- excellent support for the Living Digital Twin

Negative

- increased frontend complexity
- higher GPU requirements
- steeper learning curve
- careful performance optimization required

These trade-offs are acceptable because the Living Digital Twin is the defining interaction model of Aetheris.

---

# Architectural Rules

This decision establishes the following implementation rules.

## Rule 1

Every significant three-dimensional object should be represented as an independent React component.

---

## Rule 2

Scene state should originate from shared application state rather than internal object state whenever practical.

---

## Rule 3

Three-dimensional interactions must remain synchronized with application data.

No duplicated state should exist between the UI and the 3D scene.

---

## Rule 4

Visual realism should never compromise interaction performance.

Responsiveness takes priority over graphical complexity.

---

## Rule 5

Three-dimensional scenes must communicate operational intelligence.

Decorative 3D elements without functional purpose should be avoided.

---

## Rule 6

Progressive enhancement should be applied.

Devices incapable of rendering advanced visual effects should continue to receive a functional experience.

---

# Performance Guidelines

The Living Digital Twin should be engineered for efficiency.

Strategies include:

- lazy loading
- code splitting
- compressed assets
- optimized GLTF models
- Level of Detail (LOD)
- frustum culling
- efficient texture usage
- selective post-processing

The objective is consistent responsiveness on mid-range consumer hardware.

---

# Impact

This decision directly influences:

- User Experience
- Frontend Architecture
- Component Architecture
- Rendering Pipeline
- Animation System
- Navigation Experience
- Spatial Intelligence Engine
- Performance Optimization

Future frontend decisions should remain compatible with this rendering architecture.

---

# Related ADRs

- ADR-001 — Project Direction
- ADR-002 — Next.js (App Router)
- ADR-006 — Living Digital Twin

---

# Notes

The Living Digital Twin represents the primary interaction model of Aetheris.

React Three Fiber is adopted not because it enables three-dimensional graphics, but because it enables those graphics to become an integral part of the React application architecture.

This decision ensures that the 3D environment is not an isolated visualization layer, but a first-class component of the product itself.

---

**End of ADR-003**