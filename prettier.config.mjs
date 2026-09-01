/**
 * [INPUT]: 依赖 Prettier 的格式化配置协议
 * [OUTPUT]: 对外提供项目统一的 Prettier 格式配置
 * [POS]: 工程格式化配置入口，与 ESLint 分工负责代码排版而非业务规则
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
/** @type {import('prettier').Config} */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
