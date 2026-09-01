# React AI Template

A reusable React + TypeScript + Vite template designed for **AI-assisted development and human maintainability**.

## Stack

- React + TypeScript + Vite
- shadcn/ui-style source components with Base UI primitives
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- TanStack Table
- Axios
- ECharts
- Day.js
- ESLint + Prettier
- Vitest

No Husky or lint-staged: Git commits are intentionally not blocked by local hooks.

## Architecture

```text
src/
├── app/
│   └── providers/
├── components/
│   ├── charts/
│   ├── common/
│   └── ui/
├── hooks/
├── layouts/
├── modules/
│   ├── dashboard/
│   └── user/
├── services/
├── store/
├── styles/
├── types/
└── utils/
```

Business code is grouped under `modules/` rather than scattered across global `pages`, `api`, `types`, and `store` directories.

## Getting Started

```bash
pnpm install
pnpm dev
```

If pnpm is not installed, use your preferred package manager or enable/install pnpm first.

## Useful Commands

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm test:run
pnpm build
```

These commands are manual. There is no pre-commit hook.

## shadcn/ui

The project is configured for current shadcn/ui conventions and uses Base UI for the included Dialog primitive. Add more registry components as needed:

```bash
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add sidebar
```

Prefer adding components only when the project needs them instead of installing an enormous UI bundle up front.

## Demo

- Dashboard with ECharts wrapper
- Collapsible sidebar using Zustand
- User CRUD mock module
- TanStack Query query/mutations + invalidation
- TanStack Table list rendering
- React Hook Form + Zod edit dialog
- URL-based search/filter/pagination state
- Route-level lazy loading

The user API is intentionally an in-memory mock so the template can demonstrate the entire flow without a backend. Replace `src/modules/user/api/userApi.ts` with real endpoint calls when integrating a server.

## AI Rules

Read:

- `AGENTS.md` - repository-wide coding rules
- `skills/react-project/SKILL.md` - module generation conventions
- `skills/react-performance/SKILL.md` - Vite/TanStack-adapted React performance guidance
- `docs/ai-development.md` - prompting guidance

## Performance Skill

The performance skill is adapted from the user-provided Vercel React Best Practices skill. Next.js-only guidance is removed, SWR guidance is translated to TanStack Query, and optimizations are advisory rather than mechanical requirements.
