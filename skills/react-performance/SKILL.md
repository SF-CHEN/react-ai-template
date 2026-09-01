---
name: react-vite-performance
description: Performance guidelines adapted for this React + Vite template. Use when writing, reviewing, or optimizing React code, data fetching, rendering, or bundles. TanStack Query replaces SWR and Next.js-only server rules are intentionally excluded.
license: MIT
metadata:
  upstream: vercel-react-best-practices
  adaptation: React + Vite + TanStack Query
---

# React + Vite Performance Guidelines

This skill is adapted from the uploaded Vercel React Best Practices skill for this repository's stack.

## Optimization Principle

Do not apply optimizations mechanically. Prefer clear and maintainable code by default.

Apply performance patterns when there is a concrete reason:

- network waterfalls,
- duplicate server requests,
- expensive computations,
- large lists,
- heavy route/feature bundles,
- measurable rerender cost,
- interaction responsiveness issues.

Do not add `memo`, `useMemo`, `useCallback`, refs, caching, transitions, or code splitting merely because they exist.

## Priority

### Critical

- Start independent async work together and use `Promise.all`.
- Avoid awaiting work that a branch may not need.
- Lazy-load genuinely heavy route/feature boundaries.
- Avoid broad barrel imports from large libraries when direct imports materially reduce bundles.

### High

- Use TanStack Query for server-state caching and request deduplication.
- Use stable, structured query keys.
- Do not implement duplicate fetch state manually with `useEffect + useState`.

### Medium

- Derive values during render instead of synchronizing derived state with effects.
- Move interaction-specific work into event handlers.
- Use lazy state initialization for expensive initial values.
- Use functional state updates when based on previous state.
- Do not define child components inside parent components.
- Use refs for transient values that should not trigger rendering.
- Use `startTransition`/`useDeferredValue` only for demonstrably expensive non-urgent UI.

### Low-Medium

- Prefer `Set`/`Map` for repeated large lookups.
- Return early before expensive work.
- Avoid repeated storage reads in hot paths.
- Use `content-visibility` for very long offscreen-rendered sections when appropriate.

## Stack Adaptations

The upstream skill mentions SWR and Next.js APIs. In this template:

- SWR guidance becomes TanStack Query guidance.
- `next/dynamic` becomes `React.lazy` + `Suspense` or Vite dynamic `import()`.
- Next.js Server Actions, RSC serialization, `after()`, server caches, and API-route rules do not apply to this Vite SPA template.

See individual rules in `rules/` for examples.
