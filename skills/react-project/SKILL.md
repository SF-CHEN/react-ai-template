---
name: react-project-conventions
description: 当前 React + TypeScript + Vite 模板的项目架构与实现规范。新增业务模块、页面、API、表单、表格、路由或共享组件时使用。
---

# React 项目规范

## 选择指南

| 场景 | 使用方案 |
|---|---|
| 业务功能 | `src/modules/<feature>` |
| 服务端数据 | TanStack Query |
| 全局客户端状态 | Zustand |
| 表单状态 | React Hook Form |
| 数据校验 | Zod |
| 复杂表格行为 | TanStack Table |
| HTTP | `src/services` 中的 Axios 封装 |
| 基础 UI | `src/components/ui` |
| 跨业务通用组件 | `src/components/common` |

## 模块模板

```text
modules/example/
├── pages/
├── components/
├── api/
├── hooks/
├── query/
├── schemas/
└── types/
```

只创建模块真实需要的目录，不要为了形式把所有空目录一次性补齐。

## 生成代码原则

1. 新增结构前先参考最接近的现有模块。
2. 每一个状态值尽量只保留一个真实数据源。
3. 优先写直接、清晰、容易维护的代码，不做无价值的泛型抽象。
4. 保持现有命名方式和 import alias。
5. 非显而易见的设计决策使用中文 Why 注释说明。
6. 现有技术栈已经能解决问题时，不新增重复依赖。
7. 文档、注释、Git 提交说明默认使用中文；代码标识符保持英文。
