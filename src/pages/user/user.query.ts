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
