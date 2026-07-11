# 05 AI Toolchain

> **Purpose**: Documents the models, tools (MCPs), and skills used by the AI Orchestration layer and the development team.
> **Audience**: Engineering and AI Orchestration Teams
> **Owner**: AI Team
> **Status**: Active
> **Version**: 3.0
> **Last Updated**: July 2026
> **Related Documents**: `03_SYSTEM_ARCHITECTURE.md`

## Overview
Aetheris relies on a sophisticated AI toolchain. This document defines the foundation models, Model Context Protocol (MCP) servers, and specialized Skills that power both the live platform intelligence and the development lifecycle.

---

## Foundation Models

### Claude 3 Opus
- **Strengths**: Highest reasoning capability, excellent at complex orchestration, deep context understanding, and complex architectural decision-making.
- **Weaknesses**: Slower latency, higher cost.
- **When to Use**: Complex incident resolution, architectural planning, code review, and generating high-level operational strategies.

### Claude 3.5 Sonnet
- **Strengths**: Exceptional speed-to-intelligence ratio, highly capable in coding and fast analysis.
- **Weaknesses**: Slightly less capable than Opus on extremely long-horizon abstract reasoning.
- **When to Use**: Real-time routing, rapid translation, standard operational coordination, and primary development tasks.

### Gemini 3.1 Pro
- **Strengths**: Massive context window, excellent native integration with Google Cloud ecosystems, strong multimodal capabilities.
- **Weaknesses**: Can be overly verbose in structured data generation if not strictly prompted.
- **When to Use**: Analyzing large operational logs, analyzing historical crowd data, and processing multimodal venue feeds.

### Gemini 3.5 Flash
- **Strengths**: Extremely low latency, highly cost-effective, high throughput.
- **Weaknesses**: Lower reasoning ceiling for complex, multi-step logic.
- **When to Use**: High-frequency notification dispatch, basic translation, simple telemetry evaluation, and live crowd density estimations.

---

## Available MCPs (Model Context Protocols)
MCPs extend the capabilities of the models with specialized tools.

- **Google Antigravity**: Core agentic framework for file manipulation, subagent orchestration, and system integration.
- **21st**: Design and component generation integration.
- **Stitch**: Project scaffolding, screen generation, and design system application.
- **Chrome DevTools**: Browser inspection, network auditing, and performance profiling.
- **Playwright**: End-to-end browser automation and visual testing.
- **Context7**: Advanced documentation querying and library resolution.
- **Firebase**: Integration with Firebase services.
- **Supabase**: Direct interaction with Supabase databases, edge functions, and authentication.
- **Prisma**: Database schema and migration management.
- **Google Code Assist**: Intelligent code completions and standard adherence.
- **Dart**: Dart specific tooling.
- **MUI**: Material-UI component integration and styling utilities.

---

## Specialized Skills
Skills are focused, reusable sets of instructions and workflows that guide the AI in performing specific, highly complex tasks.

### UI UX Pro Max
- **Purpose**: Generates and refines premium, human-centered user interfaces.
- **When to invoke**: Designing new persona screens or applying the Design System to raw components.
- **Expected outputs**: Accessible, aesthetically premium React components adhering strictly to `04_DESIGN_SYSTEM.md`.

### Framer Motion
- **Purpose**: Implements sophisticated, purpose-driven animations.
- **When to invoke**: Adding interaction feedback, state transitions, or micro-animations.
- **Expected outputs**: Framer motion components using standard easing and duration tokens without performance degradation.

### Frontend
- **Purpose**: Implements core frontend logic, state management, and API integrations.
- **When to invoke**: Building out the Experience Layer architecture.
- **Expected outputs**: Clean, modular, type-safe React/TypeScript code.

### Architecture
- **Purpose**: Defines system boundaries, data flow, and component relationships.
- **When to invoke**: Planning new intelligence engines or scaling infrastructure.
- **Expected outputs**: System design documents, interface definitions, and architectural diagrams.

### Accessibility
- **Purpose**: Audits and implements WCAG compliance.
- **When to invoke**: After initial UI implementation or during QA.
- **Expected outputs**: ARIA attributes, keyboard navigation support, and contrast ratio validation.

### Browser QA
- **Purpose**: Validates the application in a live browser context.
- **When to invoke**: Verifying routing, state changes, or UI layout integrity.
- **Expected outputs**: Bug reports, visual regression flags, and verified user flows.

### Code Review
- **Purpose**: Enforces engineering standards and architectural principles.
- **When to invoke**: Prior to merging any significant PR.
- **Expected outputs**: Inline comments, structural feedback, and security/performance warnings.

### Performance
- **Purpose**: Audits and optimizes application latency and rendering speed.
- **When to invoke**: Resolving bottlenecks or meeting performance budgets.
- **Expected outputs**: Optimization recommendations, memoization strategies, and bundle size reductions.
