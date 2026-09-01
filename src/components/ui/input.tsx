/**
 * [INPUT]: 依赖 React forwardRef/input 属性类型和 cn 类名合并工具
 * [OUTPUT]: 对外提供支持 ref 透传的 Input 基础输入组件
 * [POS]: components/ui 的表单基础组件，与 React Hook Form 等表单方案直接组合使用
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
