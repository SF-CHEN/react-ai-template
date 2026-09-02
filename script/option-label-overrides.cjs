/**
 * [INPUT]: 由开发者或 AI 维护需要覆盖的自动生成 options 中文 label
 * [OUTPUT]: 向 sync-options.cjs 提供以最终 xxxOptions 变量名分组的 enum value -> 中文文案覆盖表
 * [POS]: script 的人工覆盖配置，只修正 Swagger 枚举中文说明，不参与后端 enum value 定义
 * [PROTOCOL]: 只维护确实生成错误的 label；api:generate / api:all 不会覆盖本文件
 * [TIME]: 2026-09-02 09:45:00
 */
module.exports = {
  // 示例：key 直接使用 options.ts 最终导出的变量名，方便一眼对应生成结果。
  // EvaluationTaskStatusOptions: {
  //   PENDING: '待处理',
  //   QUEUED: '排队中',
  // },
}
