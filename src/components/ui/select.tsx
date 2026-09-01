/**
 * [INPUT]: 依赖 React forwardRef/select 属性类型和 cn 类名合并工具
 * [OUTPUT]: 对外提供支持 ref 透传的 Select 原生下拉组件
 * [POS]: components/ui 的表单基础组件，为简单枚举选择场景提供统一样式
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { forwardRef, type SelectHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)

Select.displayName = 'Select'
