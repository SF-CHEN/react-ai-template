# React AI Template - AI / Agent 开发规范

本仓库用于 **AI 辅助开发 + 人工长期维护**。默认优先级：

> **清晰 > 易找 > 可维护 > 一致 > 简洁 > 炫技式抽象**

如果规范与现有实现冲突，先阅读目标文件附近的真实代码，说明冲突，再做最小范围调整。

## 1. AI 工作原则

### 1.1 编码前先理解问题

**不要默默假设，不要隐藏不确定性，先确认真正需要解决的问题。**

开始实现前：

- 先阅读相关现有代码、类型、接口和附近实现，理解当前约束。
- 如果存在会明显影响实现方向的假设，应明确说明。
- 如果需求存在两种或以上合理解读，应指出主要差异，不要默默选择更复杂的方案。
- 如果存在明显更简单的实现，应优先指出并采用简单方案。
- 如果现有方案明显过度设计，可以提出反对意见并说明原因。
- 只有当关键不确定性会直接影响实现方向时才向用户提问。
- 小型实现细节、命名选择或可以从现有代码推断的问题，不要频繁提问。

目标不是“先写代码再解释”，而是先确认自己理解了真正的问题。

### 1.2 简洁优先

**使用满足当前需求的最简单实现，不为未知的未来提前设计。**

- 不添加用户没有要求的功能。
- 不为一次性代码创建抽象。
- 不提前设计没有明确需求的扩展点。
- 不添加未要求的配置项、参数、Hook、工具类或公共组件。
- 不为缺乏现实依据的假设场景增加大量防御代码。
- 正常可能发生的接口失败、空数据、权限失败、用户输入错误仍应正确处理。
- 能直接表达的逻辑不要套额外设计模式。
- 能在当前页面解决的问题，不要过早提升为全局能力。
- 删除一层抽象后更容易理解时，优先删除抽象。

完成实现后主动检查：

> 一个熟悉 React 的资深工程师看到这份代码，会不会觉得它明显比需求本身复杂？

如果答案是“会”，优先简化。

### 1.3 最小修改原则

- 只修改完成当前任务真正需要修改的部分。
- 不顺手重构无关代码。
- 不因为个人偏好重新格式化整个文件。
- 不修改与当前任务无关的命名和目录。
- 优先沿用目标文件附近已有的实现方式。
- 新增依赖前先确认现有技术栈是否已经可以解决问题。
- 修改公共能力前先确认是否真的需要影响整个项目。

## 2. AI 自动化校验规则

默认情况下，AI **禁止主动执行**以下命令及其等价变体：

```bash
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm test
pnpm test:run
pnpm build
npm run build
npm run lint
npm test
npx tsc
npx eslint
vitest
vite build
```

只有用户明确要求进行类型检查、Lint、测试、构建、完整项目校验或 CI 排查时才允许执行。

AI 可以主动进行：

- 阅读和静态分析代码；
- 检查 import、引用关系和明显语法问题；
- 查看 Git diff / status；
- 检查目录、类型、状态归属和代码一致性；
- 对照现有实现进行静态影响分析。

如果用户没有明确要求自动化校验，修改完成后的最终回复必须明确说明：

> 未执行 `typecheck / lint / test / build` 等自动化校验。

不要为了“证明代码正确”自行启动构建或测试。

## 3. 技术栈

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
- unplugin-icons + Lucide Iconify 图标集（业务代码自动导入）
- lucide-react（shadcn/ui 源码兼容）
- ESLint + Prettier
- Vitest

`@iconify-json/lucide` 与 `lucide-react` 职责不同：前者服务业务代码的 `IconLucideXxx` 自动导入，后者只为 shadcn/ui 官方源码保持兼容，不视为重复 UI 技术栈。

没有明确需求时，不引入职责重复的第二套库。

## 4. Skill 使用规则

遇到对应任务时按需阅读相关 Skill，不要把所有 Skill 机械套到每个文件。

| 场景 | Skill |
|---|---|
| 新增页面、组件、表单、路由、目录调整 | `skills/react-project/SKILL.md` |
| API、TanStack Query、Zustand、URL 状态 | `skills/react-data/SKILL.md` |
| TypeScript 类型设计、DTO、Zod 推导、泛型 | `skills/typescript/SKILL.md` |
| L3 文件头、业务逻辑、复杂流程、关键代码注释 | `skills/code-comments/SKILL.md` |
| 性能分析、网络瀑布、重渲染、Bundle | `skills/react-performance/SKILL.md` |

`AGENTS.md` 是长期强制约定，Skill 是专项指导。

## 5. 目录原则

项目采用 **页面优先 + 渐进式分层**。

```text
src/
├── api/              后端接口、请求模型、HTTP 基础设施
├── app/              应用入口、Provider、路由组织
├── pages/            路由页面和页面私有代码
├── components/
│   ├── ui/           基础 UI 组件
│   └── common/       跨页面通用组件
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
- 简单页面默认扁平，不预先创建 `components/hooks/query/types/schema` 多层目录。
- 页面文件明显增多或出现清晰职责边界后，再增加子目录。
- 页面私有代码优先就近放置；真正跨页面复用后再提升到公共目录。
- 不为了“架构完整”创建只有一个文件的目录。

## 6. React 与组件规则

- `pages/<name>/index.tsx` 负责页面布局、业务流程和组件组合。
- 页面专用组件优先放当前页面目录。
- 基础 UI 优先使用 shadcn/ui 已有组件源码；shadcn/ui 已提供同类组件时，不重复手写另一套 Button、Dialog、Select、Dropdown 等基础组件。
- `src/components/ui/**` 视为 shadcn/ui 基础组件源码区；通过 shadcn CLI 新增或同步组件时，优先保留官方组件结构和依赖写法。
- 组件只承担一个主要职责，但不按固定行数机械拆分。
- Render 阶段保持纯净，不直接修改 props 或 state。
- Hook 只能在顶层调用。
- 可以直接计算出的派生值，不使用 `useEffect + useState` 保存第二份。
- 用户交互引起的逻辑优先放事件处理函数。
- 不机械添加 `memo`、`useMemo`、`useCallback`、`useRef`。
- 新状态依赖旧状态时使用函数式 setState。
- 不在组件内部定义 React 组件。
- 只有较重页面、明显功能边界或首屏 Bundle 确实受益时才使用懒加载。
- JSX 中避免复杂数据转换、深层嵌套三元表达式和难读的条件逻辑。

## 7. 自动导入规则

允许自动导入：

- React 常用 API，例如 `useState`、`useEffect`、`useMemo`；
- `src/components/ui` 下基础 UI 组件；
- `src/hooks` 下跨页面通用 Hook；
- 业务代码中的 Lucide 图标，统一写成 `IconLucideXxx`。

例如业务页面：

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增
</Button>
```

业务代码不要生成：

```tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
```

**shadcn/ui 组件源码例外：** `src/components/ui/**` 中由 shadcn CLI 生成、同步或按官方源码维护的组件，允许保留 `lucide-react` 显式 import，例如：

```tsx
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
```

不要为了统一业务侧自动导入写法，把 shadcn/ui 源码中的 `lucide-react` 强制改成 `IconLucideXxx`；这样可以保持 shadcn CLI 后续新增和更新组件时的兼容性。

以下内容保持显式 import：

- `src/api` 中的接口函数和业务类型；
- 页面专用组件；
- 页面业务 Query / Hook；
- `src/store`；
- `src/utils`；
- `components/common`；
- 业务类型；
- 其他第三方业务库。

不要把整个 `src` 加入自动扫描范围。

## 8. TypeScript 规则

- 不使用 `IUser`、`IRequestConfig` 这类 `I` 前缀。
- 不机械添加 `Type`、`Interface` 后缀。
- 对象结构优先使用清晰的 `interface`；联合、工具、映射类型使用 `type`。
- 禁止用 `any` 绕过类型检查；不确定外部数据先用 `unknown` 再收窄。
- 表单类型优先从 Zod Schema 使用 `z.infer` 推导。
- API 直接相关请求/响应类型优先和对应 `src/api/<name>.ts` 放在一起。
- 页面私有类型优先放页面附近；真正跨业务共享的类型才进入 `src/types`。
- 不重复定义已经存在的后端 DTO、表单类型或领域模型。
- 优先使用字面量联合、`as const`、`satisfies`；无明确需求时不滥用 `enum`。
- 泛型只有在带来真实复用和类型推导价值时使用。

详细规则见 `skills/typescript/SKILL.md`。

## 9. API 与状态归属

同一份状态只保留一个真实来源：

- 服务端状态：TanStack Query；
- 全局客户端状态：Zustand；
- 局部 UI 状态：React state；
- 表单状态：React Hook Form；
- 需要分享、刷新后保留的搜索/筛选/分页：URL Search Params。

API 规则：

- Axios 只在 `src/api` 层使用，页面和 UI 组件不直接调用 Axios。
- `api/request.ts` 负责 Axios 实例、拦截器和基础请求能力。
- TanStack Query Hook 放在使用它的页面附近，例如 `pages/user/user.query.ts`。
- 简单场景把 Query Key、Query、Mutation 放在一个 `<name>.query.ts`，不拆成多个目录。
- 不把 Query 数据复制进 Zustand。
- 不在 `useEffect` 中重新实现请求缓存、去重和刷新逻辑。

详细规则见 `skills/react-data/SKILL.md`。

## 10. 表单规则

- 复杂表单使用 React Hook Form + Zod。
- Schema 与页面放在一起，例如 `pages/user/user.schema.ts`。
- 表单字段与接口入参一致时直接提交 `values`。
- 只有字段名、格式、过滤规则或 DTO 结构确实不同时才转换。
- 不为了“DTO 看起来明确”重复逐字段赋值。
- 表单错误展示靠近对应字段；服务端错误由统一请求层或当前业务流程处理。

## 11. L3 文件头与代码注释

项目**需要代码注释**，并要求手写源文件维护 L3 文件头。人工和 AI 生成的注释默认使用简体中文，技术名词和代码标识符保留英文。

### 11.1 L3 文件头

所有手写源文件（主要包括 `.ts`、`.tsx`、`.js`、`.jsx`、`.mjs`、`.css`）顶部必须包含与实际代码一致的 L3 头部：

```ts
/**
 * [INPUT]: 依赖 {哪些模块/文件} 的 {什么功能}
 * [OUTPUT]: 对外提供 {函数/组件/类型/变量}
 * [POS]: {属于哪个模块} 的 {角色}，{与其他文件的关系}
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: {YYYY-MM-DD HH:mm:ss}
 */
```

规则：

- `[INPUT]`、`[OUTPUT]`、`[POS]` 必须描述当前真实实现，不写空泛模板话术。
- `[PROTOCOL]` 固定指向 `AGENTS.md` 与相关 Skill；当前项目不使用 CLAUDE.md 维护协议。
- `[TIME]` 使用 `YYYY-MM-DD HH:mm:ss`，修改文件逻辑或职责时同步刷新。
- HTML 使用等价的 `<!-- ... -->` L3 头部。
- JSON、自动生成声明等不支持或不适合维护注释的文件不强制。
- `src/auto-imports.d.ts`、`src/vite-env.d.ts` 等生成文件明确豁免，避免生成器覆盖人工头部。

### 11.2 正文注释

AI 新增或重构代码时，应主动为以下内容添加中文注释：

- 多步骤业务流程和关键流程节点；
- 非直观状态变化或状态联动；
- 特殊业务规则、边界条件和兜底逻辑；
- API / 表单 / 后端数据之间的转换；
- TanStack Query 缓存失效、预取、乐观更新等非直观行为；
- `useEffect`、`useRef`、缓存、懒加载等存在明确原因的实现；
- 浏览器兼容、第三方库限制或框架约束；
- 性能优化、特殊实现取舍；
- 正则、复杂计算、复杂条件；
- 容易被误删、误改的兼容代码。

注释既可以帮助理解“业务流程在做什么”，也应优先解释“为什么这样做”。不要写 `// 设置 loading`、`// 删除用户` 这种重复代码表面含义的注释。

JSDoc 不要求覆盖每个函数；公共 Hook、公共工具、重要公共组件或参数语义不明显的 API 可以使用。不要机械添加作者、`@since`、修改历史等额外元数据，L3 的 `[TIME]` 是统一时间信息来源。

详细规则见 `skills/code-comments/SKILL.md`。

## 12. 命名规则

- React 组件：PascalCase。
- Hook：`useXxx`。
- 事件处理函数：`handleXxx`。
- Props 回调：`onXxx`。
- 布尔值：优先 `isXxx`、`hasXxx`、`canXxx`、`shouldXxx`。
- 文件命名沿用当前目录习惯，不为形式统一做无意义重命名。

## 13. Git 规则

- Git commit message 默认使用简体中文，简短描述真实修改目的。
- 不强制 Conventional Commits；如果使用，描述部分仍使用中文。
- 默认在当前分支继续修改，**不要自行创建新分支或 PR**，除非用户明确要求。
- 提交前检查真实 diff 和提交范围。
- 一个提交尽量对应一个逻辑修改。
- 不提交密钥、凭证、真实 `.env` 等敏感文件。
- 不修改 Git 全局配置。
- 不使用 force push、hard reset 等破坏性操作，除非用户明确要求并确认影响。

项目不使用 Husky 和 lint-staged。

## 14. 错误处理

- 不静默吞掉异常，不使用空 `catch`。
- 能由统一请求层处理的错误不要在每个页面复制一套逻辑。
- 页面只处理与当前业务流程有关的错误反馈。
- 对 `unknown` 错误先进行类型收窄，再读取属性。
- 不为不存在的 API 猜测字段，不用假数据掩盖真实接口问题。

## 15. 性能规则

默认先写清晰、可维护的代码。只有存在真实性能问题时再优化，例如网络瀑布、大列表、昂贵计算、可观察的重复渲染、重型 Bundle 或重复服务端请求。

详细规则见 `skills/react-performance/SKILL.md`。

## 16. 禁止模式

不要生成以下模式：

- 用 `any`、大量类型断言掩盖类型问题；
- 页面直接调用 Axios；
- 后端列表无理由放 Zustand；
- 可派生状态使用 `useEffect + useState`；
- 无意义 `useMemo/useCallback/memo`；
- 一个简单页面拆出七八层目录；
- API 放进 `pages` 或业务目录；
- 重复定义后端类型、表单类型；
- 复杂转换直接塞进 JSX；
- 动态列表有稳定 ID 时仍使用数组索引作为 key；
- 直接修改 props/state；
- 复杂业务逻辑完全没有必要注释；
- 每行代码都生成翻译式废话注释；
- 新增手写源文件却缺少 L3 文件头；
- L3 内容与实际代码不一致或修改后不刷新 `[TIME]`；
- 业务页面、`components/common`、`layouts` 等业务代码显式 import `lucide-react`；`src/components/ui/**` 的 shadcn/ui 源码例外；
- 未经用户明确要求主动运行 typecheck/lint/test/build。

## 17. 完成前静态检查

默认只做静态检查：

- 目录没有被无意义拆深；
- API 与状态归属正确；
- 没有重复类型和明显未解析 import；
- 自动导入规则正确；
- shadcn/ui 源码中的 `lucide-react` import 没有被无意义改写；
- 手写源文件包含准确的 L3 文件头；
- 复杂逻辑有必要的中文注释；
- Git diff 只包含当前任务相关修改。

如果用户未明确要求自动化校验，最终回复明确说明未执行 `typecheck / lint / test / build`。
