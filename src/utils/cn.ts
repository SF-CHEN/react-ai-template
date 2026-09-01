/**
 * [INPUT]: 依赖 clsx 的条件类名组合与 tailwind-merge 的 Tailwind 冲突合并能力
 * [OUTPUT]: 对外提供 cn 通用类名合并函数
 * [POS]: utils 层的纯函数工具，被基础 UI 和布局组件用于安全组合 Tailwind className
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
