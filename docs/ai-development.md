# AI Development Guide

## Before Generating Code

1. Read `AGENTS.md`.
2. Inspect the nearest existing module before creating a new pattern.
3. Reuse existing UI primitives and utilities.
4. Decide where state belongs before writing components.

## Prompt Template

```text
Implement <feature> in this repository.
Follow AGENTS.md and the existing modules architecture.
Reuse existing UI components and dependencies.
Add Why comments only for non-obvious decisions.
Do not add a new dependency unless the existing stack cannot solve the requirement.
Run typecheck/lint/tests/build if dependencies are available.
```

## Good AI Output

- adds `modules/evaluation` for an evaluation feature,
- keeps API, query keys, forms, types, and components close together,
- uses TanStack Query rather than storing fetched lists in Zustand,
- uses Zod + React Hook Form for complex forms,
- reuses `components/ui`,
- avoids unnecessary abstractions and unnecessary memoization.
