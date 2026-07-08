# ADR-002 — Adopt Next.js (App Router) as the Primary Web Framework

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

Aetheris is envisioned as a production-quality web platform rather than a hackathon prototype.

The application requires:

- immersive 3D experiences
- AI-powered workflows
- modern routing
- scalable frontend architecture
- secure server-side operations
- excellent developer experience
- production deployment
- future extensibility

The selected framework must support these requirements while minimizing architectural complexity.

---

# Problem

Selecting the wrong frontend framework would introduce unnecessary constraints throughout the lifetime of the project.

The framework influences:

- application architecture
- rendering strategy
- deployment
- performance
- security
- routing
- scalability
- developer productivity

Because nearly every feature depends upon this decision, it represents one of the most significant architectural choices within Aetheris.

---

# Decision

Aetheris will adopt **Next.js using the App Router architecture** as its primary web framework.

TypeScript will be mandatory across the entire codebase.

The project will follow the App Router model from the beginning rather than migrating from the legacy Pages Router.

---

# Rationale

Next.js aligns closely with the architectural goals established in ADR-001.

Key advantages include:

## Modern React Architecture

App Router embraces modern React capabilities including:

- Server Components
- Client Components
- Nested Layouts
- Streaming
- Route Groups

This provides a clean separation between interactive experiences and server-side responsibilities.

---

## Excellent Developer Experience

Next.js provides:

- intuitive routing
- strong TypeScript support
- excellent tooling
- mature ecosystem
- reliable documentation

These characteristics reduce implementation complexity while improving maintainability.

---

## Production Readiness

Next.js is widely adopted for production applications.

Its ecosystem supports:

- authentication
- API routes
- server rendering
- edge deployment
- asset optimization
- performance monitoring

This aligns with Aetheris' objective of resembling a deployable software product rather than a demonstration project.

---

## Secure Server Capabilities

Server-side execution enables:

- secure AI requests
- protected environment variables
- backend orchestration
- authentication
- business logic isolation

Sensitive operations remain outside the browser.

---

## Excellent Performance

Next.js includes numerous built-in optimizations such as:

- automatic code splitting
- image optimization
- font optimization
- route prefetching
- efficient bundling

These capabilities support the visual and interactive requirements of Aetheris.

---

# Alternatives Considered

## Option A — Vite + React

Advantages

- lightweight
- fast development
- flexible

Reasons Rejected

- requires additional architectural decisions
- fewer integrated production capabilities
- increased configuration burden
- weaker server integration

---

## Option B — Astro

Advantages

- excellent content performance
- partial hydration

Reasons Rejected

- optimized primarily for content-focused websites
- not ideal for highly interactive applications
- less suitable for complex client-side state

---

## Option C — Remix

Advantages

- modern routing
- strong server model

Reasons Rejected

- smaller ecosystem
- less familiarity within the team
- fewer resources for React Three Fiber integration

---

## Option D — Plain React SPA

Advantages

- simplicity
- flexibility

Reasons Rejected

- requires additional infrastructure
- weaker production architecture
- less integrated server capabilities
- additional deployment complexity

---

## Selected Option

Next.js (App Router)

---

# Consequences

Positive

- scalable architecture
- excellent React ecosystem
- production-grade routing
- integrated server capabilities
- strong TypeScript support
- future-ready architecture
- simplified deployment

Negative

- additional framework complexity
- Server Components introduce a learning curve
- careful separation of client/server boundaries is required

These trade-offs are acceptable considering the long-term goals of the project.

---

# Architectural Rules

This decision establishes the following implementation rules.

## Rule 1

App Router is mandatory.

Legacy Pages Router will not be used.

---

## Rule 2

Server Components should be preferred by default.

Client Components should be introduced only when interactivity requires them.

---

## Rule 3

Sensitive logic belongs on the server.

Client components should never expose secrets or business logic.

---

## Rule 4

Route organization should reflect product architecture rather than implementation details.

---

## Rule 5

Feature modules remain independent of routing wherever practical.

---

# Impact

This ADR directly affects:

- frontend architecture
- routing
- rendering strategy
- deployment
- authentication
- API implementation
- AI integration
- component organization
- repository structure

Subsequent frontend decisions should remain consistent with this framework selection.

---

# Related ADRs

- ADR-001 — Project Direction
- ADR-003 — React Three Fiber
- ADR-004 — Supabase Platform
- ADR-005 — Gemini AI Architecture

---

# Notes

Next.js provides the architectural foundation upon which every major subsystem of Aetheris will be implemented.

Changing this decision in the future would require significant architectural restructuring.

Accordingly, this decision is considered foundational and should only be superseded with compelling technical justification.

---

**End of ADR-002**