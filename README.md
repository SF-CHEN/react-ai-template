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
│   ├── user.ts
│   └── generated/       Swagger/OpenAPI 自动生成代码
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

script/
├── generate-api.cjs
├── load-swagger.cjs
├── doc.cjs
└── init-project.ps1
```

简单页面不要预先创建 `api / hooks / query / schemas / types / components / pages` 七八层目录。所有后端接口统一放 `src/api/`，页面复杂后再按需增加子目录。

## 环境配置

模板直接保留三份可提交的非敏感环境配置：

```text
.env                所有模式共享默认值
.env.development    开发环境覆盖
.env.production     生产环境覆盖
```

Vite 会按当前 mode 自动合并配置，mode 文件覆盖 `.env` 中的同名变量。

敏感值、个人地址和本机覆盖不要写进上述文件，统一放：

```text
.env.local
.env.development.local
.env.production.local
```

`*.local` 已加入 `.gitignore`。模板不再保留 `.env.example`。

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

`INPUT / OUTPUT / POS` 必须与真实代码一致；修改文件时同步刷新 `[TIME]`。`src/auto-imports.d.ts`、`src/vite-env.d.ts` 等工具生成声明不要求人工维护 L3；本模板的 API 生成器会为 `src/api/generated` 产物自动写入并刷新 L3。

正文注释优先覆盖：多步骤业务流程、状态联动、特殊规则、数据转换、`useEffect` 使用原因、第三方限制、兼容处理、性能取舍和容易误改的代码。不要给每行代码写翻译式废话注释。

详细规则见 `skills/code-comments/SKILL.md`。

## Swagger / OpenAPI 代码生成

模板内置 Swagger 2.0 / OpenAPI 3.x 生成脚本，不新增额外 npm 依赖。

开发环境可以在 `.env.development` 配置：

```env
SWAGGER_URL=http://localhost:8080/v3/api-docs
```

分别生成：

```bash
npm run api:generate
npm run api:docs
```

一次生成全部内容：

```bash
npm run api:all
```

`api:all` 会依次生成 API / TypeScript 类型 / enums / options，然后生成 `api.md`。

也可以临时指定地址或文件：

```bash
npm run api:generate -- --url=http://localhost:8080/v3/api-docs
npm run api:generate -- --file=script/api.json
```

生成结果固定为：

```text
src/api/generated/
├── user.ts
├── types/
│   └── user.ts
└── meta/
    ├── enums.ts
    ├── options.ts
    └── api.md
```

生成规则：

- `<module>.ts` 只放类型安全的 API 请求函数。
- DTO、Query Params、Request/Response 等 TypeScript 类型统一放 `types/<module>.ts`，不与请求函数混写。
- `enums.ts`、`options.ts` 和 `api.md` 统一放 `meta/`，集中存放生成辅助信息。
- `options.ts` 的 `label` 优先读取 Swagger/OpenAPI 自带的中文枚举说明，包括常见 `x-enum-*` 描述和可明确配对的 `description`；没有中文说明时回退英文说明，再没有则使用 enum 原值。`value` 始终保持后端真实 enum 值。
- API 请求统一调用 `src/api/request.ts` 的 `requestData<T>()`。
- generated API、类型和常量自动带 L3 文件头，并在每次生成时刷新 `[TIME]`。
- generated 目录由脚本维护；需要业务语义封装时，在 `src/api/*.ts` 新建手写文件。
- `script/api.json` 只是本地 Swagger 缓存，已加入 `.gitignore`。

使用 pnpm 时同样可以执行 `pnpm api:generate`、`pnpm api:docs`、`pnpm api:all`。

## 项目初始化脚本

复制模板后可以执行：

```bash
pnpm init:project
pnpm init:project -- -ProjectTitle 中文项目标题
```

脚本只更新当前模板真实存在的 `package.json` name 与 `index.html` title。

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

用户接口目前使用内存 Mock。接入真实后端时可以继续保留手写 `src/api/user.ts`，也可以通过 `src/api/generated` 调用自动生成接口。

## AI 开发规范

```text
skills/
├── react-project/       页面、组件、表单、目录结构
├── react-data/          API、TanStack Query、Zustand、URL 状态
├── typescript/          TypeScript 类型、DTO、Zod、泛型
├── code-comments/       L3 文件头、中文注释、业务流程、Why
└── react-performance/   React 性能优化
```

另外可阅读：

- `AGENTS.md`：项目长期强制约定
- `docs/architecture.md`：目录设计说明
- `docs/ai-development.md`：AI 开发提示词和 Skill 路由

项目文档、代码注释和 Git 提交说明默认使用中文。
