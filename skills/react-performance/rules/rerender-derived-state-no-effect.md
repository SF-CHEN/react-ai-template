# 派生状态不要通过 Effect 同步

如果一个值可以直接根据当前 props 或 state 计算得到，就不要再额外保存一份同步状态。

```tsx
// 不推荐
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(`${firstName} ${lastName}`), [firstName, lastName])

// 推荐
const fullName = `${firstName} ${lastName}`
```

这样可以减少状态源、避免同步错误，也能减少一次额外渲染。
