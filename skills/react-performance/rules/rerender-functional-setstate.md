# Use Functional State Updates

When next state depends on previous state:

```tsx
setCount((count) => count + 1)
```

This avoids stale closures and makes update intent explicit.
