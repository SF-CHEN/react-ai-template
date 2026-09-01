/**
 * [INPUT]: 依赖 React label 属性类型和 cn 类名合并工具
 * [OUTPUT]: 对外提供 Label 基础表单标签组件
 * [POS]: components/ui 的表单基础组件，与 Input/Select 和表单字段组合使用
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import type { LabelHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />
}
