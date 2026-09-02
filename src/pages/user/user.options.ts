import type { UserRole, UserStatus } from '@/api/user'

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '审核员', value: 'auditor' },
] as const satisfies ReadonlyArray<{ label: string; value: UserRole }>

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' },
] as const satisfies ReadonlyArray<{ label: string; value: UserStatus }>

const statusFilterOptions = [{ label: '全部状态', value: 'all' }, ...statusOptions] as const

export const userOptions = {
  role: roleOptions,
  status: statusOptions,
  statusFilter: statusFilterOptions,
} as const
