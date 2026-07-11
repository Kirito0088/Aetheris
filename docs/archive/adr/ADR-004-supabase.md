# ADR-004 — Adopt Supabase as the Backend Platform

> **Status:** Accepted
>
> **Date:** July 2026
>
> **Decision Makers:** Team Aetheris
>
> **Category:** Backend Architecture
>
> **Supersedes:** None
>
> **Superseded By:** None

---

# Context

Aetheris requires a backend capable of supporting a production-quality web application while remaining lightweight enough for rapid iteration during PromptWars.

The backend must provide:

- secure authentication
- relational database
- row-level authorization
- file storage
- realtime capabilities
- server integration
- scalability
- excellent developer experience

The platform should minimize operational overhead while allowing future expansion beyond the competition.

---

# Problem

Selecting the backend platform determines:

- data architecture
- authentication model
- authorization strategy
- deployment complexity
- scalability
- operational maintenance
- developer productivity

An unsuitable backend would increase implementation effort and reduce long-term maintainability.

---

# Decision

Aetheris will adopt **Supabase** as its primary backend platform.

Supabase will provide:

- PostgreSQL database
- Authentication
- Storage
- Realtime services (where appropriate)
- Row Level Security (RLS)

Business logic and AI orchestration will remain within the Next.js application rather than being tightly coupled to Supabase.

---

# Rationale

Supabase aligns well with the engineering principles established by previous ADRs.

## PostgreSQL Foundation

Supabase is built on PostgreSQL.

This provides:

- relational modeling
- mature SQL capabilities
- indexing
- transactions
- extensibility
- long-term portability

The data model remains based on open database standards rather than proprietary storage engines.

---

## Built-in Authentication

Authentication is available without introducing additional identity infrastructure.

Supported capabilities include:

- secure sessions
- OAuth providers
- JWT support
- user management

Authentication integrates cleanly with Next.js.

---

## Row Level Security

Authorization should be enforced at the database layer.

RLS enables policies that restrict data access based on the authenticated user.

This provides defense in depth and reduces the likelihood of accidental data exposure when policies are correctly designed.

---

## Storage

Supabase Storage provides a managed solution for assets such as:

- venue models
- images
- icons
- uploaded files

Storage remains integrated with authentication and authorization.

---

## Developer Experience

Supabase reduces operational complexity by providing a cohesive backend platform while allowing developers to retain full control over the application architecture.

This accelerates development without sacrificing maintainability.

---

# Alternatives Considered

## Option A — Firebase

Advantages

- mature ecosystem
- excellent SDKs
- realtime capabilities

Reasons Rejected

- NoSQL-first data model
- less suitable for relational operational data
- vendor-specific querying patterns
- reduced SQL flexibility

---

## Option B — Self-Hosted PostgreSQL

Advantages

- complete infrastructure control
- maximum flexibility

Reasons Rejected

- increased operational overhead
- infrastructure management
- backups
- monitoring
- deployment complexity

This exceeds the needs of the current project.

---

## Option C — Prisma + PostgreSQL Only

Advantages

- flexible ORM
- production capable

Reasons Rejected

- authentication must be built separately
- storage requires additional services
- more infrastructure decisions
- slower implementation

---

## Option D — Appwrite

Advantages

- integrated backend platform
- authentication
- storage

Reasons Rejected

- smaller ecosystem
- fewer community resources
- weaker alignment with the preferred engineering stack

---

## Selected Option

Supabase

---

# Consequences

Positive

- relational PostgreSQL foundation
- integrated authentication
- built-in storage
- Row Level Security
- strong TypeScript support
- rapid development
- production-ready platform

Negative

- dependency on a managed backend platform
- careful RLS policy design required
- some platform-specific features

These trade-offs are acceptable given the goals of Aetheris.

---

# Architectural Rules

## Rule 1

PostgreSQL remains the single source of truth.

---

## Rule 2

Authentication must be handled through Supabase Auth.

---

## Rule 3

Authorization must be enforced using Row Level Security wherever user-owned data exists.

---

## Rule 4

Secrets must never be exposed to client-side code.

---

## Rule 5

Business logic belongs in the application layer rather than database triggers unless a database concern specifically requires it.

---

## Rule 6

Database schema changes must be version controlled through migrations.

---

# Security Considerations

The backend architecture follows these security principles.

- Least privilege
- Secure authentication
- Server-side secrets
- Input validation
- Database authorization
- Explicit access policies

Security must be considered during schema design rather than after implementation.

---

# Impact

This decision directly affects:

- Authentication
- Database Design
- Storage
- Authorization
- API Layer
- Deployment
- Security Model

Future backend decisions should remain compatible with this platform.

---

# Related ADRs

- ADR-001 — Project Direction
- ADR-002 — Next.js (App Router)
- ADR-005 — Gemini AI Architecture

---

# Notes

Supabase is selected because it provides a strong balance between developer productivity, production readiness, and architectural flexibility.

The application architecture intentionally remains modular so that future backend services can evolve independently without requiring a complete redesign.

---

**End of ADR-004**