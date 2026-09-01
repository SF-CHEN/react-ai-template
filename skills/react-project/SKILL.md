---
name: react-project-conventions
description: 本 React + TypeScript + Vite 模板的目录与实现规范。新增页面、接口、表单、表格、路由或公共组件时使用。
---

# React 项目开发规范 Skill

## 快速决策

| 需求 | 放置位置 |
|---|---|
| 后端接口 | `src/api/<name>.ts` |
| 路由页面 | `src/pages/<name>/index.tsx` |
| 页面专用组件 | 页面目录同级，复杂后再放 `components/` |
| 服务端状态 | 页面附近的 `<name>.query.ts` |
| 表单校验 | 页面附近的 `<name>.schema.ts` |
| 全局客户端状态 | Zustand / `src/store` |
| 基础 UI | `src/components/ui`，允许自动导入 |
| 跨页面组件 | `src/components/common`，保持显式导入 |
| 通用 Hook | `src/hooks`，允许自动导入 |
| 图标 | `IconLucideXxx`，自动导入 |

## 默认结构

简单页面优先：

```text
pages/example/
├── index.tsx
├── ExampleTable.tsx
├── ExampleFormDialog.tsx
├── example.query.ts
└── example.schema.ts
```

只创建真正需要的文件，不要默认生成多层 `api / hooks / query / schemas / types / components / pages` 目录。

## 复杂后再拆

只有文件明显增多或存在明确职责边界时，再增加 `components/`、`hooks/`、`detail/`、`settings/` 等目录。目录应该降低复杂度，而不是制造复杂度。

## API 规则

所有接口统一放在 `src/api`。

接口文件可以包含与接口直接相关的请求/响应类型。页面通过 TanStack Query 调用接口函数，页面组件不直接调用 Axios。

## 自动导入规则

项目使用 `unplugin-auto-import + unplugin-icons`。

可以直接使用而不写 import：

- React 常用 API
- `src/components/ui` 中的基础 UI 组件
- `src/hooks` 中的通用 Hook
- Lucide 图标，统一写成 `IconLucideXxx`

例如：

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增
</Button>
```

不要生成 `lucide-react` import。默认只启用 Lucide 图标集合，不要自行增加其他图标集合。

业务相关内容保持显式 import，包括 API、页面组件、业务 Query、Store、工具函数、类型和 `components/common`。

不要扩大自动扫描范围到整个 `src`，避免代码来源变得不可追踪。

## 生成原则

1. 先阅读目标页面附近代码，再决定结构。
2. 简单业务保持扁平。
3. 复杂度出现后再渐进拆分。
4. 基础 UI、React API 和 Lucide 图标优先使用自动导入。
5. 业务依赖保持显式 import。
6. 每份状态只保留一个真实来源。
7. 优先直接、容易阅读的代码，不做无意义通用抽象。
8. 保持现有命名、路径别名和技术栈。
9. 非显而易见的决策使用中文 Why 注释。
10. 现有依赖能解决问题时，不新增同职责依赖。
