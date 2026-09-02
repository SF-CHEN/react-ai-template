/**
 * [INPUT]: 依赖 @/api/user 的 UserRole、UserStatus 类型约束，并维护用户页面前端展示文案
 * [OUTPUT]: 对外提供 userOptions，统一组织用户页面表单和筛选使用的角色、状态选项
 * [POS]: pages/user 的页面级 options 聚合层，让页面组件只消费 userOptions，不关心选项具体来源
 * [PROTOCOL]: 页面固定选项在此维护；若某组选项改为后端 enum，则改为导入 generated options，不在组件 JSX 内重复写
 * [TIME]: 2026-09-02 09:45:00
 */
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

export const userOptions = {
  role: roleOptions,
  status: statusOptions,
} as const
