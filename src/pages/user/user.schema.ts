import { z } from 'zod'

import type { UserInput } from '@/api/user'

export const userFormSchema = z.object({
  username: z.string().trim().min(2, '用户名至少 2 个字符').max(32, '用户名不能超过 32 个字符'),
  displayName: z.string().trim().min(1, '请输入姓名').max(40, '姓名不能超过 40 个字符'),
  email: z.email('请输入正确的邮箱地址'),
  role: z.enum(['admin', 'user', 'auditor']),
  status: z.enum(['enabled', 'disabled']),
}) satisfies z.ZodType<UserInput>
