import { describe, expect, it } from 'vitest'

import { formatNumber } from './format'

describe('formatNumber', () => {
  it('formats numbers with thousands separators', () => {
    expect(formatNumber(12000)).toBe('12,000')
  })
})
