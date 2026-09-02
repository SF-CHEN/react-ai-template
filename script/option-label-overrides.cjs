/**
 * [INPUT]: 由开发者或 AI 维护需要覆盖的自动生成 options label
 * [OUTPUT]: 向 sync-options.cjs 提供稳定的 enum value -> 展示文案覆盖表
 * [POS]: script 的人工覆盖配置，只解决 Swagger 枚举说明不完整或不准确的 label，不参与后端 value 定义
 * [PROTOCOL]: 可直接维护本文件；重新执行 api:generate / api:all 不会覆盖
 * [TIME]: 2026-09-02 09:45:00
 */
module.exports = {
  // 示例：
  // EvaluationTaskStatus: {
  //   PENDING: '待处理',
  //   QUEUED: '排队中',
  // },
}
