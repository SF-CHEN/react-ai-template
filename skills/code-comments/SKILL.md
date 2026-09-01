---
name: code-comments
description: 当前模板的代码注释规范。新增或重构业务逻辑、复杂状态、数据转换、兼容处理、性能取舍、请求流程或容易误改的代码时使用。
---

# 代码注释 Skill

## 目标

生成对开发者真正有帮助的中文注释，让人能够快速理解业务意图、设计原因和关键流程，而不是把代码翻译成中文。

本项目**需要代码注释**。AI 生成或修改代码时，应主动判断哪些位置需要补充说明。

## 默认要求

以下场景应主动添加中文注释：

- 页面或函数中存在多步骤业务流程
- 非直观的状态变化或状态联动
- 特殊业务规则、边界条件、兜底逻辑
- API 请求参数、响应数据或表单数据需要转换
- TanStack Query 的缓存失效、预取、乐观更新等非直观行为
- `useEffect`、`useRef`、缓存、延迟加载等存在明确使用原因
- 浏览器兼容、第三方库限制或框架约束
- 性能优化代码
- 临时兼容方案、历史约束、容易被误删的代码
- 正则表达式、复杂计算、复杂条件分支
- 公共函数或公共组件存在不明显的使用约束

简单 JSX、普通赋值、明显的事件处理不要求强行注释。

## 注释层级

### 1. 业务流程注释

当一段代码包含多个阶段时，用短注释标出关键阶段，帮助快速阅读。

```ts
async function handleSubmit(values: UserFormData) {
  // 编辑时只更新当前记录；新增时直接使用表单值创建记录
  if (editingUser) {
    await updateMutation.mutateAsync({ id: editingUser.id, input: values })
  } else {
    await createMutation.mutateAsync(values)
  }

  // 请求成功后统一关闭弹窗并清空编辑态，避免下次新增残留旧数据
  setDialogOpen(false)
  setEditingUser(null)
}
```

### 2. Why 注释

对看起来“可以删掉或换一种写法”的代码，解释为什么这样做。

```ts
useEffect(() => {
  if (!open) return

  // React Hook Form 只在首次初始化 defaultValues，切换编辑对象时需要主动 reset
  form.reset(getDefaultValues(user))
}, [form, open, user])
```

### 3. 业务规则注释

```ts
// 后端约定空字符串表示“不筛选”，因此提交前不转换为 null
const status = form.status || ''
```

### 4. 数据转换注释

```ts
// 表格使用毫秒时间戳，接口返回秒级时间戳，这里统一转换后再进入页面状态
const createdAt = response.createdAt * 1000
```

### 5. 性能与兼容注释

```ts
// 图表实例创建成本较高，只在容器首次挂载时初始化，后续仅更新 option
const chartRef = useRef<ECharts | null>(null)
```

## JSDoc 使用规则

不要求所有函数都写 JSDoc。

以下情况可以使用 JSDoc：

- 跨页面复用的公共函数
- 参数语义不明显的工具函数
- 公共 Hook
- 公共组件存在重要约束
- 返回值或异常行为不直观

例如：

```ts
/**
 * 将分页参数转换为后端接口格式。
 * page 从 1 开始，接口 offset 从 0 开始。
 */
export function toPageRequest(page: number, pageSize: number) {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }
}
```

不要机械添加 `@since`、作者、修改时间等容易失效的信息。

## 不要这样写

### 重复代码表面含义

```ts
// 设置 loading 为 true
setLoading(true)

// 删除用户
deleteUser(id)
```

### 每一行都解释

```ts
// 获取用户名
const username = user.username
// 获取邮箱
const email = user.email
```

### 为简单函数制造大段文档

```ts
/**
 * 打开弹窗
 * @returns void
 */
function handleOpen() {
  setOpen(true)
}
```

## 注释密度

不要按固定比例添加注释。

一个普通页面通常应在**关键业务流程、复杂逻辑和特殊约束**处看到若干中文注释；如果一个包含大量业务逻辑的文件完全没有注释，应主动检查是否遗漏说明。

目标是：开发者第一次阅读代码时，不需要反复推断“为什么这样写”。

## 修改代码时

- 修改逻辑后同步检查附近注释是否仍然准确。
- 删除已经失效的注释。
- 不保留与当前实现矛盾的历史说明。
- 如果修复 Bug 的原因不明显，应在关键位置留下简短说明，避免以后再次引入同类问题。
