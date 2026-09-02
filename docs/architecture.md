# 项目架构说明

## 核心方向

模板采用 **页面优先 + 渐进式分层**，不使用 `modules/` 或重型 FSD 作为默认结构。

目标：

- 简单业务一眼能看全；
- API 有统一入口；
- 页面复杂后可以自然拆分；
- AI 不需要跨多个业务目录寻找一个功能；
- 不为了“架构完整”制造空目录和单文件目录。

## 顶层目录

```text
src/
├── api/          后端接口、请求/响应模型、Axios 基础设施
├── app/          Provider、路由配置、错误边界等应用级能力
├── pages/        页面与页面私有代码
├── components/   跨页面公共组件、UI 源码、图表封装
├── layouts/      页面布局
├── hooks/        真正跨页面复用 Hook
├── store/        全局客户端状态
├── styles/       全局样式
├── types/        真正跨业务公共类型
└── utils/        通用纯函数
```

## 路由单一数据源

业务路由和侧边导航使用同一份配置：

```text
app/routes.tsx
    ├── appRoutes       页面路径、标题、图标、懒加载组件
    └── navItems        从 appRoutes 派生

app/router.tsx
    └── createBrowserRouter + AppLayout + ErrorBoundary

layouts/AppLayout.tsx
    └── 消费 navItems 渲染导航
```

新增普通导航页面时，优先只改 `app/routes.tsx`。

## 简单页面

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
├── user.schema.ts
└── user.options.ts
```

其中：

- `index.tsx`：页面布局和业务流程；
- `UserTable.tsx`：页面专用表格；
- `UserFormDialog.tsx`：新增/编辑弹窗；
- `user.query.ts`：TanStack Query / Mutation / Query Key；
- `user.schema.ts`：Zod 表单校验；
- `user.options.ts`：页面级选项聚合；
- `api/user.ts`：后端接口及直接相关类型。

## 复杂页面

只有文件明显增多或形成独立职责边界后再拆：

```text
pages/evaluation/
├── index.tsx
├── detail/
│   └── index.tsx
├── components/
├── evaluation.query.ts
└── evaluation.schema.ts
```

## 状态归属

- React state：局部 UI；
- Zustand：跨页面客户端状态；
- TanStack Query：服务端数据；
- React Hook Form：表单编辑状态；
- URL Search Params：需要分享或刷新后保留的搜索、筛选、分页。

同一份状态不要维护多个真实来源。

## L3 边界

L3 只用于请求层、复杂 Router / Provider、图表命令式封装、生成器等职责不直观的公共基础设施。

普通页面、页面私有文件、简单 Store/Hook/Utils、shadcn/ui 源码默认不加 L3。
