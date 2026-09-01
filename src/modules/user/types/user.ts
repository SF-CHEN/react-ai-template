export const userRoles = ['admin', 'user', 'auditor'] as const
export const userStatuses = ['enabled', 'disabled'] as const

export type UserRole = (typeof userRoles)[number]
export type UserStatus = (typeof userStatuses)[number]

export interface User {
  id: number
  username: string
  displayName: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface UserListParams {
  page: number
  pageSize: number
  keyword?: string
  status?: UserStatus
}

export interface UserListResult {
  list: User[]
  total: number
}
