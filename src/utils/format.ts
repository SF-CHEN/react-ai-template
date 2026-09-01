/**
 * [INPUT]: 依赖 Day.js 与 Intl.NumberFormat 提供日期和数字格式化能力
 * [OUTPUT]: 对外提供 formatDateTime 与 formatNumber 通用格式化函数
 * [POS]: utils 层的纯展示格式工具，被表格和页面用于统一格式化输出
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import dayjs from 'dayjs'

export function formatDateTime(value?: string | number | Date | null) {
  if (!value) return '-'
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}
