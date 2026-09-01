# React AI Template 构建计划

- [x] 1. 初始化 React + TypeScript + Vite 模板结构
- [x] 2. 接入 shadcn/ui 风格组件、Tailwind CSS、Base UI、Lucide 图标自动导入
- [x] 3. 配置 React Router、TanStack Query、Zustand
- [x] 4. 配置 React Hook Form + Zod
- [x] 5. 配置 TanStack Table、Axios、Day.js、ECharts
- [x] 6. 加入 Dashboard、用户 CRUD、Query、Store、Form、Table 示例
- [x] 7. 配置 ESLint + Prettier，不使用 Husky / lint-staged
- [x] 8. 将 Vercel React Best Practices 适配为 Vite + TanStack Query Skill
- [x] 9. 编写 `AGENTS.md`、项目 Skill、架构与 AI 开发文档
- [x] 10. README、文档、Skill、代码注释和 Git 提交说明默认使用中文
- [x] 11. 将目录调整为页面优先 + 渐进式分层
- [x] 12. API 独立到 `src/api`，移除 `modules` 多层业务结构
- [x] 13. React API、基础 UI、通用 Hook、Lucide 图标支持自动导入
- [x] 14. 重构 AI 工作原则、数据/类型/注释/性能 Skill 体系
- [x] 15. 手写源文件加入 L3 文件头与 `[TIME]` 维护规则
- [x] 16. AI 默认禁止主动运行 typecheck、lint、test、build，改为用户明确要求后执行

## 当前目录原则

- API：统一放 `src/api`
- 页面：统一放 `src/pages`
- 简单页面：文件同级放置，不提前建多层目录
- 复杂页面：出现明确职责边界后再增加 `components/`、`detail/`、`hooks/` 等子目录
- 公共组件：跨页面复用后再提升到 `src/components/common`

## L3 与注释原则

- 手写源文件维护准确的 L3 文件头：`INPUT / OUTPUT / POS / PROTOCOL / TIME`
- 修改源码时同步刷新 L3 内容和 `[TIME]`
- 自动生成的 `src/auto-imports.d.ts`、`src/vite-env.d.ts` 豁免 L3
- 复杂业务流程、数据转换、状态联动、兼容与性能取舍主动补充中文注释
- 不给简单赋值和明显 JSX 添加翻译式废话注释

## 校验说明

项目保留以下校验命令供开发者手动使用：

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

AI 默认不得主动运行这些命令。只有用户明确要求类型检查、Lint、测试、构建或完整校验时才执行。
