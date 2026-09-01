# AI 开发指南

## 开始生成代码前

1. 先阅读根目录 `AGENTS.md`。
2. 根据任务按需读取 Skill，不要一次性机械套用全部 Skill。
3. 先看目标页面附近已有文件，再决定是否需要新文件或目录。
4. 明确影响实现方向的假设、歧义和取舍；有明显更简单的方案时优先指出。
5. 优先复用现有 UI、Hook、工具和依赖，不添加需求之外的功能。
6. 先判断状态属于 TanStack Query、Zustand、表单、URL 还是局部 state。
7. 新建或修改手写源文件时维护准确的 L3 文件头和时间。
8. 复杂业务逻辑、数据转换、特殊约束和容易误改的代码主动补充中文注释。

## Skill 路由

```text
页面 / 组件 / 表单 / 路由
→ skills/react-project/SKILL.md

API / Query / Mutation / Zustand / URL 状态
→ skills/react-data/SKILL.md

TypeScript / DTO / Props / Zod 类型 / 泛型
→ skills/typescript/SKILL.md

L3 文件头 / 代码注释 / 复杂业务流程 / 数据转换
→ skills/code-comments/SKILL.md

性能问题
→ skills/react-performance/SKILL.md
```

## 推荐提示词

```text
在当前项目中实现 <功能>。
先遵循 AGENTS.md，再按任务读取相关 skills。
编码前先阅读现有代码，明确会影响实现方向的假设和歧义；存在更简单方案时优先采用简单方案。
保持页面优先、渐进式分层：简单页面不要预先创建多层目录，不添加需求之外的功能和扩展点。
API 统一放 src/api；业务 Query 放页面附近。
React API、基础 UI、通用 Hook 和 IconLucideXxx 使用项目现有自动导入。
TypeScript 不使用 I 前缀，不使用 any 绕过检查。
所有手写源文件维护与实际代码一致的 L3 文件头，并刷新 [TIME]。
主动为复杂业务流程、状态联动、数据转换、兼容处理和容易误改的代码添加简体中文注释。
默认不要运行 typecheck、lint、test、build；只有我明确要求校验时才执行。
完成后说明是否执行了自动化校验。
```

## 合格的 AI 输出

应该做到：

- 代码只解决当前需求，没有额外“顺手功能”；
- 能在较少目录层级中快速找到业务页面主要代码；
- 接口统一添加到 `src/api/<name>.ts`；
- TanStack Query 逻辑放页面附近，不把接口数据复制进 Zustand；
- 复杂表单使用 React Hook Form + Zod，类型优先由 Schema 推导；
- 页面专用组件先就近放，跨页面复用后再提升；
- 手写源文件有准确的 L3 文件头和当前 `[TIME]`；
- 复杂业务文件有真正帮助理解流程和 Why 的中文注释；
- 不机械 memo、抽象、创建 types 目录或生成翻译式注释；
- Git 提交说明默认使用中文，并继续当前分支而不是自行建分支；
- 未经明确要求不运行 typecheck、lint、test、build，并在最终回复中说明未执行。
