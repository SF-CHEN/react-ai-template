---
name: react-project
description: 当前 React + TypeScript + Vite 模板的页面、目录、组件、表单和 UI 实现规范。新增或重构页面、组件、路由、表单、布局时使用。
---

# React 项目实现 Skill

## 目标

生成 **容易找到、容易理解、容易继续维护** 的 React 代码，而不是追求目录层级或抽象数量。

## 快速放置决策

| 内容 | 默认位置 |
|---|---|
| 后端接口 | `src/api/<name>.ts` |
| 路由页面 | `src/pages/<name>/index.tsx` |
| 页面专用组件 | 当前页面目录同级 |
| 页面复杂后的组件 | `pages/<name>/components/` |
| 子页面 | `pages/<name>/<sub-page>/index.tsx` |
| 表单 Schema | 页面附近 `<name>.schema.ts` |
| 页面 Query | 页面附近 `<name>.query.ts` |
| 基础 UI | `src/components/ui` |
| 跨页面通用组件 | `src/components/common` |
| 跨页面通用 Hook | `src/hooks` |
| 全局客户端状态 | `src/store` |

## 页面结构

简单页面默认：

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
└── user.schema.ts
```

不要默认创建 `components/hooks/query/schemas/types/constants/pages` 多层目录。只有文件明显增多或职责边界形成后，再渐进拆分。

## 页面职责

`index.tsx` 优先负责：

- 页面整体布局；
- 查询条件和 URL 状态；
- 业务流程编排；
- Dialog / Drawer 开关；
- 组合页面专用组件。

不要把大型表格列定义、复杂表单字段、重型图表配置全部堆进页面入口。

## 组件拆分判断

适合拆组件：有独立 UI 边界、独立 Props、重复使用、逻辑明显独立，且拆出后页面更容易顺序阅读。

不适合拆组件：只有几行 JSX、只为了减少文件行数、拆出后必须传大量零碎 props、组件名字难以描述真实职责。

## 基础 UI 与 shadcn/ui

基础 UI 优先使用 shadcn/ui 已有组件源码，不为 Button、Dialog、Select、Dropdown 等已有能力重复维护另一套实现。

`src/components/ui/**` 是 shadcn/ui 基础组件源码区：

- 通过 shadcn CLI 新增或同步组件时，优先保留官方组件结构；
- shadcn/ui 源码允许显式 `import { XxxIcon } from 'lucide-react'`；
- 不为了业务侧的图标自动导入规则，把 shadcn 源码中的 `lucide-react` 改成 `IconLucideXxx`；
- 只有 shadcn/ui 没有合适能力或项目确实需要业务封装时，才新增自定义基础/公共组件。

## React 规则

- 派生值直接计算，不使用 `useEffect` 同步第二份 state。
- 交互行为放事件处理函数。
- 不机械添加 memo。
- 不在组件内部声明 React 组件。
- 动态列表使用稳定业务 ID 作为 key。
- Props 不可变，不直接修改数组或对象 state。

## 表单

复杂表单统一 React Hook Form + Zod。表单字段与接口入参一致时直接提交 `values`；只有 DTO 确实不同才转换。

## 自动导入

业务代码中以下内容直接使用，不手写 import：

- React 常用 API；
- `components/ui` 基础组件；
- `src/hooks` 通用 Hook；
- Lucide 图标：`IconLucideXxx`。

例如页面代码：

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增
</Button>
```

`src/components/ui/**` 的 shadcn/ui 源码是例外，允许保留官方 `lucide-react` 显式 import。

业务 API、业务 Query、页面组件、Store、Utils、业务类型和 `components/common` 保持显式 import。

## L3 与代码注释

新增手写源文件时，第一步就创建准确的 L3 文件头；修改现有源文件时同步检查并刷新 L3。

复杂业务流程、特殊状态联动、数据转换、`useEffect` 使用原因、特殊业务规则、框架限制、性能优化和兼容处理需要主动添加中文注释。

详细规则见 `skills/code-comments/SKILL.md`。

## 生成流程

1. 先阅读 `AGENTS.md` 和目标页面附近现有文件。
2. 识别关键假设；存在影响实现方向的歧义时先说明。
3. 判断这是简单页面还是已经进入复杂页面阶段。
4. 先复用现有 shadcn/ui、Hook、工具和技术栈。
5. 创建最少必要文件，不添加需求之外的功能和扩展点。
6. 为新建手写源文件填写真实 L3 文件头。
7. 业务流程优先写清楚，再考虑抽象。
8. 为复杂业务流程、特殊约束、数据转换和容易误改的实现添加必要中文注释。
9. 修改完成后静态检查 L3、import、目录和代码一致性。
10. 除非用户明确要求，不运行 typecheck、lint、test、build。
