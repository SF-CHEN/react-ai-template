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

不要默认生成：

```text
components/
hooks/
query/
schemas/
types/
constants/
pages/
```

只有当文件明显增多或职责边界已经形成时，再演化为：

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

## 页面职责

`index.tsx` 优先负责：

- 页面整体布局
- 查询条件和 URL 状态
- 业务流程编排
- Dialog / Drawer 开关
- 组合页面专用组件

不要把大型表格列定义、复杂表单字段、重型图表配置全部堆进页面入口。

## 组件拆分判断

适合拆组件：

- 有独立 UI 边界
- 有独立 Props
- 在页面内重复使用
- 逻辑明显独立
- 拆出后页面更容易顺序阅读

不适合拆组件：

- 只有几行 JSX
- 只为了减少文件行数
- 拆出后必须传大量零碎 props
- 组件名字难以描述真实职责

## React 规则

- 派生值直接计算，不使用 `useEffect` 同步第二份 state。
- 交互行为放事件处理函数。
- 不机械添加 memo。
- 不在组件内部声明 React 组件。
- 动态列表使用稳定业务 ID 作为 key。
- Props 不可变，不直接修改数组或对象 state。

## 表单

复杂表单统一 React Hook Form + Zod。

```ts
export const userFormSchema = z.object({
  username: z.string().min(2),
  status: z.enum(['enabled', 'disabled']),
})

export type UserFormData = z.infer<typeof userFormSchema>
```

如果表单字段与接口入参一致：

```ts
await createUser(values)
```

不要重新逐字段复制：

```ts
await createUser({
  username: values.username,
  status: values.status,
})
```

除非接口 DTO 确实不同。

## 自动导入

以下直接使用，不手写 import：

- React 常用 API
- `components/ui` 基础组件
- `src/hooks` 通用 Hook
- Lucide 图标：`IconLucideXxx`

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增
</Button>
```

业务 API、业务 Query、页面组件、Store、Utils、业务类型和 `components/common` 保持显式 import。

## 代码注释

页面和组件代码不是“能看懂就完全不写注释”。遇到以下内容应主动写中文注释：

- 多步骤业务流程
- 特殊状态联动
- 表单和接口数据转换
- `useEffect` 等容易让人疑惑的实现
- 特殊业务规则和边界条件
- 第三方组件或框架限制
- 性能优化和兼容处理

例如：

```ts
useEffect(() => {
  if (!open) return

  // React Hook Form 只在首次读取 defaultValues，编辑对象变化时需要主动同步
  form.reset(getDefaultValues(user))
}, [form, open, user])
```

复杂提交流程可以标出关键阶段：

```ts
// 先完成服务端更新，成功后再关闭弹窗，避免请求失败时丢失用户输入
await updateMutation.mutateAsync(values)
setDialogOpen(false)
```

不要写 `// 设置状态`、`// 点击按钮` 这种重复代码表面含义的注释。

更详细的注释规范见 `skills/code-comments/SKILL.md`。

## 生成流程

1. 先阅读目标页面附近的现有文件。
2. 判断这是简单页面还是已经进入复杂页面阶段。
3. 先复用现有 UI、Hook、工具和技术栈。
4. 创建最少必要文件。
5. 业务流程优先写清楚，再考虑抽象。
6. 为复杂业务流程、特殊约束、数据转换和容易误改的实现添加必要的中文注释。
7. 完成后检查是否无意义增加目录或公共抽象。
8. 检查复杂文件是否完全没有注释；如果有，应确认是不是遗漏了关键说明。
