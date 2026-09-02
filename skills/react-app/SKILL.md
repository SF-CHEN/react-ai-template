---
name: react-app
description: 当前 React + TypeScript + Vite 模板的页面、组件、路由、表单、TypeScript 和目录实现规范。新增或重构业务页面与组件时使用。
---

# React 应用实现 Skill

## 目标

生成 **容易找到、容易理解、容易继续维护** 的 React 代码，而不是追求目录层级、类型数量或抽象数量。

## 快速放置决策

| 内容 | 默认位置 |
|---|---|
| 后端接口 | `src/api/<name>.ts` |
| 路由页面 | `src/pages/<name>/index.tsx` |
| 页面专用组件 | 当前页面目录同级 |
| 页面复杂后的组件 | `pages/<name>/components/` |
| 子页面 | `pages/<name>/<sub-page>/index.tsx` |
| 表单 Schema | 页面附近 `<name>.schema.ts` |
| 特殊 Query / Mutation | 页面附近 `<name>.query.ts` |
| 页面 Options | 页面附近 `<name>.options.ts` |
| 基础 UI | `src/components/ui` |
| 跨页面通用组件 | `src/components/common` |
| 跨页面通用 Hook | `src/hooks` |
| 全局客户端状态 | `src/store` |

简单页面不要默认创建 `components/hooks/query/schemas/types/constants/pages` 多层目录。

## 页面职责

`index.tsx` 优先负责：

- 页面整体布局；
- URL 查询条件；
- 业务流程编排；
- 组合页面专用组件。

标准 CRUD 的列表请求、增删改 Mutation、缓存刷新和新增/编辑弹窗状态优先交给 `useCrud`，页面不要重复维护一套。

大型表格列、复杂表单字段或重型图表配置有清晰 UI 边界时再拆出。

## 组件拆分

适合拆：独立 UI 边界、独立 Props、真实复用、逻辑职责明显，且拆出后页面更容易顺序阅读。

不适合拆：只有几行 JSX、只为减少行数、拆出后需要传大量零碎 props、组件名称难以表达职责。

## React

- 派生值直接计算，不用 `useEffect` 同步第二份 state。
- 用户交互引起的逻辑放事件处理函数。
- 新状态依赖旧状态时使用函数式 setState。
- 不机械添加 memo / useMemo / useCallback。
- 不在组件内部声明 React 组件。
- 动态列表使用稳定业务 ID 作为 key。
- Props 不可变，不直接修改数组或对象 state。
- 只有重型页面或明显 Bundle 收益时才懒加载；当前路由级懒加载由 app 层统一组织。

## 路由

业务页面路径、标题、图标统一维护在 `src/app/routes.tsx`。

- `routes.tsx`：业务路由元数据的单一来源；
- `router.tsx`：创建 Browser Router、布局、错误边界和兜底路由；
- `AppLayout`：消费 routes 派生出的导航项。

新增普通导航页面时，不要在 Router 和 Layout 分别硬编码两份 path。

## 表单

复杂表单统一 React Hook Form + Zod。

- 表单字段与 API 入参一致时，优先直接复用 API Input 类型，不再额外声明一份同结构 `FormData`。
- Schema 可以使用 `satisfies z.ZodType<ApiInput>` 校验与接口类型一致。
- 只有表单模型本身独立于接口 DTO 时，再使用 `z.infer` 推导独立表单类型。
- 表单字段与 API 入参一致时直接提交整个 `values`。
- 只有字段名、格式、过滤规则或 DTO 结构确实不同时才转换。
- 转换时优先 `{ ...values, changedField: transform(values.changedField) }`，不要重新抄写所有不变字段。
- shadcn/Base UI 的非原生表单控件优先使用 `Controller` 对接 React Hook Form。
- 错误信息放在字段附近；服务端错误由当前业务流程或统一请求层处理。

## TypeScript

推荐：

```ts
interface User {}
interface UserListParams {}
type UserStatus = 'enabled' | 'disabled'
```

不要使用 `IUser`、`UserType`、`UserInterface` 这类机械命名。

规则：

- 对象结构优先 `interface`；联合、工具、映射类型优先 `type`，不强制绝对统一。
- 禁止用 `any` 消除错误；外部未知数据用 `unknown` 后收窄。
- API 相关类型和 API 函数就近放置。
- 页面私有类型就近定义，跨业务共享后才进入 `src/types`。
- 不重复定义可从 Zod 或已有 DTO 推导/复用的类型。
- 优先字面量联合、`as const`、`satisfies`；不机械使用 enum。
- 泛型只有带来真实复用和推导价值时使用。
- 能可靠推导时不重复写类型标注，公共边界保持明确。

## 自动导入

业务代码继续使用项目现有自动导入：

- React 常用 API；
- `components/ui` 基础组件；
- `src/hooks` 通用 Hook；
- `IconLucideXxx` 图标。

API、页面组件、特殊 Query、Store、Utils、业务类型、`components/common` 和第三方业务库保持显式 import。

## L3 与注释

普通页面、页面专用组件、query/schema/options 默认不加 L3。

只有职责不直观的复杂公共基础设施才使用精简 L3：`INPUT / OUTPUT / POS`。

复杂业务流程、特殊状态联动、数据转换、`useEffect` 使用原因、兼容和性能取舍添加中文 Why 注释；不要给简单代码逐行翻译。

## 完成检查

- 文件是否放在最接近所有者的位置？
- 是否为了“整齐”创建了没必要的目录或类型？
- 标准 CRUD 是否优先复用了 `useCrud`？
- 表单和 API 入参一致时是否直接复用了类型并提交整个 values？
- 是否存在逐字段重复组装 payload？
- 路由和菜单是否来自同一份配置？
- 是否存在重复 state 或可派生 state？
- 是否优先复用了现有 UI / Hook / 工具？
- 简单文件是否被机械加了 L3 或无意义注释？
