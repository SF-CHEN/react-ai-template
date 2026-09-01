# React AI Template 构建计划

- [x] 1. 初始化 React + TypeScript + Vite 模板结构
- [x] 2. 接入 shadcn/ui 风格组件、Tailwind CSS、Base UI、Lucide
- [x] 3. 配置 React Router、TanStack Query、Zustand
- [x] 4. 配置 React Hook Form + Zod
- [x] 5. 配置 TanStack Table、Axios、Day.js、ECharts
- [x] 6. 采用 `modules` 业务模块架构并补齐共享基础层
- [x] 7. 加入 Dashboard、用户 CRUD、Query、Store、Form、Table 示例
- [x] 8. 配置 ESLint + Prettier，不使用 Husky / lint-staged
- [x] 9. 将 Vercel React Best Practices 适配为 Vite + TanStack Query Skill
- [x] 10. 编写 `AGENTS.md`、项目 Skill、架构与 AI 开发文档
- [x] 11. 执行 TypeScript 语法解析与本地模块导入完整性检查
- [ ] 12. 安装依赖后执行 `pnpm typecheck && pnpm lint && pnpm test:run && pnpm build`
- [x] 13. 打包项目
- [x] 14. README、文档、Skill 与代码注释统一中文规范
- [x] 15. Git 提交说明改为默认使用中文

## 校验说明

生成模板时的执行环境无法稳定访问 npm registry，因此第 12 项暂时无法在该环境真实安装依赖后执行。

请在可以正常访问 npm 的本地环境运行：

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

当前已经完成不依赖 `node_modules` 的检查：

- 所有 TS / TSX 文件可以通过 TypeScript parser 解析
- 所有 `@/` 与相对本地 import 均能定位到对应文件
- 未发现业务源码中的显式 `any`
- 未发现 SWR 或旧版 TanStack Table `useReactTable` 残留
