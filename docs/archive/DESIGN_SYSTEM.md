# Aetheris Design System

> **Version:** 1.0
>
> **Project:** Aetheris
>
> **Status:** Living Document
>
> **Purpose:** Define the reusable interface patterns and component standards used throughout Aetheris.

---

# Introduction

The Aetheris Design System provides a shared set of reusable interface patterns that ensure consistency across the product.

It translates the principles established in the Design Language into practical UI building blocks that designers and developers can implement repeatedly.

The system is intended to:

- improve consistency
- reduce design decisions during implementation
- accelerate development
- improve accessibility
- simplify maintenance

---

# Scope

This document defines:

- layout patterns
- navigation patterns
- reusable UI components
- spatial interface components
- AI interface components
- interaction states
- component governance

Visual values such as colors, typography, spacing, and motion are defined separately in **DESIGN_TOKENS.md**.

---

# Design System Principles

The design system follows five principles.

## Consistency

Equivalent interactions should look and behave consistently throughout the application.

---

## Simplicity

Components should solve one problem well.

Avoid feature-heavy components that attempt to satisfy unrelated use cases.

---

## Composability

Interfaces should be assembled from small reusable components rather than large page-specific widgets.

---

## Accessibility

Every component must support keyboard navigation, focus visibility, and assistive technologies where applicable.

Accessibility is a default requirement rather than an enhancement.

---

## Spatial Awareness

Components should reinforce the Living Digital Twin as the primary interaction model.

Traditional UI supports the experience but should not compete with it.

---

---

# Layout System

The layout system establishes a consistent spatial structure across every screen in Aetheris.

Layouts should prioritize readability, predictable navigation, and the Living Digital Twin.

## Layout Principles

- One primary objective per screen.
- Clear visual hierarchy.
- Consistent spacing using Design Tokens.
- Responsive by default.
- Minimal visual clutter.

---

## Page Structure

Every page should follow this structure.

```text
Top Navigation

↓

Primary Content

↓

Contextual Side Panels (when required)

↓

Status & Feedback Layer
```

The Living Digital Twin should occupy the primary visual space whenever it is part of the experience.

---

## Content Width

Use three layout widths.

| Width | Usage |
|--------|-------|
| Narrow | Forms, settings, authentication |
| Standard | Dashboards and content pages |
| Full | Living Digital Twin and immersive experiences |

Avoid arbitrary page widths.

---

# Navigation System

Navigation should help users move confidently without overwhelming them.

The interface should reveal only the controls necessary for the current task.

---

## Primary Navigation

Primary navigation provides access to the application's core areas.

Examples:

- Home
- Live Stadium
- Navigation
- Accessibility
- Operations
- Profile

Navigation should remain consistent across the application.

---

## Contextual Navigation

Contextual navigation appears only when relevant.

Examples:

- Stadium zone controls
- Layer selection
- AI insights
- Venue information

It should never replace the primary navigation.

---

## Navigation Rules

- Keep navigation shallow.
- Avoid nested menus where possible.
- Maintain consistent placement.
- Clearly indicate the current location.
- Preserve user orientation at all times.

---

# Component Taxonomy

Components are organised by purpose rather than HTML element.

This improves discoverability and reflects the way users interact with Aetheris.

## Foundations

Reusable building blocks shared across the application.

Examples:

- Icons
- Avatars
- Dividers
- Badges
- Chips

---

## Layout Components

Responsible for page composition.

Examples:

- Page Shell
- Content Container
- Panel
- Sidebar
- Bottom Sheet

---

## Navigation Components

Support movement through the application.

Examples:

- Navigation Rail
- Top Navigation
- Breadcrumbs
- Tabs
- Step Indicator

---

## Spatial Components

Represent information within the Living Digital Twin.

Examples:

- Stadium Scene
- Route Layer
- Crowd Layer
- Zone Overlay
- Accessibility Layer

---

## Intelligence Components

Present AI-generated information.

Examples:

- Recommendation Card
- Insight Panel
- Explainability Card
- Confidence Indicator
- Context Summary

---

## Feedback Components

Communicate system state.

Examples:

- Alert
- Toast
- Progress Indicator
- Empty State
- Error State

---

---

# Core Components

Core Components are the reusable building blocks used throughout Aetheris.

Each component should:

- Have a single responsibility.
- Be composable.
- Support keyboard navigation.
- Respect Design Tokens.
- Avoid feature-specific business logic.

---

## Button

Purpose

Trigger user actions.

Variants

- Primary
- Secondary
- Ghost
- Destructive

Rules

- One Primary button per major section.
- Labels should begin with action verbs.
- Never rely on icon-only buttons for critical actions.

---

## Card

Purpose

Group related information.

Used for:

- Venue information
- AI recommendations
- Operational summaries
- Statistics

Rules

- Keep content concise.
- Avoid deeply nested cards.
- Support optional actions.

---

## Input

Purpose

Capture user input.

Supported Types

- Text
- Search
- Number
- Select
- Multiline

Rules

- Always provide labels.
- Validate as early as practical.
- Display clear error messages.

---

## Modal

Purpose

Interrupt the current workflow for important actions.

Use For

- Confirmations
- Critical information
- Multi-step workflows

Avoid

- Routine navigation
- Long-form content

---

## Drawer

Purpose

Present secondary information without leaving the current screen.

Typical Usage

- Venue details
- AI insights
- Accessibility information
- Layer controls

---

## Tooltip

Purpose

Provide short contextual explanations.

Rules

- Keep content brief.
- Do not place essential information exclusively inside tooltips.
- Support keyboard focus.

---

## Badge

Purpose

Display compact status information.

Examples

- Live
- Closed
- AI
- Accessible
- Crowded

Badges should communicate status rather than decoration.

---

# Spatial Components

Spatial Components are unique to Aetheris.

They extend the Living Digital Twin rather than traditional dashboards.

---

## Living Digital Twin

The primary interaction surface.

Responsibilities

- Stadium visualization
- Camera interaction
- Spatial awareness

---

## Route Layer

Displays navigation routes.

Should support:

- Primary route
- Alternative route
- Accessible route

---

## Crowd Layer

Visualizes crowd conditions.

Density should be understandable without requiring textual explanation.

---

## Zone Overlay

Highlights operational areas such as:

- Gates
- Seating
- Parking
- Facilities
- Restricted Zones

---

## Accessibility Layer

Displays accessibility-related information.

Examples

- Elevators
- Wheelchair routes
- Accessible entrances
- Assistance points

Accessibility information should remain easy to identify without overwhelming the interface.

---

# Intelligence Components

These components communicate AI-generated insights.

The interface should emphasize recommendations rather than the underlying AI.

---

## Recommendation Card

Displays:

- Recommendation
- Reason
- Confidence (optional)
- Suggested action

Recommendations should always be actionable.

---

## Insight Panel

Summarizes operational intelligence.

Examples

- Crowd updates
- Transport conditions
- Weather impacts

---

## Explainability Panel

Provides concise explanations for AI-generated recommendations.

Explainability should increase trust without exposing unnecessary implementation details.

---

## Context Summary

Displays the information currently influencing recommendations.

Examples

- Current location
- Crowd level
- Weather
- Accessibility preferences

This improves transparency and user confidence.

---

---

# States & Feedback

Every interactive component should communicate its current state clearly and consistently.

The following states should be supported wherever applicable.

| State | Purpose |
|--------|---------|
| Default | Normal interaction state |
| Hover | Indicates pointer interaction |
| Focus | Supports keyboard navigation |
| Active | Indicates ongoing interaction |
| Disabled | Indicates unavailable actions |
| Loading | Indicates work in progress |
| Success | Confirms successful completion |
| Warning | Draws attention to non-critical issues |
| Error | Indicates failed operations |

---

## Feedback Principles

Feedback should be:

- Immediate
- Clear
- Actionable
- Non-disruptive

The interface should never leave users wondering whether an action succeeded.

---

## Loading

Loading states should:

- preserve layout stability
- communicate progress
- avoid unnecessary spinners when skeleton loading is appropriate

For AI-powered features, progressive streaming should be preferred whenever possible.

---

## Empty States

Empty states should always answer three questions:

- Why is nothing displayed?
- What can the user do next?
- Is this expected?

Avoid presenting completely blank screens.

---

## Error States

Error messages should:

- describe the problem clearly
- avoid technical jargon
- suggest a recovery action
- never blame the user

When possible, users should be able to retry without leaving the current workflow.

---

# Governance

The Design System is the canonical reference for all user interface development within Aetheris.

It should evolve alongside the product while remaining consistent with the Design Language and Design Tokens.

---

## Source of Truth

The following hierarchy applies.

```text
Brand Guidelines
        │
        ▼
Design Language
        │
        ▼
Design Tokens
        │
        ▼
Design System
        │
        ▼
Application UI
```

Lower levels must never contradict higher levels.

---

## Contribution Rules

When introducing a new component:

1. Check whether an existing component already solves the problem.
2. Extend an existing component before creating a new one.
3. Create a new component only when reuse is not appropriate.
4. Document the component before adoption.

---

## Change Management

Design system updates should remain incremental.

Breaking visual changes should be avoided unless they provide a clear usability or accessibility improvement.

All changes should maintain compatibility with the established design language.

---

## Success Criteria

The Design System is successful when:

- interfaces remain visually consistent
- components are reused rather than duplicated
- accessibility requirements are maintained
- developers can implement features without inventing new UI patterns
- users experience a predictable interface throughout the product

---

# Refinement Updates: Phase 6 Experience Design Polish

In the continuation of Phase 6 Experience Design, the design system has been refined to move away from a dense "operating system / cyberpunk terminal" visual simulator to a clean, calm, modern enterprise layout.

## 1. Visual Language Redesign Guidelines
* **Restraint Over Clutter**: Eliminate raw monospace text wrappers, technical GPS indicators, and latency counters from standard user interfaces.
* **Breathing Room & Rhythm**: Increase padding and card margins. Use a grid layout with a single dominant workspace (the Digital Twin) and contextual panels that adapt.
* **Typography Policy**: Inter is the primary typeface for all text block paragraphs, buttons, labels, and headers. Monospace (JetBrains Mono) is strictly reserved for spatial coordinates, numeric metrics, timestamps, percentages, and telemetry logs.

## 2. Experience Role-Based Architecture
The Aetheris platform separates the presentation experience layer from the core shared engines:
* **Fan Experience Console**: Tailored for stadium spectators. Focuses on access routes, concessions lookup, seat block guides, elevator status, and fan-facing AI insights.
* **Organizer Command Console**: Advanced administrative view containing tactical incident dispatches, security alert rosters, and deep path planning configurations.
* Both experiences share the same 3D Digital Twin, spatial routing, and prediction libraries.

---

# Digital Twin 3D Layer

> Added in Phase 6 Priority 1.1

The Digital Twin's 3D layer uses a production GLB model as its visual and spatial foundation. Rather than treating the stadium as a decoration, the GLB geometry acts as the authoritative coordinate system for entity anchoring and path routing.

## Stadium Asset

The production stadium is the **KOREA Jeju World Cup Stadium 4K** (500K triangles, 27 PBR materials, 6 textures). It is loaded as a static GLB asset via `useGLTF()` with eager preloading.

## Three-Layer Architecture

| Layer | Component | Responsibility |
|---|---|---|
| Visual | `StadiumGLB` | Pure GLB rendering. No logic. |
| Transform | `StadiumSpatialAdapter` | Maps GLB to routing coordinate space |
| Interaction | `StadiumInteractionLayer` | Invisible colliders matching the geometry |

## Entity & Route Anchoring

- **Anchor Points**: All operational POIs are anchored to verified positions on the GLB geometry (gates at outer perimeter, concessions/services along the concourse ring).
- **Walkable Paths**: Pedestrian routing waypoints form an elliptical ring following the inner concourse structure, connecting gates and stands along natural walkable corridors.

## Camera Profiles

Camera positions are defined as reusable profiles in `stadium-config.ts` to frame the GLB cinematically:

| Profile | Purpose |
|---|---|
| Hero | Sweep establishing shot for cinematic fly-in |
| Landing | Slow orbit for landing page |
| Overview | Default aerial view |
| Navigation | Closer view of pathways |
| Operations | Operational dashboard angle |
| Accessibility | Focus on accessible entrances |
| Journey | Driven by route animation |
| Emergency | Top-down emergency view |

## Lighting Presets

The stadium never owns lighting. Lighting is configured through presets:

| Preset | Description |
|---|---|
| Match Day | Bright, vivid daylight |
| Golden Hour | Warm sunset lighting |
| Morning | Cool, soft morning light |
| Night | Dark with minimal illumination |

## Configuration

All values are centralized in `stadium-config.ts`. No magic numbers exist in rendering code.

See [STADIUM_ASSET.md](./STADIUM_ASSET.md) for detailed asset analysis.

---

# Conclusion

The Aetheris Design System transforms the project's visual philosophy into reusable implementation patterns.

Together with the Design Language and Design Tokens, this document forms the complete foundation for all user interface development within Aetheris.

---

**End of Design System**