# Lazy-load Heavy Feature Boundaries

For heavy routes/editors/charts that are not required immediately, prefer `React.lazy` or dynamic `import()`.

```tsx
const ReportDesigner = lazy(() => import('./ReportDesigner'))
```

Do not split tiny components merely to increase the number of chunks.
