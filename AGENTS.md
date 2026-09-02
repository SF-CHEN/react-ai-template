# React AI Template - AI / Agent 开发规范

本仓库用于 **AI 辅助开发 + 人工长期维护**。默认优先级：

> **清晰 > 易找 > 可维护 > 一致 > 简洁 > 炫技式抽象**

`AGENTS.md` 只维护全项目硬约束；具体实现方法按任务读取对应 Skill；背景说明和长篇文档放在 `docs/`。

## 1. AI 工作原则

- 编码前先阅读目标文件附近的真实代码、类型、接口和现有实现。
- 只有会明显改变实现方向的歧义才向用户提问；可以从现有代码推断的小问题直接处理。
- 优先使用满足当前需求的最简单实现，不为未知未来提前设计扩展点。
- 只修改完成当前任务真正需要修改的部分，不顺手重构无关代码。
- 新增依赖前先确认现有技术栈是否已经能解决。
- 默认继续当前分支，**不要自行创建分支或 PR**，除非用户明确要求。

## 2. 技术栈

- React + TypeScript + Vite
- shadcn/ui 源码组件 + Base UI
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- TanStack Table
- Axios
- ECharts
- Day.js
- unplugin-auto-import
- unplugin-icons + Lucide Iconify 图标集
- lucide-react（shadcn/ui 源码兼容）
- ESLint + Prettier
- Vitest

没有明确需求时，不引入职责重复的第二套 UI、状态、请求或表单方案。

## 3. Skill 路由

| 场景 | Skill |
|---|---|
| 页面、组件、路由、表单、TypeScript、目录调整 | `skills/react-app/SKILL.md` |
| API、标准 CRUD、TanStack Query、Zustand、URL 状态、OpenAPI | `skills/react-data/SKILL.md` |
| 页面视觉、shadcn/ui、交互状态、响应式、可访问性 | `skills/react-ui/SKILL.md` |
| 网络瀑布、重渲染、大列表、Bundle、昂贵计算 | `skills/react-performance/SKILL.md` |

## 4. 目录原则

项目采用 **页面优先 + 渐进式分层**：

```text
src/
├── api/              后端接口、请求模型、HTTP 基础设施
├── app/              Provider、路由配置和应用级基础设施
├── pages/            路由页面和页面私有代码
├── components/
│   ├── ui/           shadcn/ui 基础组件源码
│   ├── common/       跨页面通用组件
│   └── charts/       图表基础封装
├── layouts/          页面布局
├── hooks/            真正跨页面通用 Hook
├── store/            全局客户端状态
├── styles/           全局样式
├── types/            真正跨业务公共类型
└── utils/            通用纯函数
```

规则：

- 不使用 `modules/` 作为默认业务根目录。
- 所有后端 API 统一放 `src/api/`。
- 简单页面保持扁平，不预先创建 `components/hooks/query/types/schema` 多层目录。
- 页面私有代码优先就近放；真实跨页面复用后再提升到公共目录。
- 不为了“架构完整”创建只有一个文件的目录。
- 路由页面与侧边导航元数据统一从 `src/app/routes.tsx` 获取。

## 5. React、TypeScript 与表单

- 页面入口负责布局、查询条件、业务流程和组件组合，不把大型表格列、复杂表单和重型图表全部堆进去。
- 派生值直接计算，不使用 `useEffect + useState` 保存第二份状态。
- 用户交互逻辑优先放事件处理函数。
- 不机械添加 `memo`、`useMemo`、`useCallback`、`useRef`。
- 不在组件内部定义 React 组件。
- 动态列表有稳定 ID 时不得使用数组索引作为 key。
- 不直接修改 props 或 state。
- TypeScript 不使用 `IUser` 这类 `I` 前缀，不机械添加 `Type` / `Interface` 后缀。
- 禁止用 `any` 绕过类型问题；不确定外部数据先用 `unknown` 再收窄。
- API 直接相关类型和接口放在一起；页面私有类型就近放置；真正跨业务类型才进入 `src/types`。
- 表单字段与 API 入参一致时，直接复用 API Input 类型；不要再声明一份同结构 `FormData`。
- Zod Schema 可用 `satisfies z.ZodType<ApiInput>` 保证与接口类型一致；只有表单模型独立于接口 DTO 时才单独 `z.infer`。
- **表单字段与接口字段一致时必须直接提交整个 `values`，禁止逐字段重新组装 payload。**
- 只有字段改名、类型转换、过滤、数据清洗或 DTO 结构不一致时才转换；转换优先使用 `{ ...values, changedField: ... }`。
- 优先使用字面量联合、`as const`、`satisfies`，无明确运行时需求不滥用 `enum`。

详细实现规则见 `skills/react-app/SKILL.md`。

## 6. API、CRUD 与状态归属

同一份状态只保留一个真实来源：

- 服务端状态：TanStack Query
- 全局客户端状态：Zustand
- 局部 UI 状态：React state
- 表单状态：React Hook Form
- 需要分享或刷新后保留的搜索/筛选/分页：URL Search Params

硬约束：

- Axios 只在 `src/api` 使用，页面和 UI 组件不直接调用 Axios。
- `src/api/request.ts` 负责 Axios 实例和基础请求能力。
- 标准 CRUD 默认在 `src/api/<name>.ts` 导出一个 `service`，并在页面使用 `useCrud(service, params)`。
- 标准 CRUD 的 Query Key、列表 Query、新增/编辑/删除 Mutation、缓存刷新和新增/编辑弹窗状态由 `useCrud` 统一处理。
- **不要为每个普通 CRUD 页面重复创建 `useList / useCreate / useUpdate / useDelete` 四套 Hook。**
- 只有复杂依赖查询、乐观更新、无限滚动、批量操作、特殊缓存策略或非标准流程时，才在页面附近创建 `<name>.query.ts` 并直接使用 TanStack Query。
- 不把 Query 数据复制进 Zustand。
- 不在 `useEffect` 中重新实现 TanStack Query 已提供的请求、缓存、去重和刷新能力。
- `src/api/generated` 由脚本维护，不直接手改生成文件。

详细规则见 `skills/react-data/SKILL.md`。

## 7. UI 与自动导入

基础 UI 优先使用 shadcn/ui 已有组件源码。已有 Button、Dialog、Select、AlertDialog 等能力时，不再维护职责重复的另一套组件。

当前自动导入保持不变。业务代码可直接使用：

- React 常用 API；
- `src/components/ui` 下的基础 UI；
- `src/hooks` 下的通用 Hook；
- Lucide 图标：`IconLucideXxx`。

以下内容保持显式 import：API、页面专用组件、特殊 Query、Store、Utils、业务类型、`components/common` 和其他第三方业务库。

`src/components/ui/**` 属于 shadcn/ui 源码区，允许保留官方 `lucide-react` 显式 import。

UI 细节见 `skills/react-ui/SKILL.md`。

## 8. L3 文件头与代码注释

L3 只用于职责不直观的复杂公共基础设施，例如：

- `src/api/request.ts` 等请求基础设施；
- app 层复杂 Router / Provider；
- ECharts 等命令式第三方库封装；
- 复杂跨业务公共工具或生成器。

格式固定为：

```ts
/**
 * [INPUT]: 依赖什么能力
 * [OUTPUT]: 对外提供什么
 * [POS]: 在项目中的职责和关系
 */
```

普通页面、页面私有组件、简单 Hook/Utils、`*.query.ts`、`*.schema.ts`、`*.options.ts`、`src/components/ui/**` 和自动生成声明文件默认不加 L3。

正文注释使用简体中文，优先解释多步骤业务流程、状态联动、特殊规则、数据转换、第三方限制、性能取舍和 Why。不要给简单赋值、明显 JSX 和每一行代码写翻译式注释。

## 9. Git 与自动化校验

- Git commit message 默认使用简体中文，简短描述真实修改目的。
- 一个提交尽量对应一个逻辑修改。
- 不提交密钥、凭证和真实敏感环境变量。
- 不修改 Git 全局配置，不使用 force push / hard reset 等破坏性操作，除非用户明确要求。
- 项目暂不使用 Husky 和 lint-staged。

默认情况下，AI **禁止主动执行**：

```text
pnpm typecheck
pnpm lint / lint:fix
pnpm test / test:run
pnpm build
pnpm check:deadcode
以及对应的 npm / npx 变体
```

只有用户明确要求类型检查、Lint、测试、构建、死代码检查或完整校验时才执行。未执行时，最终回复明确说明。

## 10. 禁止模式

不要生成：

- 用 `any` 或大量类型断言掩盖问题；
- 页面直接调用 Axios；
- 服务端列表无理由放进 Zustand；
- 标准 CRUD 页面重复包装四套 Query/Mutation Hook；
- 表单与接口字段一致却逐字段重新组装提交参数；
- 可派生状态使用 `useEffect + useState`；
- 无意义 memo / useMemo / useCallback；
- 一个简单页面拆出七八层目录；
- 重复定义后端 DTO、表单类型或领域模型；
- 复杂转换直接塞进 JSX；
- 基础 UI 已存在仍重复手写另一套；
- 删除等危险操作直接使用 `window.confirm`，优先使用统一 AlertDialog；
- 简单文件机械添加 L3；
- 复杂业务逻辑完全没有必要注释；
- 未经用户明确要求主动运行自动化校验或创建新分支。
