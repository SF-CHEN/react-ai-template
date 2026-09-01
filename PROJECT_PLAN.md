# React AI Template 构建计划

- [x] 1. 初始化 React + TypeScript + Vite 模板结构
- [x] 2. 接入 shadcn/ui 风格组件、Tailwind CSS、Base UI、Lucide
- [x] 3. 配置 React Router、TanStack Query、Zustand
- [x] 4. 配置 React Hook Form + Zod
- [x] 5. 配置 TanStack Table、Axios、Day.js、ECharts
- [x] 6. 加入 Dashboard、用户 CRUD、Query、Store、Form、Table 示例
- [x] 7. 配置 ESLint + Prettier，不使用 Husky / lint-staged
- [x] 8. 将 Vercel React Best Practices 适配为 Vite + TanStack Query Skill
- [x] 9. 编写 `AGENTS.md`、项目 Skill、架构与 AI 开发文档
- [x] 10. README、文档、Skill 与代码注释统一使用中文
- [x] 11. Git 提交说明默认使用中文
- [x] 12. 将目录调整为页面优先 + 渐进式分层
- [x] 13. API 独立到 `src/api`，移除 `modules` 多层业务结构
- [ ] 14. 安装依赖后执行 `pnpm typecheck && pnpm lint && pnpm test:run && pnpm build`

## 当前目录原则

- API：统一放 `src/api`
- 页面：统一放 `src/pages`
- 简单页面：文件同级放置，不提前建多层目录
- 复杂页面：出现明确职责边界后再增加 `components/`、`detail/`、`hooks/` 等子目录
- 公共组件：跨页面复用后再提升到 `src/components/common`

## 校验说明

生成模板时的执行环境无法稳定访问 npm registry，因此依赖安装后的完整校验需要在本地执行：

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```
