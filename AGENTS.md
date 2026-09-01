# React AI Template - AI / Agent 开发规范

本仓库用于开发人员与 AI 编程工具协作开发。默认优先级是：**清晰 > 可维护 > 一致 > 炫技式抽象**。

## 1. 技术栈

- React + TypeScript + Vite
- shadcn/ui 风格源码组件 + Base UI
- Tailwind CSS
- React Router
- TanStack Query：服务端状态
- Zustand：全局客户端状态
- React Hook Form + Zod：表单与校验
- TanStack Table：复杂表格逻辑
- Axios：HTTP 基础设施
- ECharts：图表

没有明确项目需求时，不要再引入职责重复的第二套库。

## 2. 目录与模块架构

业务代码统一放入 `src/modules/<module-name>`。

```text
src/modules/user/
├── pages/
├── components/
├── api/
├── hooks/
├── query/
├── schemas/
├── types/
└── constants/
```

跨模块代码放置规则：

- `src/components/ui`：基础 UI 组件
- `src/components/common`：跨业务通用组件
- `src/hooks`：与具体业务无关的 Hook
- `src/services`：HTTP 与基础设施
- `src/store`：真正的全局客户端状态
- `src/utils`：纯工具函数
- `src/types`：只放跨模块公共类型

不要为一个业务同时创建 `src/pages/user`、`src/api/user`、`src/types/user`、`src/store/user`。同一业务的代码应尽量聚合在自己的 module 中。

## 3. 状态归属

- 服务端数据：TanStack Query
- 全局客户端状态：Zustand
- 局部 UI 状态：`useState`
- 表单状态：React Hook Form
- 需要分享、刷新后保留或可复制链接的搜索/筛选/分页状态：URL Search Params

不要只是为了“全局都能访问”就把 TanStack Query 的接口数据复制进 Zustand。

## 4. API 规范

- 页面和 UI 组件禁止直接调用 Axios。
- 接口函数放在 `modules/<name>/api`。
- Query Hook 调用 API 函数。
- 使用结构化 Query Key，例如 `userKeys`，不要在各处随意拼数组。
- Mutation 成功后只失效真正需要刷新的 Query 范围。

## 5. React 规范

- Render 阶段保持组件纯净。
- 禁止直接修改 props 或 state。
- Hook 只能在顶层调用。
- 可以通过 props/state 直接计算出的值，不要使用 `useEffect + useState` 再保存一份。
- 用户交互逻辑优先放事件处理函数，不要无理由塞进 effect。
- 不要机械添加 `useMemo`、`useCallback`、`memo`。
- 新状态依赖旧状态时，使用函数式 setState。
- 不要在组件内部再定义 React 组件。
- 只有真正较重的页面或功能边界才使用懒加载。

## 6. 组件规范

- Page 组件负责页面布局、业务流程组织和组件组合。
- 只有存在明确职责边界时才拆组件，不按照固定行数机械拆分。
- Props 必须有明确 TypeScript 类型。
- 避免 `any`；确实无法避免时，必须添加中文注释说明原因。
- Props 回调命名使用 `onXxx`。
- 组件内部事件处理函数使用 `handleXxx`。
- 布尔变量使用 `isXxx`、`hasXxx`、`canXxx`、`shouldXxx`。

## 7. 表单规范

- 复杂表单优先先定义 Zod Schema。
- 可以时从 Schema 推导表单 TypeScript 类型。
- 表单字段与 API DTO 一致时，直接提交表单对象，不要重复逐字段赋值。
- 只有字段名、格式、过滤规则或 DTO 结构确实不同才做转换。

## 8. 样式规范

- 新建基础控件前先检查 `components/ui` 是否已有可复用组件。
- 页面与组件布局优先使用 Tailwind。
- 标准 UI 优先使用 `background`、`foreground`、`primary`、`border` 等设计变量，不随意硬编码颜色。
- 除第三方库需要动态内联样式外，避免大块 `style={{ ... }}`。
- 未明确要求时，不再引入 Ant Design、MUI 等第二套 UI 框架。

## 9. 注释规范

所有人工编写和 AI 生成的代码注释默认使用**中文**。

注释重点解释：

- 为什么这样设计
- 存在什么约束
- 兼容性原因
- 不明显的业务规则
- 容易误改的边界条件

不要重复代码表面含义。

不推荐：

```ts
// 设置 loading 为 true
setLoading(true)
```

推荐：

```ts
// 筛选条件变化后回到第一页，避免当前页超过过滤后的最大页数
setPage(1)
```

## 10. 文档语言规范

- `README.md` 使用中文。
- `docs/` 下文档使用中文。
- `skills/` 下的 Skill 说明与规则正文使用中文。
- 项目规划、开发说明、维护文档默认使用中文。
- 技术名词、库名、代码标识符可以保留英文原名。

## 11. Git 提交规范

Git commit message 默认使用中文，保持简短、明确，描述本次修改的真实目的。

推荐示例：

```text
初始化 React AI 项目模板
完善用户管理示例
优化请求错误处理
补充权限路由规范
修复用户列表分页问题
```

不要为了形式强制 Conventional Commits。如果团队后续决定使用，也应保证描述部分使用中文，例如：

```text
feat: 增加权限路由
fix: 修复用户列表分页
```

本项目不使用 Husky 和 lint-staged，不在本地提交阶段强制阻断 Git commit。

## 12. 代码质量

- 保留 ESLint 与 Prettier。
- 未明确调整项目策略前，不添加 Husky 或 lint-staged。
- ESLint 重点检查真实错误，不做过度风格限制。
- 完成较大修改后，在依赖可用时优先执行：

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

## 13. 性能优化

性能相关工作参考 `skills/react-performance/SKILL.md`。

默认先写清晰、可维护的代码。只有存在明确原因时才做性能优化，例如：

- 网络请求瀑布
- 昂贵的渲染计算
- 大列表
- Bundle 过大
- 可以观察到的重复渲染成本

禁止为了“看起来专业”机械添加缓存、memo、ref 或代码拆分。
