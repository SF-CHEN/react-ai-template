# Options 组织规范

项目中的下拉、单选、多选等 options 按“来源”分三层管理，不把所有选项塞进一个全局大对象。

## 1. 后端 enum 自动生成

后端 Swagger / OpenAPI enum 生成到：

```text
src/api/generated/meta/options.ts
```

例如：

```ts
export const UserRoleOptions = [
  { label: '管理员', value: UserRoleEnum.ADMIN },
  { label: '普通用户', value: UserRoleEnum.USER },
] as const
```

这是生成文件，不直接手改。

## 2. 后端 options 中文修正

如果 Swagger 中文说明不完整或自动匹配错误，只修正 label：

```text
script/option-label-overrides.cjs
```

```js
module.exports = {
  UserRoleOptions: {
    ADMIN: '管理员',
  },
}
```

第一层 key 与生成的 `xxxOptions` 变量名完全一致；第二层 key 是后端真实 enum value。

重新执行 `api:generate` / `api:all` 后，人工修正仍然保留。

## 3. 纯前端固定 options

完全不属于后端 enum 的配置，例如性别、页面展示方式、前端固定筛选项，默认放在使用它的页面旁边：

```text
src/pages/user/
├── index.tsx
├── UserFormDialog.tsx
└── user.options.ts
```

例如：

```ts
const userSexOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
] as const
```

不要为了两个页面固定值就提前创建全局 options 目录。

## 页面统一聚合

页面可以通过一个页面级对象屏蔽 options 的来源差异。

例如用户页面中：角色来自后端自动生成，性别来自前端写死：

```ts
import { UserRoleOptions } from '@/api/generated/meta/options'

const userSexOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
] as const

export const userOptions = {
  role: UserRoleOptions,
  sex: userSexOptions,
} as const
```

页面只需要：

```ts
import { userOptions } from './user.options'

userOptions.role
userOptions.sex
```

推荐使用 `userOptions.role`、`userOptions.sex`，而不是全局的 `options.userRole`、`options.userSex`。

原因：

- `userOptions` 一眼能看出属于用户业务；
- 页面不用知道 role 来自 Swagger、sex 来自前端；
- 不会逐渐形成一个巨大且难维护的全局 `options` 对象；
- 页面代码仍然只需要一次 import。

## 什么时候提升为共享 options

默认先放页面附近。

只有同一组选项被多个无直接关系的页面真实复用时，再提升到共享位置，例如：

```text
src/options/
└── common.options.ts
```

不要提前创建：

```text
src/options/index.ts
```

然后把整个项目所有 options 都挂到一个对象上。

## 最终规则

```text
后端 enum
  → src/api/generated/meta/options.ts

后端 enum 中文识别错误
  → script/option-label-overrides.cjs

页面自己的前端固定值
  → src/pages/<page>/<page>.options.ts

跨多个页面真实复用的前端固定值
  → 再提升到 src/options/
```

页面优先使用页面级聚合对象：

```ts
userOptions.role
userOptions.sex
```

这样既保持页面简洁，又保留清晰的数据来源和维护边界。
