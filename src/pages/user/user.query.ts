/**
 * [INPUT]: 依赖 TanStack Query、src/api/user 的 CRUD 函数和用户表单类型
 * [OUTPUT]: 对外提供 userKeys、用户列表 Query Hook 与新增/更新/删除 Mutation Hook
 * [POS]: pages/user 的服务端状态协调层，连接用户页面与 api/user.ts 并负责缓存失效
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createUser,
  deleteUser,
  getUserList,
  updateUser,
  type UserListParams,
} from '@/api/user'

import type { UserFormData } from './user.schema'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
}

export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUserList(params),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    // 新增会影响所有用户列表筛选结果，成功后统一让列表缓存重新获取
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UserFormData }) => updateUser(id, input),
    // 用户字段变化可能影响当前及其他列表筛选条件，因此失效整个 users 查询域
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    // 删除只需要刷新用户列表缓存；当前示例没有单独的用户详情 Query
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}
