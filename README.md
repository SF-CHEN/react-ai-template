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
│   └── generated/     Swagger / OpenAPI 自动生成代码
├── app/
├── components/
│   ├── charts/
│   ├── common/
│   └── ui/
├── pages/
├── layouts/
├── hooks/
├── store/
├── styles/
├── types/
└── utils/
```

简单页面不要预先创建 `api / hooks / query / schemas / types / components / pages` 七八层目录。所有后端接口统一放 `src/api/`，页面复杂后再按需增加子目录。

## 自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-icons`。

默认可以直接使用：

```text
React 常用 API
src/components/ui 下的基础 UI 组件
src/hooks 下的通用 Hook
Lucide 图标（IconLucideXxx）
```

业务 API、页面组件、业务 Query、Store、Utils、业务类型和 `components/common` 保持显式 import。

## Swagger / OpenAPI API 生成

模板内置 Swagger 2.0 / OpenAPI 3.x 生成脚本：

```text
script/
├── load-swagger.cjs
├── generate-api.cjs
├── doc.cjs
└── init-project.cjs
```

在 `.env` 配置：

```bash
SWAGGER_URL=http://localhost:8080/v3/api-docs
```

或者临时传入：

```bash
pnpm api:generate -- --url=http://localhost:8080/v3/api-docs
pnpm api:docs -- --file=./openapi.json
```

生成结果统一进入：

```text
src/api/generated/
├── <module>.ts
├── <module>.types.ts
├── enums.ts
├── options.ts
└── api.md
```

生成 API 统一调用 `src/api/request.ts` 的 `requestData<T>()`，因此 TanStack Query 可以直接拿到响应体数据。

`src/api/generated` 属于脚本维护区域：完全生成的 `.types.ts` 不手改；带 `<generated>` 标记的文件只在 `</generated>` 后写自定义代码。生成文件豁免 L3 头部，手写 API 仍遵循项目 L3 规范。

脚本从 URL 拉取的 Swagger 会缓存到 `script/api.json`，该文件已加入 `.gitignore`，避免把真实接口文档提交到模板仓库。

## 项目初始化

从模板创建新项目后，可以根据当前文件夹名更新 package 名称，并可指定页面标题：

```bash
pnpm init
pnpm init -- --title="安全评测平台"
```

初始化脚本只修改项目名和现有标题，不创建额外业务结构。

## L3 文件头与代码注释

项目要求手写源文件维护 L3 文件头，同时为复杂业务逻辑主动补充有价值的简体中文注释。

```ts
/**
 * [INPUT]: 依赖 {哪些模块/文件} 的 {什么功能}
 * [OUTPUT]: 对外提供 {函数/组件/类型/变量}
 * [POS]: {属于哪个模块} 的 {角色}，{与其他文件的关系}
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: {YYYY-MM-DD HH:mm:ss}
 */
```

`INPUT / OUTPUT / POS` 必须与真实代码一致；修改文件时同步刷新 `[TIME]`。`src/auto-imports.d.ts`、`src/vite-env.d.ts` 等自动生成文件豁免。

正文注释优先覆盖：多步骤业务流程、状态联动、特殊规则、数据转换、`useEffect` 使用原因、第三方限制、兼容处理、性能取舍和容易误改的代码。不要给每行代码写翻译式废话注释。

详细规则见 `skills/code-comments/SKILL.md`。

## AI 工作原则

- 编码前先阅读现有代码，明确会影响实现方向的假设、歧义和取舍。
- 简洁优先，不添加需求之外的功能、抽象、配置项或未来扩展点。
- 修改现有项目时只做完成任务所需的最小范围变更。
- 默认禁止 AI 主动运行 `typecheck / lint / test / build`；只有用户明确要求校验时才运行。
- 未执行自动化校验时，AI 最终回复必须明确说明。

详细规则见根目录 `AGENTS.md`。

## 开始使用

开发者可手动执行：

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm test:run
pnpm build
```

以上命令是项目提供给开发者的能力，不代表 AI 可以默认主动执行。

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

用户接口目前使用内存 Mock，方便模板在没有后端时展示完整流程。接入真实后端时可以使用手写 `src/api/*.ts`，也可以通过 Swagger/OpenAPI 生成到 `src/api/generated/`。

## AI 开发规范

```text
skills/
├── react-project/       页面、组件、表单、目录结构
├── react-data/          API、Swagger、TanStack Query、Zustand、URL 状态
├── typescript/          TypeScript 类型、DTO、Zod、泛型
├── code-comments/       L3 文件头、中文注释、业务流程、Why
└── react-performance/   React 性能优化
```

另外可阅读：

- `AGENTS.md`：项目长期强制约定
- `docs/architecture.md`：目录设计说明
- `docs/ai-development.md`：AI 开发提示词和 Skill 路由

项目文档、代码注释和 Git 提交说明默认使用中文。
