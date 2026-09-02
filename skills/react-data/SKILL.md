---
name: react-data
description: 当前模板的数据访问和状态管理规范。编写 API、TanStack Query、Mutation、Zustand、搜索筛选分页、Swagger 生成代码或缓存逻辑时使用。
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
├── report.ts
└── generated/        Swagger / OpenAPI 自动生成代码
```

页面不要直接调用 Axios。

手写 API 直接相关的请求和响应类型可以和接口函数放在同一个文件，避免为了类型再创建一层目录。

```ts
export interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
}

export async function getUserList(params: UserListParams) {
  return requestData<UserListResult>({
    url: '/users',
    method: 'GET',
    params,
  })
}
```

`request` 是原始 Axios 实例；业务 API 和生成 API 优先使用 `requestData<T>()`，直接获得响应体，避免页面和 Query 再处理 `AxiosResponse<T>`。

## Swagger / OpenAPI 自动生成

项目内置：

```text
script/
├── load-swagger.cjs
├── generate-api.cjs
├── sync-options.cjs
├── option-label-overrides.cjs
├── doc.cjs
└── init-project.ps1
```

生成命令：

```bash
pnpm api:generate
pnpm api:docs
pnpm api:all
```

Swagger 来源按优先级支持：

- 命令行 `--url` / `--file`；
- 环境文件中的 `SWAGGER_URL` / `SWAGGER_FILE`；
- 本地缓存 `script/api.json`。

生成结果统一放：

```text
src/api/generated/
├── <module>.ts
├── types/
│   └── <module>.ts
└── meta/
    ├── enums.ts
    ├── options.ts
    └── api.md
```

这里是**生成代码专用结构**：自动生成 API 与类型可以拆开，但不要把 `generated/types` 的组织方式机械应用到普通手写 API。

规则：

- `src/api/generated` 全部由脚本维护，不在生成文件内混入手写业务逻辑。
- `<module>.ts` 只放 API 请求函数；DTO、Query Params、Request/Response 类型统一放 `types/<module>.ts`。
- `enums.ts` 保持后端真实 enum value，不为了中文展示修改后端值。
- `options.ts` 的 label 优先级为：人工 override → Swagger 中文说明 → Swagger 英文说明 → enum 原值。
- Swagger `description` 支持明确的 `ENUM-中文说明` 配对，也支持数量与 enum 一致的中文顺序列表，例如“模型类型，分为内置模型和用户模型”。
- 如果自动生成的 options label 不准确，**不要直接修改 `src/api/generated/meta/options.ts`**。
- 人工或 AI 修正 label 时，统一修改 `script/option-label-overrides.cjs`；该文件不会被 `api:generate` / `api:all` 覆盖。
- `api:generate` 会先生成 API / types / enums，再通过 `sync-options.cjs` 生成最终 options。
- `api:all` 在 `api:generate` 的基础上继续生成 `meta/api.md`。
- 生成的 `.ts` 文件由生成器自动维护 L3 文件头和 `[TIME]`；不要手工维护生成文件 L3。
- `script/api.json` 是本地 Swagger 缓存，不提交真实接口文档到模板仓库。
- 页面和 Query 使用生成 API 时仍保持显式 import。

需要查看脚本细节时阅读 `script/README.md`。

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
- 生成代码是否只位于 `src/api/generated`？
- 是否直接修改了生成的 API、types、enums 或 options？
- options label 修正是否写入了 `script/option-label-overrides.cjs`？
