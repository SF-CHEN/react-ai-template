# React AI Template

一个面向 **AI 辅助开发 + 人工长期维护** 的 React + TypeScript + Vite 中后台模板。

核心目标不是堆叠架构，而是让 AI 生成的代码 **容易找到、容易理解、容易继续维护**。

## 技术栈

- React + TypeScript + Vite
- shadcn/ui + Base UI + Tailwind CSS
- React Router
- TanStack Query + React Query Devtools
- Zustand
- React Hook Form + Zod
- TanStack Table
- Axios
- ECharts
- Day.js
- unplugin-auto-import
- unplugin-icons + Lucide Iconify
- lucide-react（shadcn/ui 源码兼容）
- ESLint + Prettier
- Vitest
- Knip（按需检查未使用文件、导出和依赖）

项目暂不使用 Husky / lint-staged，也暂不内置 CI 强制校验。

## 目录结构

项目采用 **页面优先 + 渐进式分层**：

```text
src/
├── api/                  API、HTTP 基础设施、OpenAPI 生成代码
├── app/                  Provider、路由配置和应用级基础设施
├── components/
│   ├── charts/           ECharts 等公共图表封装
│   ├── common/           跨页面公共组件
│   └── ui/               shadcn/ui 基础组件源码
├── pages/                页面与页面私有代码
├── layouts/
├── hooks/
├── store/
├── styles/
├── types/
└── utils/
```

简单 CRUD 页面默认保持扁平：

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
├── user.schema.ts
└── user.options.ts
```

所有后端接口统一放 `src/api/`；页面复杂后再按真实职责增加子目录，不预先制造多层结构。

## 路由与菜单

业务路由元数据统一放在：

```text
src/app/routes.tsx
```

`router.tsx` 负责创建 Browser Router，`AppLayout` 从同一份 routes 配置生成侧边导航，避免新增页面时分别维护路由和菜单。

## shadcn/ui

`src/components/ui/**` 是基础 UI 源码区。优先直接使用 shadcn/ui 已有能力，不重复手写 Button、Dialog、Select、AlertDialog 等同类组件。

当前项目使用 Base UI 版本的 shadcn 组件。业务代码中的 React API、基础 UI、通用 Hook 和 `IconLucideXxx` 继续使用现有自动导入；shadcn/ui 源码允许保留官方 `lucide-react` 显式 import。

## L3 与代码注释

L3 已精简为 **复杂公共基础设施专用**，普通页面和基础 UI 不再机械添加文件头。

复杂公共文件需要时使用：

```ts
/**
 * [INPUT]: 依赖什么能力
 * [OUTPUT]: 对外提供什么
 * [POS]: 在项目中的职责和关系
 */
```

不再维护 `[TIME]` 和 `[PROTOCOL]`。

正文注释优先解释业务流程、特殊约束、状态联动、数据转换、兼容原因和 Why，不写逐行翻译式注释。

## AI Skill

```text
skills/
├── react-app/            页面、组件、路由、表单、TypeScript、目录
├── react-data/           API、Query、Mutation、Zustand、URL、OpenAPI
├── react-ui/             shadcn/ui、页面视觉、交互状态、响应式、a11y
└── react-performance/    网络、Bundle、重渲染、大列表、昂贵计算
```

`AGENTS.md` 只负责全局硬约束，Skill 负责专项实现方法，`docs/` 负责背景说明。

## Swagger / OpenAPI

模板内置 Swagger 2.0 / OpenAPI 3.x 生成脚本：

```bash
pnpm api:generate
pnpm api:docs
pnpm api:all
```

生成结果统一位于 `src/api/generated/`，不直接手改。options label 的人工修正统一维护在 `script/option-label-overrides.cjs`。

详细说明见 `script/README.md` 和 `docs/options.md`。

## 环境配置

可提交的非敏感默认配置：

```text
.env
.env.development
.env.production
```

敏感值和个人本机覆盖放在：

```text
.env.local
.env.development.local
.env.production.local
```

`*.local` 已加入 `.gitignore`。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm test:run
pnpm build
pnpm check:deadcode
```

这些是开发者可手动使用的能力。AI 默认不主动运行 typecheck / lint / test / build / deadcode 检查，除非用户明确要求。

## 示例内容

模板当前包含：

- Dashboard + ECharts 示例
- Zustand 侧边栏状态
- 用户 CRUD
- TanStack Query Query / Mutation / 缓存失效
- TanStack Table
- React Hook Form + Zod
- shadcn/ui Select / Dialog / AlertDialog
- URL 搜索、筛选、分页
- 路由级懒加载与统一错误页
- React Query Devtools

详细 AI 规则见根目录 `AGENTS.md`。
