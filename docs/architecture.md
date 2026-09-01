# 项目架构说明

## 为什么不再使用 `modules/`

模板最初按业务模块拆成 `api / hooks / query / schemas / types / components / pages` 多层目录。对于多数中后台页面，这种结构会让简单业务被拆得过细，找一个用户管理功能需要跨很多目录。

现在采用 **页面优先 + 渐进式分层**。

核心目标：

- 简单页面一眼能看全
- API 有统一入口
- 页面复杂后仍然可以自然拆分
- 不为了“架构完整”制造空目录和单文件目录

## 顶层目录

```text
src/
├── api/          后端接口、请求/响应模型、Axios 基础设施
├── app/          应用入口、Provider、路由组织
├── pages/        页面与页面私有代码
├── components/   跨页面公共组件
├── layouts/      页面布局
├── hooks/        真正跨页面复用 Hook
├── store/        全局客户端状态
├── styles/       全局样式
├── types/        真正跨业务公共类型
└── utils/        通用纯函数
```

## 简单页面

简单 CRUD 页面默认保持扁平：

```text
pages/user/
├── index.tsx
├── UserTable.tsx
├── UserFormDialog.tsx
├── user.query.ts
└── user.schema.ts
```

其中：

- `index.tsx`：页面布局和业务流程
- `UserTable.tsx`：页面专用表格
- `UserFormDialog.tsx`：新增/编辑弹窗
- `user.query.ts`：TanStack Query、Mutation、Query Key
- `user.schema.ts`：Zod 表单校验
- `api/user.ts`：后端接口与直接相关的接口类型

## 复杂页面

当文件数量明显增加，或出现独立子页面/明确职责边界时，再按需分组：

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

不要因为模板中存在 `components/` 就要求每个页面必须创建它。

## API 方向

所有接口统一放在：

```text
src/api/
```

推荐：

```text
api/
├── request.ts
├── user.ts
├── role.ts
└── report.ts
```

页面通过 TanStack Query 调用 API 函数，页面组件本身不直接调用 Axios。

## 状态归属

- `useState`：局部 UI 状态
- Zustand：跨页面客户端状态
- TanStack Query：服务端数据
- React Hook Form：表单编辑状态
- URL Search Params：搜索、筛选、分页等可分享状态

## 判断是否需要拆目录

优先问：

1. 这个目录现在真的有多个同类文件吗？
2. 拆开后是否更容易找代码？
3. 是否存在清晰的职责边界？

如果答案是否定的，就先保持扁平。
