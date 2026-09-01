# AI 开发指南

## 开始生成代码前

1. 先阅读根目录 `AGENTS.md`。
2. 根据任务按需读取 Skill，不要一次性机械套用全部 Skill。
3. 先看目标页面附近已有文件，再决定是否需要新文件或目录。
4. 优先复用现有 UI、Hook、工具和依赖。
5. 先判断状态属于 TanStack Query、Zustand、表单、URL 还是局部 state。
6. 复杂业务逻辑、数据转换、特殊约束和容易误改的代码需要主动补充中文注释。

## Skill 路由

```text
页面 / 组件 / 表单 / 路由
→ skills/react-project/SKILL.md

API / Query / Mutation / Zustand / URL 状态
→ skills/react-data/SKILL.md

TypeScript / DTO / Props / Zod 类型 / 泛型
→ skills/typescript/SKILL.md

代码注释 / 复杂业务流程 / 数据转换 / 特殊约束
→ skills/code-comments/SKILL.md

性能问题
→ skills/react-performance/SKILL.md
```

## 推荐提示词

```text
在当前项目中实现 <功能>。
先遵循 AGENTS.md，再按任务读取相关 skills。
保持页面优先、渐进式分层：简单页面不要预先创建多层目录。
API 统一放 src/api；业务 Query 放页面附近。
React API、基础 UI、通用 Hook 和 IconLucideXxx 使用项目现有自动导入。
优先复用现有依赖，不引入职责重复的库。
TypeScript 不使用 I 前缀，不使用 any 绕过检查。
请主动为复杂业务流程、特殊业务规则、状态联动、数据转换、兼容处理和容易误改的代码添加简体中文注释。
注释既要帮助理解业务流程，也要优先解释为什么这样实现；不要给简单赋值和明显 JSX 添加废话注释。
依赖可用时执行 typecheck、lint、test 和 build。
```

## 合格的 AI 输出

应该做到：

- 能在较少目录层级中快速找到一个业务页面的主要代码；
- 接口统一添加到 `src/api/<name>.ts`；
- TanStack Query 逻辑放页面附近；
- 不把接口数据复制进 Zustand；
- 复杂表单使用 React Hook Form + Zod，类型优先由 Schema 推导；
- 页面专用组件先就近放，跨页面复用后再提升；
- 复杂业务文件中能看到有价值的中文注释，帮助理解流程、规则和实现原因；
- 不给每个变量、每行代码机械生成注释，不生成无意义时间戳和固定文件头；
- 不机械 memo，不机械抽象，不机械创建 types 目录；
- Git 提交说明默认使用中文，并继续当前分支而不是自行建分支。
