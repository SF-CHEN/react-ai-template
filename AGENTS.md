# React AI Template - AI / Agent 开发规范

本仓库用于开发人员与 AI 编程工具协作开发。默认优先级：**清晰 > 易找 > 可维护 > 一致 > 炫技式抽象**。

## 1. 技术栈

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
- ESLint + Prettier

没有明确需求时，不要引入职责重复的第二套库。

## 2. 目录原则

项目采用**页面优先 + 渐进式分层**，不要预先为每个业务创建完整的分层目录。

```text
src/
├── api/              接口、请求模型、HTTP 基础设施
├── app/              应用入口、Provider、路由组织
├── pages/            路由页面及页面私有代码
├── components/
│   ├── ui/           基础 UI 组件
│   └── common/       跨页面通用组件
├── layouts/          布局
├── hooks/            真正跨页面通用 Hook
├── store/            全局客户端状态
├── styles/           全局样式
├── types/            真正跨业务公共类型
└── utils/            通用纯函数
```

### 简单页面默认扁平

例如用户管理：

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
└── user.schema.ts
```

不要机械创建：

```text
api/
hooks/
query/
schemas/
types/
components/
pages/
```

一个目录只有一两个文件时，优先保持扁平。

### 页面复杂后再分组

当页面文件明显增多，或出现清晰职责边界时，再按需创建子目录：

```text
pages/evaluation/
├── index.tsx
├── detail/
│   └── index.tsx
├── components/
│   ├── EvaluationTable.tsx
│   └── EvaluationForm.tsx
├── evaluation.query.ts
└── evaluation.schema.ts
```

目录是为了解决复杂度才创建，不是为了让结构看起来“完整”。

## 3. API 规范

所有后端接口统一放在 `src/api/`，不要把 API 放进页面或业务目录。

例如：

```text
src/api/
├── request.ts
├── user.ts
├── role.ts
└── report.ts
```

规则：

- 页面和 UI 组件不直接调用 Axios。
- `api/request.ts` 负责 Axios 实例、拦截器和基础请求能力。
- 每个业务接口文件可以同时放该接口直接相关的请求/响应类型。
- TanStack Query Hook 放在使用它的页面附近，例如 `pages/user/user.query.ts`。
- 不为了分层而单独创建 `query/userKeys.ts`、`hooks/useUserList.ts`、`hooks/useUserMutations.ts`；简单场景合并到一个 `user.query.ts`。

## 4. 状态归属

- 服务端数据：TanStack Query
- 全局客户端状态：Zustand
- 局部 UI 状态：`useState`
- 表单状态：React Hook Form
- 需要分享、刷新后保留的搜索/筛选/分页：URL Search Params

不要为了“全局访问方便”把 Query 数据复制到 Zustand。

## 5. React 规范

- Render 阶段保持纯净。
- 禁止直接修改 props 或 state。
- Hook 只能在顶层调用。
- 可以直接计算出的派生值，不要使用 `useEffect + useState` 保存第二份。
- 用户交互逻辑优先放事件处理函数。
- 不要机械添加 `useMemo`、`useCallback`、`memo`。
- 新状态依赖旧状态时使用函数式 setState。
- 不要在组件内部定义 React 组件。
- 只有真正较重的页面或功能边界才懒加载。

## 6. 组件规则

- `pages/<name>/index.tsx` 负责页面布局、业务流程和组件组合。
- 页面专用组件优先就近放在页面目录。
- 只有被多个页面复用时，才提升到 `components/common`。
- 基础控件统一放 `components/ui`。
- 不按固定行数机械拆组件，以职责是否清晰为判断标准。
- Props 使用明确 TypeScript 类型。
- 避免 `any`；确实无法避免时添加中文注释说明原因。

## 7. 表单规则

- 复杂表单使用 React Hook Form + Zod。
- Schema 与页面放在一起，例如 `pages/user/user.schema.ts`。
- 表单字段与接口入参一致时直接提交表单对象，不重复逐字段赋值。
- 只有字段名、格式、过滤规则或 DTO 结构不同才做转换。

## 8. 注释与文档

所有人工和 AI 生成的代码注释默认使用中文。

注释重点解释：为什么这样设计、约束、兼容性原因、业务边界和容易误改的地方。不要重复代码表面含义。

`README.md`、`docs/`、`skills/`、项目规划和维护文档默认使用中文。技术名词、库名和代码标识符保留英文原名即可。

## 9. Git 提交

Git commit message 默认使用中文，简短描述真实修改目的，例如：

```text
简化页面目录结构
完善用户管理示例
修复用户列表分页问题
优化请求错误处理
```

不强制 Conventional Commits；如果使用，描述部分仍写中文。

项目不使用 Husky 和 lint-staged。

## 10. 代码质量

保留 ESLint 与 Prettier，规则重点检查真实错误，不做过度风格限制。

完成较大修改后，在依赖可用时执行：

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

## 11. 性能优化

性能相关工作参考 `skills/react-performance/SKILL.md`。

默认先写清晰、可维护的代码。只有存在网络瀑布、昂贵渲染、大列表、大 Bundle 或可观察的重复渲染成本时再优化，禁止机械添加缓存和 memo。
