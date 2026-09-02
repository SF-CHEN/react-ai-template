# API 生成脚本

本目录负责根据 Swagger / OpenAPI 生成 `src/api/generated` 下的 API、类型、枚举、选项和接口文档。

## 常用命令

```bash
npm run api:generate
npm run api:docs
npm run api:all
```

`api:generate` 会执行：

```text
generate-api.cjs
        ↓
生成 API / types / enums / 基础 options
        ↓
sync-options.cjs
        ↓
重新解析 Swagger 枚举说明并应用人工 label 覆盖
        ↓
生成最终 options.ts
```

## options label 规则

`src/api/generated/meta/options.ts` 是自动生成文件，不直接手改。

label 优先级：

1. `script/option-label-overrides.cjs` 中的人工覆盖。
2. Swagger / OpenAPI 的 `x-enum-*` 中文说明。
3. Swagger `description` 中明确的 `ENUM-中文说明` 映射。
4. `description` 中数量与 enum 一致的中文顺序列表，例如 `模型类型，分为内置模型和用户模型`。
5. Swagger 英文说明。
6. enum 原始值。

后端 enum value 始终保持原值，不会为了中文展示而修改。

## 人工修正 label

如果自动生成不准确，不要修改 `src/api/generated/meta/options.ts`，而是在：

```text
script/option-label-overrides.cjs
```

增加覆盖：

```js
module.exports = {
  EvaluationTaskStatus: {
    PENDING: '待处理',
    QUEUED: '排队中',
    RUNNING: '进行中',
  },
}
```

key 使用生成的 Option 名去掉 `Options` 后的名称，例如：

```text
EvaluationTaskStatusOptions
        ↓
EvaluationTaskStatus
```

第二层 key 使用后端真实 enum value。

该覆盖文件是手写配置，`api:generate` 和 `api:all` 都不会覆盖它，开发者或 AI 可以长期维护。
