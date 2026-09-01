# 项目架构说明

## 为什么使用 `modules/`

这个模板以业务模块为核心组织代码。中后台项目通常天然由用户、角色、报告、测评、系统配置等业务域组成，把同一业务的页面、接口、类型、Hook 和表单放在一起，更容易查找和维护。

```text
src/
├── app/          应用级入口、Provider、路由组织
├── modules/      业务模块
├── components/   跨模块 UI / 通用组件
├── layouts/      应用布局
├── hooks/        与具体业务无关的 Hook
├── services/     请求与基础设施
├── store/        真正的全局客户端状态
├── types/        跨模块公共类型
├── utils/        纯工具函数
└── styles/       全局样式与设计变量
```

## 依赖方向

```text
app / layouts
      ↓
   modules
      ↓
components / hooks / services / store / utils
```

业务模块可以依赖共享基础层，但共享基础层不应该反向依赖某一个具体业务模块。

## 状态应该放在哪里

- `useState`：组件局部视觉状态，例如弹窗开关、局部 Tab。
- Zustand：跨页面客户端状态，例如侧边栏、主题、会话派生 UI 状态。
- TanStack Query：接口数据、缓存、刷新、Mutation 等服务端状态。
- React Hook Form：表单编辑状态。
- URL Search Params：适合被分享、刷新保留的筛选、分页、Tab 状态。

## 模块示例

`src/modules/user` 是模板的标准业务示例，包含：

- API 函数
- Query Key
- Query Hook
- Mutation Hook
- TanStack Table 表格
- Zod + React Hook Form 表单弹窗
- 路由页面

新增业务模块时，优先参考已有模块的结构，不要重新创造一套目录规范。
