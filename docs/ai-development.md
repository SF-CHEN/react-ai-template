# AI 开发指南

## 生成代码前

1. 先阅读 `AGENTS.md`。
2. 先看目标页面附近已有文件，再决定是否需要新目录。
3. 优先复用现有 UI 组件和依赖。
4. 先判断状态属于 Query、Zustand、表单、URL 还是局部 state。
5. 不要为了“架构完整”提前创建大量目录。

## 推荐提示词

```text
在当前项目中实现 <功能>。
遵循 AGENTS.md 和现有页面优先、渐进式分层结构。
API 统一放在 src/api，不要放进页面目录。
简单页面保持扁平，只有复杂度确实上升时才增加 components/hooks/detail 等子目录。
优先复用现有 UI 组件和依赖。
非显而易见的设计决策添加中文 Why 注释。
除非现有技术栈无法满足需求，否则不要新增依赖。
依赖可用时执行 typecheck、lint、test 和 build。
```

## 合格的 AI 输出

应该做到：

- 新增简单页面时优先使用 `pages/<name>/index.tsx` 加少量同级文件；
- 接口统一添加到 `src/api/<name>.ts`；
- TanStack Query 逻辑放在页面附近，例如 `user.query.ts`；
- 不把接口数据复制进 Zustand；
- 复杂表单使用 React Hook Form + Zod；
- 页面专用组件先就近放，跨页面复用后再提升到 `components/common`；
- 避免无意义抽象、无意义目录和机械 memo。
