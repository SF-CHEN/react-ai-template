---
name: react-ui
description: 当前模板的 UI 与交互规范。实现页面布局、shadcn/ui 组件、表单控件、弹窗、危险操作、加载/空状态、响应式和可访问性时使用。
---

# React UI Skill

## 目标

页面首先做到 **清晰、稳定、统一、易维护**，再考虑视觉亮点。不要为了“高级感”堆叠无业务意义的渐变、玻璃、阴影和动画。

默认视觉关键词：**干净、克制、层级明确、留白充分、操作密度适中**。

## shadcn/ui 优先

`src/components/ui/**` 是基础 UI 源码区。

- shadcn/ui 已提供同类组件时优先直接使用或按官方源码同步。
- 不重复维护第二套 Button、Dialog、Select、Dropdown、AlertDialog、Pagination、Skeleton、Empty、Avatar 等基础组件。
- `components/ui` 不要求 L3，尽量保持接近 shadcn 官方结构，方便以后同步。
- shadcn 源码允许显式 `lucide-react` import；业务代码继续使用现有 `IconLucideXxx` 自动导入。
- 需要原生 `<select>` 时使用明确命名的 NativeSelect；`Select` 名称保留给 shadcn 的弹出式 Select。
- 多个页面重复出现的 Table 渲染壳、分页组合可以提升到 `components/common`；公共组合组件继续建立在 shadcn/ui 上，不重新实现基础视觉组件。

## 页面视觉基线

### 页面容器

- 主内容默认限制最大宽度，后台模板参考 `max-w-[1600px]`，超宽屏不要让内容无限拉伸。
- 页面外层默认 `space-y-6`，信息密度较低的大页面可使用 `lg:space-y-8`。
- 页面左右留白按视口渐进增加，例如 `p-4 sm:p-6 lg:p-8`。
- 页面背景与 Card 必须有轻微层级差，不要让整个页面像一张纯白纸。

### 色彩

- 一个页面只保留一个主要品牌色，状态色只用于成功、警告、失败等语义。
- 不给每张指标卡随机分配一种颜色制造“彩虹 Dashboard”。
- muted / border / background 用于建立层级，primary 用于强调主操作和选中状态。

### 圆角和阴影

- Card、弹窗、筛选容器保持一致圆角体系。
- 阴影只表达悬浮层级，不要所有容器都使用大阴影。
- 常规 Card 以边框 + 轻阴影为主；嵌套区域优先使用 muted 背景或分隔线。

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

## PageHeader

- 标题只表达当前页面是什么，不在标题中堆业务说明。
- description 用 1 句解释页面目的、数据范围或操作规则，避免写成教程长文。
- 主操作放右侧，例如“新增用户”“创建任务”。
- Header 下方不要立即再重复一遍同样标题。

## Dashboard

Dashboard 不要只生成一排 KPI Card + 一张全宽折线图。

推荐组合：

```text
PageHeader
→ 3~4 个核心指标
→ 主图表 + 辅助信息 / 状态 / 排名
→ 可选的补充说明或最近动态
```

规则：

- KPI 卡只放关键数字、趋势和必要说明，不塞长段文字。
- 主图表占主要视觉面积，右侧可以放状态、能力概览、排名或最近活动。
- 图表颜色、坐标轴、网格线要弱化，让数据本身成为视觉重点。
- Demo 数据可以存在，但文案必须让开发者知道它是示例而非真实业务指标。

## 列表页

标准列表页优先把“筛选、表格、分页”组织进一个明确容器，而不是三个区域散落页面。

推荐结构：

```text
Card
├─ CardHeader：列表标题 + 结果数量 / 局部刷新状态
├─ 筛选区：keyword / Select / 查询 / 重置
├─ DataTable
└─ DataPagination
```

- 标准列表优先复用 `components/common/DataTable.tsx`，业务页面只定义 columns、业务 cell 和行操作。
- 标准服务端分页优先复用 `components/common/DataPagination.tsx`，分页状态继续由 `useCrud` 管理。
- `DataTable` 负责通用表头/行渲染、Skeleton、Error、Empty；不要在每个业务表格重复 `getHeaderGroups / getRowModel / FlexRender`。
- 实体头像使用 shadcn `Avatar / AvatarFallback`，不要重复手写圆形头像容器。
- 首次加载使用 shadcn `Skeleton`；空状态使用 shadcn `Empty`；分页使用 shadcn `Pagination`。
- 业务列、特殊操作和特殊空状态仍留在页面附近，不把 `DataTable` 做成巨大万能配置器。
- 筛选区与表格之间用背景层级或分隔线区分。
- 搜索框较重要时可以使用前置搜索图标，但不要给所有输入框加装饰图标。
- 当前存在筛选条件时提供“重置”，没有筛选时不要长期占一个无意义按钮。
- 结果数量、刷新中等信息使用次要视觉层级，不与主操作竞争。

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

- 表头文案简短明确，表头视觉权重低于数据正文。
- 操作列通常右对齐。
- 用户/实体主字段可使用“主标题 + 次要标识”组合，例如姓名 + username。
- 状态使用 Badge，而不是只靠颜色文本。
- 时间、邮箱等次要信息可以使用 muted foreground，降低视觉噪音。
- 无数据、加载中、请求失败要有明确反馈。
- 首次加载优先显示与表格结构接近的 Skeleton 行，而不是整块文字“加载中”。
- 空状态需要说明“当前为什么没有数据 / 下一步做什么”，不要只写“暂无数据”。
- 列很多时优先处理信息优先级和横向滚动，不盲目压缩每列。

## Loading / Empty / Error

不要只处理成功态：

- 首次加载：优先使用 shadcn `Skeleton`；
- 空数据：优先使用 shadcn `Empty`，说明当前没有内容，并在合适时提供下一步操作；
- 请求失败：给出用户可理解的信息和重试入口；
- 局部刷新：尽量保留已有内容，只显示轻量“刷新中”，避免整页闪烁。

## 响应式

- 默认先保证桌面中后台体验，再为窄屏提供可用退化。
- 左侧 Sidebar 在窄屏隐藏时，必须保留可访问的移动端导航方式，不能让用户失去页面切换入口。
- 筛选区在窄屏纵向堆叠，宽屏再横向排列。
- 固定宽度只用于明确控件，不把整页布局写死成像素值。
- 大表格允许横向滚动。

## 可访问性

- 图标按钮必须提供 `aria-label`。
- 搜索框等没有可见 Label 的控件需要 `aria-label`。
- 表单 Label 与控件建立关联。
- Dialog / AlertDialog 使用语义化 Title / Description。
- 不只用颜色表达状态。
- 键盘 focus 样式不要移除。

## 动效

只在能表达状态变化时添加轻量动画，例如侧边栏折叠、Dialog 出入场、hover/focus 反馈。不要为了“酷”增加影响操作效率的长动画。

## AI 生成页面时的默认决策

当需求没有明确视觉稿时：

1. 先识别页面类型：Dashboard / List / Detail / Form / Settings。
2. 优先复用当前项目已有页面结构，而不是重新发明布局。
3. 使用现有 Card、Select、Dialog、AlertDialog、PageHeader；列表页优先复用 DataTable / DataPagination。
4. Loading / Empty / Avatar / Pagination 优先使用现有 shadcn/ui 组件，不手写同职责基础结构。
5. 保持一个主操作，其余降级为 secondary / outline / ghost。
6. 补齐 Loading / Empty / Error，再考虑装饰性优化。
7. 页面完成后检查窄屏是否还能导航和操作。

## 完成检查

- 是否优先使用现有 shadcn/ui？
- 标准列表是否复用了 DataTable / DataPagination，而不是重复渲染框架？
- Skeleton / Empty / Avatar / Pagination 是否优先使用现有组件？
- 页面是否有明确的标题、内容层级和主操作？
- 页面宽度、留白、Card 密度是否与模板现有页面一致？
- 是否存在同职责的自定义基础组件？
- 主次操作层级是否清晰？
- 危险操作是否使用统一确认弹窗？
- Loading / Empty / Error 是否考虑？
- 窄屏是否仍可导航、筛选和操作？
- 图标按钮和表单是否满足基本 a11y？
