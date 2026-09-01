/**
 * [INPUT]: 依赖 Vitest 测试 API 与 format.ts 的 formatNumber 函数
 * [OUTPUT]: 对外提供 formatNumber 千分位格式化行为的单元测试
 * [POS]: utils 层的测试文件，用于约束 formatNumber 的基础格式化结果
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { describe, expect, it } from 'vitest'

import { formatNumber } from './format'

describe('formatNumber', () => {
  it('使用千分位格式化数字', () => {
    expect(formatNumber(12000)).toBe('12,000')
  })
})
