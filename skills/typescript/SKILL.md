---
name: typescript
description: 当前模板的 TypeScript 类型设计规范。定义领域模型、API DTO、表单类型、组件 Props、泛型或处理 unknown/any 时使用。
---

# TypeScript 类型设计 Skill

## 核心目标

类型应该帮助开发者更快理解数据和约束，而不是为了“类型完整”制造大量类型文件。

## 命名

推荐：

```ts
interface User {}
interface UserListParams {}
type UserStatus = 'enabled' | 'disabled'
type UserId = number
```

不要：

```ts
interface IUser {}
type UserType = {}
interface UserInterface {}
```

不使用 `I` 前缀，也不机械添加 `Type` / `Interface` 后缀。

## interface 与 type

对象数据结构优先：

```ts
interface User {
  id: number
  username: string
}
```

联合、工具、映射、函数类型优先：

```ts
type UserStatus = 'enabled' | 'disabled'
type Nullable<T> = T | null
type SubmitHandler = (values: UserFormData) => Promise<void>
```

不需要为了“统一”强迫所有类型只能使用其中一种。

## 类型放在哪里

API 直接相关类型：

```text
src/api/user.ts
```

页面私有类型：和页面放在一起，或者数量少时直接定义在使用文件中。

真正跨业务类型：

```text
src/types/
```

不要默认创建：

```text
types/modules/user.ts
types/components.ts
types/enums.ts
types/index.ts
```

类型文件只有在能降低理解成本时才创建。

## Zod 与表单

Schema 是表单约束的真实来源时，从 Schema 推导类型：

```ts
export const userFormSchema = z.object({
  username: z.string().min(2),
  role: z.enum(['admin', 'user']),
})

export type UserFormData = z.infer<typeof userFormSchema>
```

不要再手写一份内容完全相同的 `UserFormData`。

## any 与 unknown

禁止：

```ts
const data: any = response.data
```

外部输入不确定时：

```ts
const data: unknown = response.data
```

再通过 Schema、类型守卫或明确判断收窄。

只有第三方类型缺失且无法合理补齐时才允许 `any`，并添加中文注释说明原因。

## 字面量、enum 与 satisfies

简单固定集合优先：

```ts
export const userStatuses = ['enabled', 'disabled'] as const
export type UserStatus = (typeof userStatuses)[number]
```

或者直接：

```ts
type UserStatus = 'enabled' | 'disabled'
```

没有协议兼容、反向映射或明确运行时枚举需求时，不要机械使用 `enum`。

配置对象推荐 `satisfies` 保留推导：

```ts
const roleLabels = {
  admin: '管理员',
  user: '普通用户',
} satisfies Record<UserRole, string>
```

## DTO 与领域模型

后端返回结构和页面模型一致时直接复用，不复制一份名字不同但字段相同的类型。

只有语义或结构确实不同才拆：

```ts
interface UserResponse {}
interface UserFormData {}
```

例如表单没有 `id/createdAt`，或者后端字段需要转换时，才应该存在不同模型。

## 可选与可空

明确业务语义：

```ts
name?: string       // 字段可以不存在
name: string | null // 字段存在，但值允许为空
```

不要为了“防报错”随意把字段全部改成可选。

## 泛型

适合泛型：

```ts
interface PageResult<T> {
  list: T[]
  total: number
}
```

不适合：为了把一段只用一次的逻辑变成复杂泛型 API。

泛型名称简单场景使用 `T`、`K`、`V`；含义不明显时使用 `TData`、`TParams` 等语义名称。

## Props

Props 使用明确类型：

```ts
interface UserTableProps {
  data: User[]
  loading?: boolean
  onEdit: (user: User) => void
}
```

不强制使用 `React.FC`。

## 类型推导

能可靠推导时不要重复标注：

```ts
const pageSize = 10
const users = data.list
```

在公共 API、函数参数、返回边界和复杂对象处保持明确类型。

## 禁止模式

- `IUser` 接口前缀
- 用 `any` 消除错误
- 重复定义相同 DTO
- 所有类型集中进一个巨大 `types/` 目录
- 为每个小对象创建独立类型文件
- 所有固定值都改成 enum
- 为简单逻辑设计多层泛型
- 用类型断言 `as Xxx` 掩盖真实不匹配

## 完成检查

- 类型名称是否表达业务含义？
- 类型是否放在最接近所有者的位置？
- 是否存在可从 Zod 推导却重复手写的类型？
- 是否存在无必要的 `any` / `as`？
- 是否重复定义了 API 或领域模型？
