# ADR-006 — Adopt the Living Digital Twin as the Primary Interaction Model

> **Status:** Accepted
>
> **Date:** July 2026
>
> **Decision Makers:** Team Aetheris
>
> **Category:** Product Architecture
>
> **Supersedes:** None
>
> **Superseded By:** None

---

# Context

Aetheris is designed to improve operational awareness during large-scale live sporting events.

Traditional stadium software generally presents information through:

- dashboards
- maps
- chat interfaces
- notifications
- tables
- operational panels

While these approaches successfully display information, they often separate information from its physical context.

Users must mentally translate operational data into an understanding of the venue.

This creates unnecessary cognitive effort.

---

# Problem

Every major problem addressed by Aetheris is fundamentally spatial.

Examples include:

- navigation
- congestion
- crowd movement
- emergency response
- accessibility
- transportation
- resource allocation

Each problem depends upon relationships between physical locations.

Presenting these relationships through conventional interfaces reduces situational awareness.

The application requires a primary interaction model capable of communicating both physical space and operational state simultaneously.

---

# Decision

Aetheris will adopt a **Living Digital Twin** as the primary interaction model for the platform.

The Living Digital Twin is not a visual enhancement.

It is the operational representation of the venue.

Every recommendation, prediction, alert, navigation instruction, and operational insight originates from this spatial representation.

The digital twin becomes the primary interface through which users understand the current state of the venue.

---

# Definition

Within Aetheris, the Living Digital Twin is defined as:

> A continuously updated spatial representation of the venue that combines physical structure, operational context, stakeholder interactions, and AI-generated intelligence into a unified interface.

Unlike static 3D models, the Living Digital Twin continuously reflects operational changes occurring throughout the event.

---

# Rationale

The Living Digital Twin supports the product vision established in ADR-001.

Rather than asking users to interpret disconnected data sources, Aetheris presents operational intelligence within the physical environment where it occurs.

Examples include:

- congestion appears where congestion exists
- alerts appear where incidents occur
- routes appear where people walk
- accessibility information appears where accessibility decisions are required

This significantly reduces the cognitive effort required to understand operational conditions.

---

# Operational Representation

The Living Digital Twin represents both physical and operational information.

Examples include:

Physical

- stadium geometry
- gates
- seating
- walkways
- parking
- transportation hubs

Operational

- crowd density
- AI recommendations
- navigation paths
- accessibility layers
- operational alerts
- weather impacts
- transportation status

The model continuously combines these perspectives into one coherent experience.

---

# User Experience Principles

The Living Digital Twin should satisfy the following principles.

## Principle 1

Every interaction begins with spatial context.

---

## Principle 2

Users should immediately understand:

- where they are
- what is happening
- what matters
- what action is recommended

---

## Principle 3

Operational intelligence should appear naturally within the environment rather than inside isolated interface panels.

---

## Principle 4

Spatial understanding should reduce the need for textual explanation.

---

## Principle 5

Three-dimensional visualization should communicate meaning rather than demonstrate technical capability.

---

# Alternatives Considered

## Option A — Dashboard-Centered Interface

Advantages

- familiar interaction model
- lower implementation complexity
- easier data presentation

Reasons Rejected

- fragmented information
- weaker spatial awareness
- reduced differentiation
- higher cognitive effort

---

## Option B — Traditional Interactive Map

Advantages

- lightweight
- familiar navigation paradigm
- broad device compatibility

Reasons Rejected

- limited operational representation
- weaker immersion
- constrained visualization possibilities
- reduced product identity

---

## Option C — Chatbot-Centered Experience

Advantages

- simple interaction
- low learning curve

Reasons Rejected

- reactive by nature
- limited situational awareness
- poor spatial communication
- information hidden inside conversations

---

## Option D — Living Digital Twin

Advantages

- unified operational understanding
- strong spatial awareness
- memorable user experience
- natural AI integration
- supports every stakeholder

Selected.

---

# Architectural Rules

## Rule 1

The Living Digital Twin is the primary interface.

Traditional dashboards support the experience but do not replace it.

---

## Rule 2

Every major feature should connect to the Living Digital Twin.

If a feature cannot meaningfully integrate with the digital twin, its necessity should be questioned.

---

## Rule 3

Spatial context should remain visible throughout user workflows whenever practical.

---

## Rule 4

The digital twin should prioritize clarity over visual complexity.

Operational understanding always takes precedence over graphical realism.

---

## Rule 5

Every visual layer should communicate information.

Decorative three-dimensional elements without operational value should be avoided.

---

## Rule 6

The digital twin should evolve continuously as operational conditions change.

It should never behave like a static model.

---

# Consequences

Positive

- distinctive product identity
- improved situational awareness
- reduced cognitive load
- stronger AI integration
- memorable demonstrations
- unified interaction model
- scalable architecture

Negative

- increased implementation complexity
- higher rendering requirements
- additional optimization effort
- greater design investment

These trade-offs are acceptable because they directly support the long-term vision of Aetheris.

---

# Impact

This decision directly affects:

- User Experience
- Frontend Architecture
- AI Architecture
- Navigation
- Accessibility
- Crowd Intelligence
- Transportation
- Operations Dashboard
- Rendering Pipeline

Nearly every major feature depends upon this architectural decision.

---

# Related ADRs

- ADR-001 — Project Direction
- ADR-002 — Next.js (App Router)
- ADR-003 — React Three Fiber
- ADR-005 — AI Provider Abstraction

---

# Notes

The Living Digital Twin is the defining architectural characteristic of Aetheris.

It transforms the application from a collection of disconnected features into a unified spatial intelligence platform.

Every future product decision should strengthen this interaction model rather than bypass it.

If a future design reduces the Living Digital Twin to a decorative visualization, this ADR should be reconsidered.

---

**End of ADR-006**