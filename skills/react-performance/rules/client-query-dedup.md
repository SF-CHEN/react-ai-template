# Use TanStack Query for Server-state Deduplication

Do not recreate request cache state in every component.

```tsx
const userQuery = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
})
```

Components using the same query key share the query cache and in-flight request lifecycle.
