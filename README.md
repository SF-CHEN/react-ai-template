# React AI Template

一个面向 **AI 辅助开发 + 人工长期维护** 的 React + TypeScript + Vite 项目模板。

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
- ESLint + Prettier
- Vitest

项目不使用 Husky 和 lint-staged，不在本地 Git 提交阶段强制拦截，保持开发流程轻量。

## 目录结构

```text
src/
├── app/              应用级入口、Provider、路由组织
├── components/
│   ├── charts/       图表基础组件
│   ├── common/       跨业务通用组件
│   └── ui/           基础 UI 组件
├── hooks/            与具体业务无关的通用 Hook
├── layouts/          页面布局
├── modules/          业务模块
│   ├── dashboard/
│   └── user/
├── services/         请求与基础设施
├── store/            真正的全局客户端状态
├── styles/           全局样式与设计变量
├── types/            跨模块公共类型
└── utils/            纯工具函数
```

业务代码统一放在 `modules/` 下，避免同一业务散落到全局 `pages`、`api`、`types`、`store` 等多个目录中。

## 快速开始

```bash
pnpm install
pnpm dev
```

如果本地没有 pnpm，请先安装或启用 pnpm，也可以根据团队习惯改用其他包管理器。

## 常用命令

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm test:run
pnpm build
```

这些检查均为手动执行，不配置 pre-commit Hook。

## shadcn/ui

项目已经按当前 shadcn/ui 的使用方式配置，并在 Dialog 中使用 Base UI 作为底层 primitive。其他组件按需添加：

```bash
pnpm dlx shadcn@latest add tooltip
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add sidebar
```

不要为了“以后可能会用”一次性引入大量 UI 组件，优先按真实需求添加。

## 示例内容

模板内置以下标准示例，后续新增业务模块时可以直接参考：

- Dashboard + ECharts 封装
- Zustand 管理侧边栏状态
- 用户管理 CRUD 模块
- TanStack Query 查询、Mutation 与缓存失效
- TanStack Table 列表渲染
- React Hook Form + Zod 编辑弹窗
- 基于 URL Search Params 的搜索、筛选与分页状态
- 路由级懒加载

用户接口目前使用内存 Mock，目的是让模板在没有后端的情况下也能展示完整的数据流。接入真实后端时，替换 `src/modules/user/api/userApi.ts` 即可。

## AI 开发规范

AI 或开发人员新增代码前，优先阅读：

- `AGENTS.md`：仓库级开发规则
- `skills/react-project/SKILL.md`：模块生成与工程约定
- `skills/react-performance/SKILL.md`：React 性能建议
- `docs/ai-development.md`：AI 开发使用指南
- `docs/architecture.md`：项目架构说明

## 中文约定

本项目默认：

- README、docs、Skill 文档使用中文
- 代码注释使用中文，并优先解释“为什么这样做”
- Git 提交说明使用中文
- 代码标识符、类型名、组件名、API 名等保持英文

## React 性能 Skill

性能 Skill 基于用户提供的 Vercel React Best Practices 进行适配：去掉 Next.js 专属规则，将 SWR 相关建议替换为 TanStack Query，并且所有性能优化都作为“按需建议”，不要求机械套用。
