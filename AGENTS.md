# React AI Template - AI / Agent 开发规范

本仓库用于 **AI 辅助开发 + 人工长期维护**。默认优先级：

> **清晰 > 易找 > 可维护 > 一致 > 过度抽象 > 炫技式优化**

如果规则与现有代码冲突，优先阅读目标文件附近的真实实现，再按本规范做最小范围调整。

## 1. 技术栈

- React + TypeScript + Vite
- shadcn/ui 风格源码组件 + Base UI
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
- ESLint + Prettier
- Vitest

没有明确需求时，不要引入职责重复的第二套库。

## 2. Skill 使用规则

遇到对应任务时优先阅读相关 Skill，不要把所有 Skill 的规则机械套到每个文件。

| 场景 | Skill |
|---|---|
| 新增页面、组件、表单、路由、目录调整 | `skills/react-project/SKILL.md` |
| API、TanStack Query、Zustand、URL 状态 | `skills/react-data/SKILL.md` |
| TypeScript 类型设计、DTO、Zod 推导、泛型 | `skills/typescript/SKILL.md` |
| 性能分析、网络瀑布、重渲染、Bundle | `skills/react-performance/SKILL.md` |

Skill 是专项指导，`AGENTS.md` 是项目长期强制约定。

## 3. 目录原则

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

## 4. React 与组件规则

- `pages/<name>/index.tsx` 负责页面布局、业务流程和组件组合。
- 页面专用组件优先放在当前页面目录。
- 组件只承担一个主要职责，但不要按固定行数机械拆分。
- Render 阶段保持纯净，不直接修改 props 或 state。
- Hook 只能在顶层调用。
- 可以直接计算出的派生值，不使用 `useEffect + useState` 再保存一份。
- 用户交互引起的逻辑优先放事件处理函数，不要为了触发事件绕到 `useEffect`。
- 不机械添加 `memo`、`useMemo`、`useCallback`、`useRef`。
- 新状态依赖旧状态时使用函数式 setState。
- 不在组件内部定义 React 组件。
- 只有较重页面、明显功能边界或首屏 Bundle 受益时才使用懒加载。
- JSX 中避免复杂数据转换、深层嵌套三元表达式和难读的条件逻辑。

## 5. 自动导入规则

项目使用 `unplugin-auto-import + unplugin-icons`。

允许自动导入：

- React 常用 API，例如 `useState`、`useEffect`、`useMemo`
- `src/components/ui` 下基础 UI 组件
- `src/hooks` 下跨页面通用 Hook
- Lucide 图标，统一写成 `IconLucideXxx`

例如：

```tsx
<Button>
  <IconLucidePlus className="size-4" />
  新增
</Button>
```

不要生成：

```tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
```

以下内容保持显式 import：

- `src/api` 中的接口函数和业务类型
- 页面专用组件
- 页面业务 Query / Hook
- `src/store`
- `src/utils`
- `components/common`
- 业务类型
- 其他第三方业务库

不要把整个 `src` 加入自动扫描范围。

## 6. TypeScript 规则

- 不使用 `IUser`、`IRequestConfig` 这类 `I` 前缀。
- 不为了区分类型机械添加 `Type`、`Interface` 后缀。
- 对象结构优先使用清晰的 `interface`；联合类型、工具类型、映射类型等使用 `type`。
- 禁止用 `any` 绕过类型检查；不确定外部数据先用 `unknown`，再收窄。
- 表单类型优先从 Zod Schema 使用 `z.infer` 推导，不重复手写。
- API 直接相关请求/响应类型优先和对应 `src/api/<name>.ts` 放在一起。
- 页面私有类型优先放页面附近；只有真正跨业务共享的类型才进入 `src/types`。
- 不重复定义已经存在的后端 DTO、表单类型或领域模型。
- 优先使用字面量联合、`as const`、`satisfies`；没有明确需求时不要滥用 `enum`。
- 泛型只有在能带来真实复用和类型推导价值时使用，不做炫技式泛型。
- 可空值要明确区分 `undefined` 与 `null` 的业务语义。

详细规则见 `skills/typescript/SKILL.md`。

## 7. API 与状态归属

状态只有一个真实来源：

- 服务端状态：TanStack Query
- 全局客户端状态：Zustand
- 局部 UI 状态：React state
- 表单状态：React Hook Form
- 需要分享、刷新后保留的搜索/筛选/分页：URL Search Params

API 规则：

- Axios 只在 `src/api` 层使用，页面和 UI 组件不直接调用 Axios。
- `api/request.ts` 负责 Axios 实例、拦截器和基础请求能力。
- TanStack Query Hook 放在使用它的页面附近，例如 `pages/user/user.query.ts`。
- 简单场景把 Query Key、Query、Mutation 放在一个 `<name>.query.ts` 中，不拆成多个目录。
- 不把 Query 数据复制进 Zustand。
- 不在 `useEffect` 中重新实现请求缓存、去重和刷新逻辑。

详细规则见 `skills/react-data/SKILL.md`。

## 8. 表单规则

- 复杂表单使用 React Hook Form + Zod。
- Schema 与页面放在一起，例如 `pages/user/user.schema.ts`。
- 表单字段与接口入参一致时，直接提交 `values`。
- 只有字段名、格式、过滤规则或 DTO 结构确实不同时才转换。
- 不为了“DTO 看起来明确”重复逐字段赋值。
- 表单错误展示应靠近对应字段；提交失败的服务端错误由统一请求/页面流程处理。

## 9. 命名规则

- React 组件：PascalCase，例如 `UserTable`。
- Hook：`useXxx`。
- 事件处理函数：`handleXxx`。
- Props 回调：`onXxx`。
- 布尔值：优先 `isXxx`、`hasXxx`、`canXxx`、`shouldXxx`。
- 常量：语义清晰即可；真正全局常量可使用大写下划线。
- 文件名与当前目录保持一致，不为了形式统一做无意义重命名。

## 10. 注释与文档

项目文档和代码注释默认使用中文，技术名词和代码标识符保留英文。

注释原则：

- 注释重点解释 **Why**：设计原因、约束、兼容性、业务边界、容易误改的点。
- 不给每个变量、每个函数机械添加注释。
- 简单函数不强制 JSDoc。
- 不添加 `@since`、修改时间、作者等容易过期的元数据。
- 不要求每个源文件添加固定文件头。
- 不要求每个目录创建 CLAUDE.md / README.md。

只有架构、公共使用方式、重要约定发生变化时，才同步更新 README / docs / Skill。

## 11. Git 规则

- Git commit message 默认使用简体中文，简短描述真实修改目的。
- 不强制 Conventional Commits；如果使用，描述部分仍使用中文。
- 默认在当前分支继续修改，**不要自行创建新分支或 PR**，除非用户明确要求。
- 提交前先检查真实 diff 和提交范围。
- 一个提交尽量对应一个逻辑修改。
- 不提交密钥、凭证、真实 `.env` 等敏感文件。
- 不修改 Git 全局配置。
- 不使用 force push、hard reset 等破坏性操作，除非用户明确要求并确认影响。
- 不使用 `--no-verify` 绕过检查，除非用户明确要求。

项目不使用 Husky 和 lint-staged。

## 12. 错误处理

- 不静默吞掉异常。
- 不使用空 `catch`。
- 能由统一请求层处理的错误不要在每个页面复制一套逻辑。
- 页面只处理与当前业务流程有关的错误反馈。
- 对 `unknown` 错误先进行类型收窄，再读取属性。

## 13. 性能规则

默认先写清晰、可维护的代码。

只有存在真实问题时再优化，例如：

- 网络瀑布
- 大列表或大量 DOM
- 昂贵计算
- 可观察的重复渲染成本
- 重型依赖进入首屏 Bundle
- 同一服务端数据重复请求

详细规则见 `skills/react-performance/SKILL.md`。

## 14. 禁止模式

不要生成以下模式：

- `any` 用来逃避类型问题
- 页面直接调用 Axios
- 后端列表无理由放 Zustand
- 可派生状态用 `useEffect + useState`
- 无意义 `useMemo/useCallback/memo`
- 一个简单页面拆出七八层目录
- API 放进 `pages` 或业务目录
- 重复定义后端类型、表单类型
- 复杂转换直接塞 JSX
- 动态列表有稳定 ID 时仍使用数组索引作为 key
- 直接修改 props/state
- 每个函数和变量都生成解释代码表面的注释
- 每个目录创建一份同步维护文档
- `lucide-react` 显式 import

## 15. 完成前检查

较大修改完成后，在依赖和环境可用时执行：

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

提交前确认：

- 目录没有被无意义拆深
- API 与状态归属正确
- 没有重复类型
- 自动导入规则正确
- 新增注释是中文 Why 注释
- 文档只在确实需要时更新
- Git 提交说明为中文
