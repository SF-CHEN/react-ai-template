# AI 开发指南

本项目把 AI 上下文分成三层，避免同一条规则在多个文件重复维护：

```text
AGENTS.md   → 必须遵守的全局硬约束
skills/*    → 当前任务的专项实现方法
docs/*      → 架构背景、长篇说明和人工参考
```

## 开始编码前

1. 阅读根目录 `AGENTS.md`。
2. 阅读目标文件附近的现有代码。
3. 根据任务只加载真正相关的 Skill。
4. 优先复用现有 UI、Hook、工具和技术栈。
5. 简单页面保持扁平，不为了“架构完整”提前拆目录。
6. 修改完成后做静态影响检查；除非用户明确要求，不主动运行自动化校验。

## Skill 路由

```text
页面 / 组件 / 路由 / 表单 / TypeScript / 目录
→ skills/react-app/SKILL.md

API / Query / Mutation / Zustand / URL / OpenAPI
→ skills/react-data/SKILL.md

shadcn/ui / 页面样式 / 交互状态 / 响应式 / 可访问性
→ skills/react-ui/SKILL.md

性能问题
→ skills/react-performance/SKILL.md
```

## 推荐提示词

```text
在当前项目中实现 <功能>。
先遵循 AGENTS.md，再按任务读取相关 Skill。
编码前阅读现有代码，优先采用最简单且符合当前项目习惯的实现。
保持页面优先、渐进式分层，不添加需求之外的功能和未来扩展点。
优先使用现有 shadcn/ui、API、Hook、工具和自动导入能力。
复杂公共基础设施需要时使用精简 L3；普通页面和 UI 组件不要机械添加文件头。
复杂业务流程、数据转换、特殊约束和容易误改的代码补充简体中文 Why 注释。
默认不要运行 typecheck、lint、test、build、deadcode 检查，除非我明确要求。
不要自行创建新分支或 PR。
```
