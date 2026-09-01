# Architecture

## Why `modules/`

This template groups code by business module because most admin applications are naturally organized as user, role, report, evaluation, system, and similar domains.

```text
src/
├── app/          app-level wiring
├── modules/      business modules
├── components/   cross-module UI/common components
├── layouts/      application layouts
├── hooks/        business-agnostic hooks
├── services/     network/infrastructure
├── store/        truly global client state
├── types/        cross-module types
├── utils/        pure helpers
└── styles/       global design tokens
```

## Dependency Direction

```text
app/layouts
   ↓
modules
   ↓
components / hooks / services / store / utils
```

A module may depend on shared infrastructure. Shared infrastructure must not depend on a concrete business module.

## State Ownership

- `useState`: local visual state
- Zustand: cross-page client state such as sidebar, theme, session-derived UI state
- TanStack Query: API/server state
- React Hook Form: form editing state
- URL search params: shareable filters, pagination, tab state when appropriate

## Module Example

`src/modules/user` demonstrates API functions, query keys, query hooks, mutation hooks, a TanStack Table, a Zod/RHF dialog form, and a route page.
