<div align="center">
	<h1>dhr-social</h1>
	<p><strong>A modern, performant, open-source social platform (Frontend)</strong></p>
	<p>
		<a href="https://dhr-social.vercel.app" target="_blank"><b>Live Demo</b></a>
		·
		<a href="https://github.com/dhruv-15-03/social/issues">Report Bug</a>
		·
		<a href="https://github.com/dhruv-15-03/social/issues">Request Feature</a>
	</p>
</div>

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Performance Optimizations](#performance-optimizations)
- [Accessibility & UX](#accessibility--ux)
- [Security Considerations](#security-considerations)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Scripts](#scripts)
- [Backend Service](#backend-service)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Commit Convention](#commit-convention)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [License](#license)

---

## Overview

dhr-social is a modern, scalable social networking frontend built with React and a hybrid state strategy (Redux + React Query) to balance real-time interactivity and cache efficiency. It delivers a polished user experience with production-grade patterns: error boundaries, performance instrumentation, lazy loading, code splitting, secure API access, and resilience patterns (queueing, circuit breaking, and retry logic where applicable). Contributions are welcome across UI, performance, accessibility, and developer experience.

> Backend implementation lives in a separate repository: **[Social.backend (Java/Spring Boot)](https://github.com/dhruv-15-03/Social.backend)**

Screenshots:
| Home | Profile |
|------|---------|
| ![Home](image/Screenshot%202025-08-02%20124835.png) | ![Profile](image/Screenshot%202025-08-02%20125242.png) |

---

## Key Features

- Responsive, theme-aware UI (mobile-first, supports dark mode)
- Authentication & session persistence with secure token handling
- Create / like / comment / save / view posts & reels
- Story system with bulk optimized loading
- Chat & messaging (real-time ready architecture)
- Optimized API orchestration (deduplication, caching, optimistic updates)
- Error boundaries (dev vs production variants)
- Performance monitoring & lazy component strategy
- Accessibility-aware components (ARIA, focus management, keyboard flows)
- Search & follow system with optimized fetches
- Modular theming (base + optimized theme profiles)
- Pluggable logging system (development vs production loggers)
- Circuit breaker + request queue primitives (for resilience)
- PWA-friendly structure

---

## Architecture

Layered modular structure:

| Layer | Purpose | Key Elements |
|-------|---------|--------------|
| UI Components | Presentational & interactive UI | MUI, Tailwind, motion variants |
| Feature Modules | Domain-specific logic | Posts, Auth, Messages, Profile |
| State Layer | Global state & caching | Redux + React Query hybrid |
| Data Access | API calls & resilience | `api.js`, queue, circuit breaker |
| Utilities | Cross-cutting concerns | logging, security, lazy loading |
| Theming | Design token management | `theme/` (base, optimized) |

Principles:
- Minimize over-fetching (conditional & cached fetches)
- Isolate side-effects (thunks & hooks)
- Prefer composition over inheritance
- Guard production paths (error boundaries & fallbacks)

---

## Tech Stack

**UI + Core**
- React 18, React Router 6
- Material UI (design system) + Tailwind CSS utilities
- Framer Motion (micro-interactions)
- Formik + Yup (forms & validation)

**State & Data Layer**
- Redux (session, messaging, profile, posts)
- React Query (normalized caching for feed/search)
- Thunks + custom async pipelines

**Networking & Resilience**
- Axios instance (`api`) with interceptors
- Request queue / circuit breaker utilities
- Deduplication & cache layer (`ApiDeduplicator`)

**Quality & DX**
- Error boundaries (development + production versions)
- Session persistence provider
- Accessibility + responsive hooks

**Backend**
- Java / Spring Boot (separate: [Social.backend](https://github.com/dhruv-15-03/Social.backend))

---

## Performance Optimizations
- Request deduplication (`ApiDeduplicator`) prevents duplicate concurrent calls
- Conditional fetching (only fetch if cache empty/stale)
- Optimistic UI for like/save actions
- React.memo + useMemo + useCallback across hot paths
- Code splitting & lazy loading of non-critical routes
- Virtual scroll & lazy media loading utilities
- Minimal rerender selectors (`useOptimizedSelector`)
- Gradient + GPU-friendly animations (no layout thrash)

---

## Accessibility & UX
- Semantic roles on interactive containers
- High-contrast gradients & theme-aware colors
- Focus ring preservation & keyboard activation patterns
- Motion reduced gracefully (future: prefers-reduced-motion hook)

---

## Security Considerations
- JWT stored under controlled key (revocation on auth failure)
- API abstraction centralizes header & auth injection
- Circuit breaker to avoid cascading failures
- Pending: CSP, SRI hashing, audit bundle (see Roadmap)

---

## Getting Started

### Prerequisites
- Node.js >= 18 (LTS recommended)
- npm >= 9 (or pnpm / yarn if adapted)
- Backend service running (see [Backend Service](#backend-service))

### Installation

```bash
git clone https://github.com/dhruv-15-03/social.git
cd social/app/app
npm install
```

### Running Locally

```bash
npm start
```
Then visit: http://localhost:3000

### Build for Production

```bash
npm run build
```

---

## Environment Configuration

Create `.env` (or `.env.local`) as needed:
```
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_ENABLE_LOGGING=true
REACT_APP_BUILD_ENV=production
```

Environment-driven toggles allow safe experimentation with logging, performance profiling, and feature gates.

---

## Scripts
| Script | Purpose |
|--------|---------|
| `npm start` | Run development server |
| `npm run build` | Production build |
| `npm run test` | Run tests (extend as coverage grows) |
| `npm run lint` | (If configured) Lint codebase |
| `npm run analyze` | (Optional future) Bundle analysis |

---

## Backend Service

Backend repository (Java Spring Boot): **[Social.backend](https://github.com/dhruv-15-03/Social.backend)**

Integration Highlights:
- RESTful endpoints consumed via centralized `api` client
- Like/comment/follow/chat endpoints expected to return updated domain objects
- Message like flow: `POST /api/message/like/{chatId},{messageId}` (returns updated message)
- Circuit breaking planned for high-latency chains

---

## Testing
Basic test scaffolding exists (`setupTests.js`). Future expansion areas:
- Component interaction tests (React Testing Library)
- Store logic reducers (edge-case immutability)
- Performance budget assertions
- Accessibility snapshots (axe-core)

---

## Project Structure
```
src/
	Components/        Reusable & feature UI units
	Pages/             Route-level components
	Redux/             State slices & async actions
	hooks/             Reusable logic (data, a11y, performance)
	utils/             Cross-cutting helpers
	config/            API + environment config
	theme/             Theming & design tokens
	styles/            Global / responsive CSS
```

---

## Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/short-description`
3. Make changes (add tests if behavior changes)
4. Run build & tests locally
5. Commit using conventional commits (see below)
6. Open a Pull Request describing motivation & trade-offs

### Contribution Guidelines
- Keep PRs focused (single responsibility)
- Include screenshots / GIFs for UI changes
- Note performance implications for data-layer edits
- Document new environment variables in this README

### Code Quality
- Prefer pure functions & immutability in reducers
- Memoize expensive calculations
- Guard against nullish values at module boundaries
- Avoid introducing global side-effects

---

## Commit Convention
Use **Conventional Commits**:
```
feat: add optimistic like handling for posts
fix: prevent duplicate chat fetch on mount
perf: memoize user list rendering
refactor: consolidate profile tab switch logic
docs: update contribution section
chore: bump dependency versions
```

---

## Roadmap
- [ ] WebSocket real-time layer (messages, notifications)
- [ ] Advanced image optimization pipeline
- [ ] Service Worker offline & cache strategies
- [ ] Bundle size budget & analyzer
- [ ] Theming editor & user preferences persistence
- [ ] Role-based access control refinement
- [ ] GraphQL gateway experiment
- [ ] Performance budget CI checks

---

## FAQ
**Why Redux + React Query?**
Separation of concerns: Redux for session & synchronous domain snapshots; React Query for server cache + background refetch.

**Can I swap styling systems?**
Yes. The component layer is gradually isolating design tokens—open an RFC first.

**How do I report security issues?**
Do not open a public issue. Email the maintainer or use private disclosure (add SECURITY.md in future).

---

## License

Licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

<div align="center">
	<sub>Crafted with care. Contributions welcome.</sub>
</div>
