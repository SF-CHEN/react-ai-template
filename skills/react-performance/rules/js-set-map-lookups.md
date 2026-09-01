# Use Set or Map for Repeated Large Lookups

If a large list is repeatedly searched by key, pre-index it.

```ts
const usersById = new Map(users.map((user) => [user.id, user]))
```

For one-off small lookups, `find` is often clearer and fast enough.
