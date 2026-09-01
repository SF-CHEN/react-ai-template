# 使用 TanStack Query 管理请求去重与缓存

同一份服务端数据不要在多个组件里通过 `useEffect + useState` 各自请求和缓存。

本项目统一使用 TanStack Query，通过稳定的 Query Key 管理缓存、并发请求去重、失效刷新和重新获取。

```tsx
const userQuery = useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => getUserDetail(userId),
})
```

不要为了请求去重再额外引入 SWR，也不要自己维护全局请求缓存对象。
