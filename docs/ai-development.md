# AI 开发指南

## 生成代码前

1. 先阅读 `AGENTS.md`。
2. 新增结构前，先检查最接近的现有业务模块。
3. 优先复用现有 UI 组件、Hook 和工具函数。
4. 写组件前先判断状态应该属于 useState、Zustand、TanStack Query、React Hook Form 还是 URL。
5. 代码注释、文档和 Git 提交说明默认使用中文。

## 推荐提示词模板

```text
在当前仓库实现 <功能名称>。
遵循 AGENTS.md 与现有 modules 架构。
优先复用已有 UI 组件和依赖。
只在非显而易见的设计决策处添加中文 Why 注释。
现有技术栈能解决问题时，不要新增重复依赖。
服务端状态使用 TanStack Query，全局客户端状态使用 Zustand。
复杂表单使用 React Hook Form + Zod。
如果依赖可用，完成后执行 typecheck / lint / test / build。
```

## 合格的 AI 输出应该具备

例如新增“安全测评”功能时：

- 创建 `modules/evaluation`，而不是把文件散落到多个全局目录；
- API、Query Key、表单、类型、组件尽量就近组织；
- 接口列表数据使用 TanStack Query，而不是复制进 Zustand；
- 复杂表单使用 Zod + React Hook Form；
- 优先复用 `components/ui`；
- 不创建没有实际价值的通用抽象；
- 不机械添加 `useMemo`、`useCallback`、`memo`；
- 注释解释“为什么”，并使用中文。
