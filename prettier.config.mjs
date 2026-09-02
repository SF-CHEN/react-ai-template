/**
 * [INPUT]: 依赖 Prettier 格式化配置协议
 * [OUTPUT]: 对外提供项目统一的代码格式配置
 * [POS]: 工程格式化入口，与 ESLint 分工负责代码排版
 */
/** @type {import('prettier').Config} */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
