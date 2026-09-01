import type { UserFormData } from '../schemas/userSchema'
import type { User, UserListParams, UserListResult } from '../types/user'

let users: User[] = [
  {
    id: 1,
    username: 'admin',
    displayName: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'enabled',
    createdAt: '2026-08-21T09:20:00+08:00',
  },
  {
    id: 2,
    username: 'chen',
    displayName: '陈工',
    email: 'chen@example.com',
    role: 'user',
    status: 'enabled',
    createdAt: '2026-08-24T14:35:00+08:00',
  },
  {
    id: 3,
    username: 'auditor',
    displayName: '安全审核员',
    email: 'auditor@example.com',
    role: 'auditor',
    status: 'disabled',
    createdAt: '2026-08-27T11:10:00+08:00',
  },
  {
    id: 4,
    username: 'demo-user',
    displayName: '演示用户',
    email: 'demo@example.com',
    role: 'user',
    status: 'enabled',
    createdAt: '2026-08-30T16:42:00+08:00',
  },
]

function wait(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getUserList(params: UserListParams): Promise<UserListResult> {
  await wait()

  const keyword = params.keyword?.trim().toLowerCase()
  const filtered = users.filter((user) => {
    const matchKeyword =
      !keyword ||
      user.username.toLowerCase().includes(keyword) ||
      user.displayName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    const matchStatus = !params.status || user.status === params.status

    return matchKeyword && matchStatus
  })

  const start = (params.page - 1) * params.pageSize

  return {
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
  }
}

export async function createUser(input: UserFormData): Promise<User> {
  await wait()

  const nextId = Math.max(0, ...users.map((user) => user.id)) + 1
  const user: User = {
    id: nextId,
    ...input,
    createdAt: new Date().toISOString(),
  }

  users = [user, ...users]
  return user
}

export async function updateUser(id: number, input: UserFormData): Promise<User> {
  await wait()

  const current = users.find((user) => user.id === id)
  if (!current) throw new Error('用户不存在')

  const updated: User = { ...current, ...input }
  users = users.map((user) => (user.id === id ? updated : user))
  return updated
}

export async function deleteUser(id: number): Promise<void> {
  await wait(160)
  users = users.filter((user) => user.id !== id)
}
