# 并行执行互不依赖的异步任务

多个操作彼此不依赖时，应尽量同时启动，避免形成不必要的请求瀑布。

```ts
// 不推荐：两个独立请求被串行执行
const user = await getUser()
const roles = await getRoles()

// 推荐：并行等待
const [user, roles] = await Promise.all([getUser(), getRoles()])
```

如果操作 B 确实依赖操作 A 的结果，就不要为了并行而强行使用 `Promise.all`。
