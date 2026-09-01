---
name: react-project-conventions
description: Project architecture and implementation conventions for this React + TypeScript + Vite template. Use when adding modules, pages, APIs, forms, tables, routes, or shared components.
---

# React Project Conventions

## Decision Map

| Need | Use |
|---|---|
| Business feature | `src/modules/<feature>` |
| Server data | TanStack Query |
| Client global state | Zustand |
| Form state | React Hook Form |
| Validation | Zod |
| Table behavior | TanStack Table |
| HTTP | Axios wrapper in `src/services` |
| UI primitive | `src/components/ui` |
| Cross-feature component | `src/components/common` |

## Module Template

```text
modules/example/
├── pages/
├── components/
├── api/
├── hooks/
├── query/
├── schemas/
└── types/
```

Only create folders the module actually needs.

## Generation Principles

1. Read existing module patterns before adding new structures.
2. Keep one source of truth for each state value.
3. Prefer direct, boring code over unnecessary generic abstractions.
4. Preserve existing naming and import aliases.
5. Explain non-obvious decisions with Why comments.
6. Do not introduce new dependencies when existing stack already solves the problem.
