# 昂贵的初始值使用惰性初始化

如果 `useState` 的初始值需要较重计算，使用函数形式，避免每次渲染都重新执行初始化表达式。

```tsx
const [data] = useState(() => buildInitialData())
```

简单常量或廉价计算不需要刻意使用这种写法。
