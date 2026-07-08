# Aetheris Design Tokens

> **Version:** 1.0
>
> **Project:** Aetheris
>
> **Status:** Living Document
>
> **Purpose:** Define the design token system that serves as the single source of truth for all visual properties within Aetheris.

---

# Introduction

Design Tokens are the implementation layer of the Aetheris Design Language.

They represent immutable design decisions that remain consistent across:

- Design
- Frontend
- Documentation
- Prototypes
- Future mobile applications

No UI element should introduce visual values outside this document unless a new token is formally added.

---

# Design Token Philosophy

Tokens exist to ensure:

- Consistency
- Scalability
- Maintainability
- Accessibility
- Predictability

Components never own visual values.

Components consume tokens.

---

# Token Architecture

The token system consists of three layers.

```text
Primitive Tokens
        │
        ▼
Semantic Tokens
        │
        ▼
Component Tokens
```

Primitive tokens define raw values.

Semantic tokens define meaning.

Component tokens define implementation.

---

# Primitive Tokens

Primitive tokens never reference UI components.

They define only absolute design values.

---

# Color Tokens

## Neutral

```text
Neutral-0
Neutral-50
Neutral-100
Neutral-200
Neutral-300
Neutral-400
Neutral-500
Neutral-600
Neutral-700
Neutral-800
Neutral-900
Neutral-950
```

---

## Blue

```text
Blue-50
Blue-100
...
Blue-900
```

---

## Green

```text
Green-50
...
Green-900
```

---

## Amber

```text
Amber-50
...
Amber-900
```

---

## Red

```text
Red-50
...
Red-900
```

Primitive colors should never be referenced directly by components.

---

# Typography Tokens

Font Family

```text
Inter
```

Fallback

```text
system-ui
```

Monospace

```text
JetBrains Mono
```

---

# Font Scale

```text
12

14

16

18

20

24

30

36

48

60
```

Values represent pixel equivalents.

---

# Font Weights

```text
400

500

600

700
```

Avoid unnecessary weight variations.

---

# Line Heights

```text
Tight

Normal

Relaxed
```

Actual implementation values should remain centralized.

---

# Letter Spacing

```text
Tighter

Normal

Wide
```

---

# Spacing Scale

The entire interface follows an 8-point spacing system.

```text
0

4

8

12

16

24

32

40

48

64

80

96
```

No arbitrary spacing values should be introduced.

---

# Border Radius

```text
0

4

8

12

16

24

32

9999
```

---

# Elevation Tokens

```text
Level-0

Level-1

Level-2

Level-3

Level-4

Level-5
```

Elevation should communicate hierarchy rather than decoration.

---

# Blur Tokens

```text
0

4

8

12

16

24

32
```

Blur should be used sparingly.

---

# Opacity Tokens

```text
0%

5%

10%

20%

30%

40%

50%

60%

70%

80%

90%

100%
```

---

# Motion Tokens

Animation durations.

```text
100ms

150ms

200ms

250ms

300ms

400ms

600ms

800ms
```

---

# Easing Tokens

Use a limited motion vocabulary.

```text
Standard

Accelerate

Decelerate

Emphasized
```

---

# Z-Index Layers

```text
Background

Surface

Content

Navigation

Overlay

Modal

Tooltip

Notification
```

Avoid hardcoded z-index values.

---

# Semantic Tokens

Semantic tokens define meaning.

These tokens are consumed by components.

---

# Surface

```text
Surface

Surface Elevated

Surface Glass

Surface Inverse
```

---

# Text

```text
Text Primary

Text Secondary

Text Tertiary

Text Disabled

Text Inverse
```

---

# Borders

```text
Border Default

Border Strong

Border Subtle
```

---

# States

```text
Success

Warning

Danger

Information

Neutral
```

---

# Navigation

```text
Navigation Active

Navigation Hover

Navigation Selected
```

---

# AI

```text
AI Recommendation

AI Prediction

AI Insight
```

AI-specific colors should remain subtle.

The system should never resemble a chatbot.

---

# Crowd Intelligence

```text
Crowd Low

Crowd Medium

Crowd High

Crowd Critical
```

These tokens support density visualization.

---

# Accessibility

```text
Accessible Route

Wheelchair Route

Elevator

Assistance
```

---

# Transportation

```text
Parking

Metro

Bus

Walking
```

---

# Component Tokens

Components consume semantic tokens rather than primitive values.

Example:

Button

```text
Background → Surface

Text → Text Primary

Radius → Radius 12

Elevation → Level 1

Motion → 200ms Standard
```

Cards

```text
Background → Surface Elevated

Border → Border Subtle

Radius → Radius 16

Elevation → Level 2
```

Navigation

```text
Background → Surface

Indicator → Navigation Active

Hover → Navigation Hover
```

---

# Responsive Tokens

Breakpoints

```text
XS

SM

MD

LG

XL

2XL
```

Components should adapt using tokens rather than custom values.

---

# 3D Tokens

Lighting

```text
Ambient

Key

Fill

Rim
```

Material

```text
Matte

Glass

Metal

Transparent
```

Camera

```text
Default

Focus

Overview

Navigation

Emergency
```

Environment

```text
Day

Night

Event

Emergency
```

---

# Accessibility Tokens

Reduced Motion

```text
Enabled

Disabled
```

Contrast

```text
Default

High Contrast
```

Typography

```text
Standard

Accessible
```

---

# Naming Convention

Tokens should follow this structure.

```text
Category.Role.State
```

Examples:

```text
Color.Text.Primary

Color.Surface.Glass

Space.16

Radius.12

Motion.Duration.Fast

Motion.Easing.Standard
```

Consistency is mandatory.

---

# Rules

## Rule 1

Components never reference raw values.

---

## Rule 2

Components consume semantic tokens.

---

## Rule 3

Primitive tokens remain implementation details.

---

## Rule 4

New tokens require documentation.

---

## Rule 5

Hardcoded visual values are prohibited unless explicitly justified.

---

# Future Compatibility

The token architecture should support:

- Dark mode
- Additional themes
- Brand variations
- Mobile platforms
- Desktop platforms
- Design tool synchronization

without changing component implementations.

---

# Final Principle

Design tokens are the single source of truth for every visual decision within Aetheris.

Changing a token should update the entire product consistently.

The system should scale without visual drift.

---

**End of Design Tokens**