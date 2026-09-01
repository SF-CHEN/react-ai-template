---
name: react-performance
description: 面向当前 React + TypeScript + Vite + TanStack Query 模板的性能优化建议。处理网络瀑布、重复渲染、大列表、Bundle 体积或昂贵计算时使用。
---

# React 性能优化 Skill

本 Skill 基于用户提供的 Vercel React Best Practices 做了适配，目标不是机械套用“优化技巧”，而是在出现真实性能问题时提供可执行的判断依据。

## 总原则

默认优先写清晰、可维护的代码。

只有存在明确原因时才应用性能优化，例如：

- 多个独立请求被串行 await，形成网络瀑布
- 重复渲染产生可观察成本
- 页面包含大列表或大量 DOM
- 某个计算明显昂贵
- 重型依赖进入首屏 Bundle
- 相同接口被多个组件重复请求

不要为了“看起来性能更好”机械添加：

- `memo`
- `useMemo`
- `useCallback`
- `useRef`
- 懒加载
- 自建缓存

## 当前项目技术适配

### 服务端状态

本项目统一使用 TanStack Query，不引入 SWR。

相同 Query Key 的数据请求、缓存、失效刷新和 Mutation 都交给 TanStack Query 管理，不要在 `useEffect` 中重新实现一套请求缓存逻辑。

### Vite

Next.js 专属的 Server Component、Server Action、`next/dynamic` 等规则不适用于本模板。

需要拆包时使用 React `lazy` + `Suspense` 和 Vite 的动态 import 能力。

## 规则分类

- `async-*`：异步任务与请求瀑布
- `bundle-*`：Bundle 与动态加载
- `client-*`：客户端请求与缓存
- `rerender-*`：React 重渲染
- `rendering-*`：页面渲染成本
- `js-*`：通用 JavaScript 性能

## 使用方式

先确认问题，再查对应规则。例如：

- 页面首次打开很慢：优先检查 `async-*`、`bundle-*`
- 同一个接口重复发送：检查 `client-query-dedup.md`
- 输入时页面卡顿：检查 `rerender-*`
- 超长列表滚动卡顿：检查 `rendering-content-visibility.md`

性能优化完成后，仍然要优先保证代码可读性和后续维护成本。
