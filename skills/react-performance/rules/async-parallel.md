# Parallelize Independent Async Work

When multiple operations do not depend on one another, start them together.

```ts
// Avoid
const user = await getUser()
const roles = await getRoles()

// Prefer
const [user, roles] = await Promise.all([getUser(), getRoles()])
```

Do not use `Promise.all` when operation B genuinely depends on operation A.
