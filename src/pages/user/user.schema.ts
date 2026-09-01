/**
 * [INPUT]: 依赖 Zod 的字符串、枚举和对象 Schema 校验能力
 * [OUTPUT]: 对外提供 userFormSchema 与由 Schema 推导的 UserFormData 类型
 * [POS]: pages/user 的表单校验契约，由 UserFormDialog 和 user.query.ts 共享
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { z } from 'zod'

export const userFormSchema = z.object({
  username: z.string().trim().min(2, '用户名至少 2 个字符').max(32, '用户名不能超过 32 个字符'),
  displayName: z.string().trim().min(1, '请输入姓名').max(40, '姓名不能超过 40 个字符'),
  email: z.email('请输入正确的邮箱地址'),
  role: z.enum(['admin', 'user', 'auditor']),
  status: z.enum(['enabled', 'disabled']),
})

export type UserFormData = z.infer<typeof userFormSchema>
