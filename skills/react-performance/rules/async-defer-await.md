# Defer Await Until Needed

Do not block all branches on work that only one branch needs.

```ts
const permissionPromise = getPermission()

if (mode === 'public') return loadPublicData()

const permission = await permissionPromise
return loadPrivateData(permission)
```
