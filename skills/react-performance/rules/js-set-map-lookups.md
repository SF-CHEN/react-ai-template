# 高频查找优先考虑 Set / Map

当同一批数据需要被大量重复查找时，可以考虑先构建 `Set` 或 `Map`，把重复的线性搜索转换为更直接的查找。

```ts
const enabledIds = new Set(users.filter((user) => user.enabled).map((user) => user.id))

const visible = rows.filter((row) => enabledIds.has(row.userId))
```

对于数据量很小、只查找一两次的场景，不需要为了性能额外构建 Set / Map。
