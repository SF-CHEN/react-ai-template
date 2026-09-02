import { useSearchParams } from 'react-router'

import type { User, UserStatus } from '@/api/user'
import { PageHeader } from '@/components/common/PageHeader'

import { UserFormDialog } from './UserFormDialog'
import { UserTable } from './UserTable'
import { userOptions } from './user.options'
import { useCreateUser, useDeleteUser, useUpdateUser, useUserList } from './user.query'
import type { UserFormData } from './user.schema'

const PAGE_SIZE = 10

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export default function UserListPage() {
  // 搜索、筛选和分页需要支持刷新与链接分享，因此 URL 是这些状态的真实来源
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const keyword = searchParams.get('keyword') ?? ''
  const statusValue = searchParams.get('status')
  const status: UserStatus | undefined =
    statusValue === 'enabled' || statusValue === 'disabled' ? statusValue : undefined

  // 输入过程先保存在草稿状态，点击查询后再同步 URL，避免每次按键都触发列表请求
  const [draftKeyword, setDraftKeyword] = useState(keyword)
  const [draftStatus, setDraftStatus] = useState(status ?? 'all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const listQuery = useUserList({ page, pageSize: PAGE_SIZE, keyword, status })
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const updateSearch = (next: { page?: number; keyword?: string; status?: string }) => {
    // 基于当前 URL 增量更新，避免翻页时丢失筛选条件或查询时误删其他参数
    const params = new URLSearchParams(searchParams)
    const nextPage = next.page ?? page
    const nextKeyword = next.keyword ?? keyword
    const nextStatus = next.status ?? status ?? ''

    nextPage > 1 ? params.set('page', String(nextPage)) : params.delete('page')
    nextKeyword ? params.set('keyword', nextKeyword) : params.delete('keyword')
    nextStatus && nextStatus !== 'all' ? params.set('status', nextStatus) : params.delete('status')

    setSearchParams(params)
  }

  const handleSearch = () => {
    // 新筛选条件生效时回到第一页，避免原页码超过筛选后的总页数
    updateSearch({ page: 1, keyword: draftKeyword.trim(), status: draftStatus })
  }

  const handleCreate = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDelete = async (user: User) => {
    await deleteMutation.mutateAsync(user.id)
  }

  const handleSubmit = async (values: UserFormData) => {
    // 编辑和新增共用一个表单，只在提交阶段根据 editingUser 选择对应 Mutation
    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, input: values })
    } else {
      await createMutation.mutateAsync(values)
    }

    // 仅在请求成功后关闭并清空编辑态，失败时保留用户输入方便继续修改
    setDialogOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="用户管理"
        description="CRUD 示例：TanStack Query + Table + React Hook Form + Zod。"
        actions={
          <Button onClick={handleCreate}>
            <IconLucidePlus className="size-4" />
            新增用户
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              value={draftKeyword}
              onChange={(event) => setDraftKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch()
              }}
              className="lg:max-w-sm"
              placeholder="搜索用户名、姓名或邮箱"
            />
            <Select
              items={userOptions.statusFilter}
              value={draftStatus}
              onValueChange={(value) => setDraftStatus(value ?? 'all')}
            >
              <SelectTrigger className="lg:w-36" aria-label="筛选用户状态">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                {userOptions.statusFilter.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={handleSearch}>
              <IconLucideSearch className="size-4" />
              查询
            </Button>
          </div>

          <UserTable
            data={listQuery.data?.list ?? []}
            loading={listQuery.isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              共 {total} 条
              {listQuery.isFetching && !listQuery.isLoading ? ' · 正在刷新…' : ''}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateSearch({ page: page - 1 })}
              >
                上一页
              </Button>
              <span>
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateSearch({ page: page + 1 })}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        user={editingUser}
        submitting={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
