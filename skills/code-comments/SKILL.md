---
name: code-comments
description: 当前模板的 L3 文件头与代码注释规范。新增或修改源文件、复杂业务逻辑、状态联动、数据转换、兼容处理、性能取舍或容易误改的代码时使用。
---

# 代码注释与 L3 文件头 Skill

## 目标

让开发者打开一个文件时先通过 L3 头部理解它的输入、输出和定位，再通过正文中文注释理解关键业务流程、约束和 Why。

本项目**需要代码注释**，并要求手写源文件维护 L3 头部。

## L3 文件头

### 必须包含的文件

所有手写源文件默认需要 L3 头部，主要包括：

- `.ts`
- `.tsx`
- `.js`
- `.jsx`
- `.mjs`
- `.css`

HTML 使用等价的 HTML 注释格式；`<!doctype html>` 必须保持为第一行，L3 紧跟在 DOCTYPE 后面。

以下文件不强制人工维护 L3：

- JSON 等不支持注释的配置文件；
- 第三方生成后会被工具覆盖的声明文件；
- 纯工具生成、且生成器本身无法维护头部的文件。

当前项目明确豁免人工维护：

```text
src/auto-imports.d.ts
src/vite-env.d.ts
```

### OpenAPI 自动生成源码

`src/api/generated/**/*.ts` 虽然是自动生成文件，但属于开发者会直接阅读和调用的项目源码，因此**必须由 `script/generate-api.cjs` 自动生成 L3 头部**。

规则：

- 每次重新生成时自动刷新 `[TIME]`；
- `[INPUT] / [OUTPUT] / [POS]` 由生成器按 API、类型、枚举等文件职责填写；
- `[PROTOCOL]` 明确说明“自动生成文件，不直接手改”；
- 不要为了修改生成文件而人工维护 L3，应修改 OpenAPI 文档或生成器后重新生成；
- 手写业务封装继续放 `src/api/*.ts`，不要混入 `src/api/generated`。

### TypeScript / JavaScript / CSS 模板

将以下块放在源文件最顶部：

```ts
/**
 * [INPUT]: 依赖 {哪些模块/文件} 的 {什么功能}
 * [OUTPUT]: 对外提供 {函数/组件/类型/变量}
 * [POS]: {属于哪个模块} 的 {角色}，{与其他文件的关系}
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: {YYYY-MM-DD HH:mm:ss}
 */
```

### HTML 模板

保留 DOCTYPE 第一行，在其后追加：

```html
<!--
[INPUT]: 依赖 {哪些模块/文件} 的 {什么功能}
[OUTPUT]: 对外提供 {页面入口/挂载节点/资源声明}
[POS]: {属于哪个模块} 的 {角色}，{与其他文件的关系}
[PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
[TIME]: {YYYY-MM-DD HH:mm:ss}
-->
```

### 字段填写规则

#### INPUT

写真实依赖及其能力，不只列包名。

推荐：

```text
[INPUT]: 依赖 React Router 的路由容器、AppLayout 布局和页面级懒加载组件
```

不要：

```text
[INPUT]: React、组件、工具
```

#### OUTPUT

写这个文件真正对外提供什么，例如：

```text
[OUTPUT]: 对外提供 App 根路由组件
```

#### POS

说明文件在项目中的职责以及与相邻文件的关系，例如：

```text
[POS]: app 层的路由入口，连接 AppProviders、AppLayout 与各业务页面
```

#### PROTOCOL

当前项目不采用 CLAUDE.md 分层维护，因此手写源码统一使用：

```text
[PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
```

自动生成源码可以由生成器写入更准确的维护协议，例如：

```text
[PROTOCOL]: 自动生成文件；修改 OpenAPI 或 script 生成器后重新生成，不直接手改
```

#### TIME

- 格式固定为 `YYYY-MM-DD HH:mm:ss`。
- 新建文件时填写当前时间。
- 修改文件的职责、输入、输出或业务逻辑时同步刷新。
- 自动生成 API 在每次生成时自动刷新。
- 不单独维护 `@since`、作者、修改历史等重复时间信息。

## 修改文件时的 L3 检查顺序

1. 先阅读现有 L3，确认它是否仍描述真实实现。
2. 修改代码。
3. 重新核对 `[INPUT] / [OUTPUT] / [POS]`。
4. 如果内容或职责变化，更新对应字段。
5. 将 `[TIME]` 刷新为当前时间。
6. 对照 `AGENTS.md` 与当前任务相关 Skill 检查规则是否仍一致。

不要只改 `[TIME]` 却保留已经失效的 INPUT / OUTPUT / POS。

## 正文注释默认要求

以下场景应主动添加简体中文注释：

- 页面或函数中存在多步骤业务流程；
- 非直观的状态变化或状态联动；
- 特殊业务规则、边界条件、兜底逻辑；
- API 请求参数、响应数据或表单数据需要转换；
- TanStack Query 的缓存失效、预取、乐观更新等非直观行为；
- `useEffect`、`useRef`、缓存、延迟加载等存在明确使用原因；
- 浏览器兼容、第三方库限制或框架约束；
- 性能优化代码；
- 临时兼容方案、历史约束、容易被误删的代码；
- 正则表达式、复杂计算、复杂条件分支；
- 公共函数或公共组件存在不明显的使用约束。

简单 JSX、普通赋值、明显的事件处理不需要强行注释。

## 业务流程注释

当代码包含多个阶段时，用短注释标出关键阶段：

```ts
async function handleSubmit(values: UserFormData) {
  // 编辑时更新当前记录；新增时直接使用表单值创建记录
  if (editingUser) {
    await updateMutation.mutateAsync({ id: editingUser.id, input: values })
  } else {
    await createMutation.mutateAsync(values)
  }

  // 请求成功后统一清空编辑态，避免下次新增残留旧数据
  setDialogOpen(false)
  setEditingUser(null)
}
```

## Why 注释

对看起来“可以删掉或换一种写法”的代码解释原因：

```ts
useEffect(() => {
  if (!open) return

  // React Hook Form 只在首次初始化 defaultValues，切换编辑对象时需要主动 reset
  form.reset(getDefaultValues(user))
}, [form, open, user])
```

Why 注释优先级最高，但不是唯一允许的注释。关键业务流程本身不直观时，也应该说明“正在完成哪一阶段”。

## JSDoc 使用规则

不要求所有函数都写 JSDoc。跨页面公共函数、公共 Hook、重要公共组件、参数或返回行为不明显时可以使用。

不要机械添加作者、`@since`、修改历史等容易失效的信息；L3 的 `[TIME]` 是统一时间信息来源。

## 不要这样写

```ts
// 设置 loading 为 true
setLoading(true)

// 删除用户
deleteUser(id)
```

也不要为简单函数制造大段 JSDoc，或给每个变量、每一行代码逐字翻译。

## 完成前检查

- 手写源文件是否有 L3 头部；
- L3 是否与当前代码真实一致；
- `[TIME]` 是否是本次修改时间；
- OpenAPI 生成源码是否由生成器自动维护 L3；
- 复杂业务流程是否有必要的中文注释；
- 注释是否解释了业务流程、约束或 Why，而不是重复语法；
- 修改逻辑后附近旧注释是否仍准确。
