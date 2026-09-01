import { useQuery } from '@tanstack/react-query'

import { getUserList } from '../api/userApi'
import { userKeys } from '../query/userKeys'
import type { UserListParams } from '../types/user'

export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUserList(params),
  })
}
