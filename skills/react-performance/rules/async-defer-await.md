# 延后不必要的 await

不要在函数一开始就等待当前分支不一定需要的异步结果。

只有真正执行到需要该结果的分支时再 `await`，可以减少无意义等待，也能避免某些路径被不相关请求拖慢。

```ts
// 不推荐：无论后面是否使用都会等待
const user = await getUser()
if (!needUser) return

// 推荐：只有真正需要时才等待
if (!needUser) return
const user = await getUser()
```

前提是延后等待不会改变业务行为或错误处理语义。
