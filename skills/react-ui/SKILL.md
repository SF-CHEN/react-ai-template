---
name: react-ui
description: 当前模板的 UI 与交互规范。实现页面布局、shadcn/ui 组件、表单控件、弹窗、危险操作、加载/空状态、响应式和可访问性时使用。
---

# React UI Skill

## 目标

页面首先做到 **清晰、稳定、统一、易维护**，再考虑视觉亮点。不要为了“高级感”堆叠无业务意义的渐变、玻璃、阴影和动画。

## shadcn/ui 优先

`src/components/ui/**` 是基础 UI 源码区。

- shadcn/ui 已提供同类组件时优先直接使用或按官方源码同步。
- 不重复维护第二套 Button、Dialog、Select、Dropdown、AlertDialog 等基础组件。
- `components/ui` 不要求 L3，尽量保持接近 shadcn 官方结构，方便以后同步。
- shadcn 源码允许显式 `lucide-react` import；业务代码继续使用现有 `IconLucideXxx` 自动导入。
- 需要原生 `<select>` 时使用明确命名的 NativeSelect；`Select` 名称保留给 shadcn 的弹出式 Select。

## 页面基本结构

中后台页面默认顺序：

```text
PageHeader
→ 筛选 / 操作区
→ 主内容（Table / Card / Chart）
→ 分页 / 补充信息
→ Dialog / Drawer
```

间距保持稳定：页面大区块通常 `space-y-6`，卡片内部常用 `p-5` / `gap-4`，不要每个页面发明不同尺度。

## 操作层级

- 页面主操作：primary Button，例如“新增”“保存”。
- 次要操作：secondary / outline / ghost。
- 删除、清空等不可逆操作：destructive，并要求确认。
- 同一区域不要出现多个视觉权重相同的主按钮。

危险操作优先使用 `AlertDialog`，不要使用 `window.confirm` 作为正式模板示例。

## Select

业务选择控件使用 shadcn/Base UI Select：

```tsx
<Select items={options} value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="请选择" />
  </SelectTrigger>
  <SelectContent>
    {options.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

React Hook Form 中使用 `Controller` 对接非原生 Select，不使用 `register()` 假装它是原生控件。

## 表单

- Label、控件、错误信息形成稳定的垂直层级。
- 必填、错误、disabled、loading 状态应可辨识。
- Dialog 表单提交中禁用取消/保存或避免重复提交。
- 表单字段多时按业务分组，不通过随意缩小字号和间距硬塞。

## Table

- 表头文案简短明确。
- 操作列通常右对齐。
- 状态使用 Badge，而不是只靠颜色文本。
- 无数据、加载中、请求失败要有明确反馈。
- 列很多时优先处理信息优先级和横向滚动，不盲目压缩每列。

## Loading / Empty / Error

不要只处理成功态：

- 首次加载：Loading / Skeleton；
- 空数据：说明当前没有内容，并在合适时提供下一步操作；
- 请求失败：给出用户可理解的信息和重试入口；
- 局部刷新：尽量保留已有内容，避免整页闪烁。

## 响应式

- 默认先保证桌面中后台体验，再为窄屏提供可用退化。
- 筛选区在窄屏纵向堆叠，宽屏再横向排列。
- 固定宽度只用于明确控件，不把整页布局写死成像素值。
- 大表格允许横向滚动。

## 可访问性

- 图标按钮必须提供 `aria-label`。
- 表单 Label 与控件建立关联。
- Dialog / AlertDialog 使用语义化 Title / Description。
- 不只用颜色表达状态。
- 键盘 focus 样式不要移除。

## 动效

只在能表达状态变化时添加轻量动画，例如侧边栏折叠、Dialog 出入场、hover/focus 反馈。不要为了“酷”增加影响操作效率的长动画。

## 完成检查

- 是否优先使用现有 shadcn/ui？
- 是否存在同职责的自定义基础组件？
- 主次操作层级是否清晰？
- 危险操作是否使用统一确认弹窗？
- Loading / Empty / Error 是否考虑？
- 窄屏是否仍可操作？
- 图标按钮和表单是否满足基本 a11y？
