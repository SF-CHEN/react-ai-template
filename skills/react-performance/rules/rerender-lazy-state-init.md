# Lazy Initialize Expensive State

```tsx
const [index] = useState(() => buildLargeIndex(source))
```

Use this only when the initializer is meaningfully expensive; simple literals do not need it.
