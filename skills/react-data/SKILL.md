---
name: react-data
description: 当前模板的数据访问和状态管理规范。编写 API、TanStack Query、Mutation、Zustand、搜索筛选分页或缓存逻辑时使用。
---

# React 数据与状态 Skill

## 先判断状态属于哪里

| 状态 | 使用方式 |
|---|---|
| 后端返回的数据 | TanStack Query |
| 全局客户端状态 | Zustand |
| 当前组件 UI 状态 | React state |
| 表单字段 | React Hook Form |
| 搜索、筛选、分页、可分享状态 | URL Search Params |

同一份状态不要同时维护两份真实来源。

## API 层

所有后端请求统一放 `src/api`：

```text
src/api/
├── request.ts
├── user.ts
└── report.ts
```

页面不要直接调用 Axios。

```ts
// src/api/user.ts
export interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
}

export function getUserList(params: UserListParams) {
  return request.get('/users', { params })
}
```

API 直接相关的请求和响应类型可以和接口函数放在同一个文件，避免为了类型再创建一层目录。

## TanStack Query

页面附近使用一个 `<name>.query.ts` 组织简单业务的 Query Key、Query 和 Mutation：

```ts
const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => [...userKeys.all, 'list', params] as const,
}

export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUserList(params),
  })
}
```

不要默认拆成：

```text
query/userKeys.ts
hooks/useUserList.ts
hooks/useUserMutations.ts
```

只有文件真的变复杂后再拆。

## Mutation 与缓存

修改成功后只失效真正受影响的 Query：

```ts
const queryClient = useQueryClient()

return useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all })
  },
})
```

规则：

- 不在 Mutation 后手动重新请求所有接口。
- 不自建一套和 TanStack Query 重复的缓存。
- 相同服务端数据不要再复制到 Zustand。
- 乐观更新只有交互收益明确且回滚逻辑可控时使用。

## 查询参数与 URL

搜索、筛选、分页如果需要刷新后保留或可分享，优先放 URL：

```ts
const [searchParams, setSearchParams] = useSearchParams()
```

不要同时维护：

```text
URL page
+
useState page
+
Zustand page
```

选择一个真实来源。

输入框的“草稿值”和“已提交查询值”可以分开：输入过程放局部 state，实际查询条件从 URL 获取。

## Zustand

适合 Zustand：

- 登录用户的客户端会话状态
- 全局 UI 偏好
- 侧边栏状态
- 跨多个无父子关系页面共享的客户端状态

不适合 Zustand：

- 用户列表
- 详情接口结果
- 服务端分页数据
- Query loading/error 状态

## 请求错误

- 通用鉴权、401、基础错误格式放请求层。
- 页面只处理当前业务需要的反馈。
- 不在每个 API Hook 复制同一套 toast/error 转换。
- 不静默吞异常。

## 并行与瀑布

彼此独立的请求不要串行 await：

```ts
const [roles, permissions] = await Promise.all([
  getRoles(),
  getPermissions(),
])
```

有依赖关系的请求才顺序执行。

## 完成检查

- 服务端数据是否错误放进 Zustand？
- 页面是否直接调用 Axios？
- Query Key 是否稳定、可预测？
- Mutation 是否正确失效缓存？
- 搜索/筛选/分页是否存在多份状态？
- 是否用 `useEffect` 手工实现了 Query 已经提供的能力？
