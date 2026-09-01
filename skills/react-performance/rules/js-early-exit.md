# 尽早返回，减少无意义工作

当函数已经可以确定结果时，尽早 `return`，减少后续不必要的判断和计算。

```ts
if (!user) return null
if (!user.enabled) return null

return buildUserView(user)
```

优先提升可读性，不要为了微小性能收益把简单逻辑改得难懂。
