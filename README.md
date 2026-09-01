# React AI Template

一个面向 **AI 辅助开发 + 人工长期维护** 的 React + TypeScript + Vite 中后台模板。

## 技术栈

- React + TypeScript + Vite
- shadcn/ui 风格源码组件 + Base UI
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- TanStack Table
- Axios
- ECharts
- Day.js
- unplugin-auto-import
- unplugin-icons + Lucide Iconify 图标集
- ESLint + Prettier
- Vitest

项目不使用 Husky 和 lint-staged，不在本地 Git 提交阶段强制拦截。

## 目录结构

项目采用 **页面优先 + 渐进式分层**，默认保持简单，页面复杂后再按需拆目录。

```text
src/
├── api/
│   ├── request.ts
│   └── user.ts
├── app/
│   ├── App.tsx
│   └── AppProviders.tsx
├── components/
│   ├── charts/
│   ├── common/
│   └── ui/
├── pages/
│   ├── dashboard/
│   │   └── index.tsx
│   └── user/
│       ├── index.tsx
│       ├── UserTable.tsx
│       ├── UserFormDialog.tsx
│       ├── user.query.ts
│       └── user.schema.ts
├── layouts/
├── hooks/
├── store/
├── styles/
├── types/
└── utils/
```

## 目录设计原则

简单页面不要预先创建 `api / hooks / query / schemas / types / components / pages` 七八层目录。

例如用户管理默认只保留：

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
└── user.schema.ts
```

当页面明显复杂后，再按需增加 `components/`、`detail/`、`hooks/` 等子目录。

所有后端接口统一放在 `src/api/`。TanStack Query 属于页面的数据获取逻辑，放在使用它的页面附近。

## 自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-icons` 减少重复 import。

默认可以直接使用：

```text
React 常用 API
src/components/ui 下的基础 UI 组件
src/hooks 下的通用 Hook
Lucide 图标（IconLucideXxx）
```

例如：

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增用户
</Button>
```

业务 API、页面组件、业务 Query、Store、Utils、业务类型和 `components/common` 仍然保持显式 import，避免代码来源难以追踪。

## 代码注释

项目要求 AI 主动生成**有价值的简体中文注释**。

以下内容优先注释：

- 多步骤业务流程
- 特殊业务规则和边界条件
- 状态联动
- API、表单和页面数据之间的转换
- `useEffect`、缓存、懒加载等非直观实现
- 第三方库限制和兼容处理
- 性能优化
- 容易被误删、误改的代码

例如：

```ts
useEffect(() => {
  if (!open) return

  // React Hook Form 只在首次读取 defaultValues，切换编辑对象时需要主动同步
  form.reset(getDefaultValues(user))
}, [form, open, user])
```

不要求给每个变量和每行代码写注释，也不要写 `// 设置 loading`、`// 删除用户` 这种重复代码表面含义的说明。

详细规则见 `skills/code-comments/SKILL.md`。

## 开始使用

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm test:run
pnpm build
```

## 示例页面

模板包含：

- Dashboard + ECharts 示例
- Zustand 侧边栏状态示例
- 用户管理 CRUD 示例
- TanStack Query 查询、Mutation、缓存失效示例
- TanStack Table 表格示例
- React Hook Form + Zod 表单示例
- React、UI 基础组件和 Lucide 图标自动导入示例
- URL 搜索、筛选、分页状态示例
- 路由级懒加载示例

用户接口目前使用内存 Mock，方便模板在没有后端时展示完整流程。接入真实后端时替换 `src/api/user.ts` 即可。

## AI 开发规范

根目录 `AGENTS.md` 保存长期强制约定；`skills/` 只保存专项规则，避免把所有细节堆在一份文档里。

```text
skills/
├── react-project/
│   └── SKILL.md       页面、组件、表单、目录结构
├── react-data/
│   └── SKILL.md       API、TanStack Query、Zustand、URL 状态
├── typescript/
│   └── SKILL.md       TypeScript 类型、DTO、Zod、泛型
├── code-comments/
│   └── SKILL.md       中文代码注释、业务流程、Why 注释
└── react-performance/
    ├── SKILL.md       React 性能优化入口
    └── rules/         具体性能规则
```

建议 AI 按任务读取，而不是一次性加载全部 Skill：

- 页面、组件、表单、路由 → `skills/react-project/SKILL.md`
- API、Query、Mutation、状态管理 → `skills/react-data/SKILL.md`
- TypeScript 类型设计 → `skills/typescript/SKILL.md`
- 复杂业务流程、数据转换、关键代码注释 → `skills/code-comments/SKILL.md`
- 性能问题 → `skills/react-performance/SKILL.md`

另外可阅读：

- `docs/architecture.md`：目录设计说明
- `docs/ai-development.md`：AI 开发提示词和 Skill 路由

项目文档、代码注释和 Git 提交说明默认使用中文。
