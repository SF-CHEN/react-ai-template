# React AI Template - Agent Rules

This repository is designed for humans and coding agents to work together. Prefer clear, maintainable code over clever abstractions.

## 1. Tech Stack

- React + TypeScript + Vite
- shadcn/ui-style source components, Base UI primitives
- Tailwind CSS
- React Router
- TanStack Query for server state
- Zustand for global client state
- React Hook Form + Zod for forms and validation
- TanStack Table for complex table behavior
- Axios for HTTP infrastructure
- ECharts for charts

Do not introduce an alternative library for the same responsibility without a concrete project need.

## 2. Architecture

Business code belongs under `src/modules/<module-name>`.

```text
src/modules/user/
├── pages/
├── components/
├── api/
├── hooks/
├── query/
├── schemas/
├── types/
└── constants/
```

Cross-module code belongs in:

- `src/components/ui`: UI primitives
- `src/components/common`: reusable application components
- `src/hooks`: business-agnostic hooks
- `src/services`: HTTP and infrastructure
- `src/store`: truly global client state
- `src/utils`: pure utilities
- `src/types`: cross-module types only

Do not create `src/pages/user`, `src/api/user`, `src/types/user`, and `src/store/user` for one feature. Keep business code colocated in its module.

## 3. Data and State

- Server data: TanStack Query.
- Global client state: Zustand.
- Local UI state: `useState`.
- Forms: React Hook Form.
- Search/filter/pagination state that should be shareable or bookmarkable: URL search params.

Never copy query data into Zustand just to make it globally accessible.

## 4. API Rules

- Pages and UI components must not call Axios directly.
- Put endpoint functions in `modules/<name>/api`.
- Query hooks call API functions.
- Use structured query keys (`userKeys`) rather than ad-hoc arrays everywhere.
- Invalidate the smallest useful query scope after mutations.

## 5. React Rules

- Components are pure during render.
- Never mutate props or state.
- Hooks are called only at the top level.
- Do not use `useEffect` for values that can be derived during render.
- Put user-interaction logic in event handlers instead of effects.
- Do not add `useMemo` or `useCallback` mechanically.
- Use functional state updates when next state depends on previous state.
- Do not define React components inside other components.
- Lazy-load genuinely heavy route or feature boundaries.

## 6. Component Rules

- Page components organize layout and module-level workflows.
- Extract components when they have a clear responsibility, not merely because a file reached an arbitrary line count.
- Prefer explicit props interfaces/types.
- Avoid `any`; if unavoidable, add a comment explaining why.
- Props callbacks use `onXxx`; local event handlers use `handleXxx`.
- Booleans use `isXxx`, `hasXxx`, `canXxx`, or `shouldXxx`.

## 7. Forms

- Define a Zod schema first.
- Infer form types from the schema where practical.
- If form fields match the API DTO, submit the form object directly.
- Only map fields when names, formats, filtering, or API DTOs genuinely differ.

## 8. Styling

- Prefer existing `components/ui` primitives before creating new basic controls.
- Use Tailwind for component/page layout.
- Use design tokens (`background`, `foreground`, `primary`, `border`, etc.) instead of arbitrary colors for standard UI.
- Avoid large inline `style` objects unless a library requires dynamic inline styles.
- Do not add a second UI framework such as Ant Design or MUI unless explicitly requested.

## 9. Comments

Comments should explain **why**, constraints, compatibility, or non-obvious tradeoffs.

Bad:

```ts
// Set loading to true
setLoading(true)
```

Good:

```ts
// Reset to page 1 because the previous page may not exist after filtering.
setPage(1)
```

## 10. Code Quality

- ESLint and Prettier are available but Git commits are not blocked by hooks.
- Do not add Husky or lint-staged unless the team explicitly changes this policy.
- Keep lint rules focused on real correctness issues rather than style debates.
- Before finishing substantial changes, prefer running `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, and `pnpm build` when dependencies are available.

## 11. Performance Skill

For performance-sensitive work, consult `skills/react-performance/SKILL.md`.

Do not optimize mechanically. Readability is the default; performance patterns need a concrete reason such as waterfalls, expensive render work, large lists, large bundles, or measurable rerender cost.
