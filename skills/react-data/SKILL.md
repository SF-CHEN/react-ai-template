---
name: react-data
description: 当前模板的数据访问和状态管理规范。编写 API、标准 CRUD、TanStack Query、Mutation、Zustand、URL 搜索状态、OpenAPI 生成代码或 options 时使用。
---

# React 数据与状态 Skill

## 状态先归属

| 状态 | 使用方式 |
|---|---|
| 后端返回的数据 | TanStack Query |
| 全局客户端状态 | Zustand |
| 当前组件 UI 状态 | React state |
| 表单字段 | React Hook Form |
| 可分享、刷新后保留的搜索/筛选/分页 | URL Search Params |

同一份状态不要同时维护多个真实来源。

## API 层

所有后端请求统一放 `src/api`：

```text
src/api/
├── request.ts
├── user.ts
└── generated/        OpenAPI 自动生成代码
```

规则：

- 页面和 UI 组件不直接调用 Axios。
- `request.ts` 负责 Axios 实例、鉴权头和基础请求能力。
- 业务 API 与生成 API 优先使用 `requestData<T>()` 直接获得响应体。
- 手写 API 的直接相关请求/响应类型可以和函数放在同一文件，不为了类型再建一层目录。
- 标准 CRUD API 在同一文件导出一个 `service` 对象，页面不需要分别 import `list/create/update/remove`。
- 统一错误、401、基础错误格式放请求基础设施；页面只处理当前业务流程需要的反馈。

标准 CRUD service 推荐：

```ts
export const userService = {
  name: 'users',
  list: getUserList,
  create: createUser,
  update: updateUser,
  remove: deleteUser,
}
```

`name` 只是 `useCrud` 内部的缓存命名空间，普通业务页面不需要理解或维护 TanStack Query 的 `queryKey`。

## 标准 CRUD

普通列表管理页默认使用 `src/hooks/useCrud.ts`，不要每个页面重复包装 `useList / useCreate / useUpdate / useDelete`。

```ts
const crud = useCrud(userService, {
  page,
  pageSize: 10,
  keyword,
  status,
})
```

页面直接消费：

```ts
crud.data
crud.total
crud.create()
crud.edit(row)
crud.submit(values)
crud.remove(row)
crud.isLoading
crud.isFetching
```

`useCrud` 只负责标准重复流程：

- 列表 Query 与缓存 key；
- 新增、编辑、删除 Mutation；
- 成功后的列表缓存刷新；
- 新增/编辑弹窗状态；
- 当前编辑项；
- 提交与删除动作。

页面仍负责自己的筛选 UI、表格列、表单 UI、业务状态和特殊交互，不把整个页面塞进万能 CRUD 配置。

### 提交参数

表单字段与接口入参一致时：

```ts
await service.create(values)
await service.update(id, values)
```

**必须优先直接传整个 `values`，不要重新逐字段声明 payload。**

只有下面情况才转换：

- 字段名不同；
- 字符串需要转数字/日期；
- 需要删除纯前端字段；
- 后端 DTO 是嵌套结构；
- 存在明确的数据清洗规则。

转换时优先保留其余字段：

```ts
const payload = {
  ...values,
  departmentId: Number(values.departmentId),
}
```

不要把二三十个不变字段重新抄一遍。

## 复杂 Query / Mutation

以下场景不要硬塞进 `useCrud`，直接使用 TanStack Query：

- 多接口聚合；
- 无限滚动；
- 复杂依赖查询；
- 乐观更新；
- 实时刷新；
- 批量操作；
- 特殊缓存策略；
- 非标准增删改流程。

这时再在页面附近创建 `<name>.query.ts`：

```ts
const userKeys = {
  all: ['users'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}
```

不要默认拆成 `query/keys.ts + hooks/useXxx.ts + mutations/` 多层目录。

## Mutation 与缓存

- 标准 CRUD 的缓存刷新交给 `useCrud`。
- 自定义 Mutation 成功后只失效真正受影响的 Query。
- 不在 Mutation 后手动重新请求所有接口。
- 不自建和 TanStack Query 重复的缓存。
- 相同服务端数据不要复制到 Zustand。
- 乐观更新只有交互收益明确且回滚逻辑可控时使用。

## OpenAPI 自动生成

生成代码统一放：

```text
src/api/generated/
├── <module>.ts
├── types/
└── meta/
```

硬规则：

- `src/api/generated` 由脚本维护，不直接手改。
- 需要业务语义封装时，新建 `src/api/*.ts` 手写文件。
- options label 修正写 `script/option-label-overrides.cjs`，不要直接改生成的 `options.ts`。
- 纯前端固定 options 优先放页面自己的 `<page>.options.ts`。
- 生成文件的 L3 由生成器维护，并使用精简 `INPUT / OUTPUT / POS` 格式。

生成器参数、枚举解析和 label 覆盖细节统一查看 `script/README.md`，不要把生成器实现细节重复维护在 Skill 中。

## URL 查询状态

搜索、筛选、分页需要刷新保留或可分享时优先使用 URL Search Params。

输入框的“草稿值”和“已提交查询值”可以分开：草稿放局部 state，真正查询条件来自 URL。

不要同时维护：URL page + useState page + Zustand page。

## Zustand

适合：登录会话客户端状态、全局 UI 偏好、侧边栏状态、多个无父子关系页面共享的客户端状态。

不适合：用户列表、详情接口、服务端分页、Query loading/error 状态。

## 请求并行

互相独立的请求不要串行 await；有依赖关系才顺序执行。

## 完成检查

- 标准 CRUD 是否无意义重复写了四个 Query/Mutation Hook？
- 表单与接口字段一致时是否直接提交整个 values？
- 是否逐字段重复组装了本可直接透传的 payload？
- 服务端数据是否错误放进 Zustand？
- 页面是否直接调用 Axios？
- 特殊 Query Key 是否稳定？
- 自定义 Mutation 是否只失效需要的缓存？
- URL / state 是否存在多份真实来源？
- 是否用 `useEffect` 手写了 Query 已提供的能力？
- 是否直接修改了 generated API / type / enum / options？
