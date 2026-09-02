import { userService, type UserStatus } from '@/api/user'
import { PageHeader } from '@/components/common/PageHeader'

import { UserFormDialog } from './UserFormDialog'
import { UserTable } from './UserTable'
import { userOptions } from './user.options'

interface UserFilters {
  keyword?: string
  status?: UserStatus
}

export default function UserListPage() {
  // 输入框先作为查询草稿，点击查询后再更新真正的筛选条件，避免每次输入都请求接口
  const [draftKeyword, setDraftKeyword] = useState('')
  const [draftStatus, setDraftStatus] = useState('all')
  const [filters, setFilters] = useState<UserFilters>({})

  const crud = useCrud(userService, filters)
  const hasActiveFilters = Boolean(filters.keyword || filters.status)
  const hasFilterInput = Boolean(draftKeyword || draftStatus !== 'all' || hasActiveFilters)

  const handleSearch = () => {
    const status: UserStatus | undefined =
      draftStatus === 'enabled' || draftStatus === 'disabled' ? draftStatus : undefined

    setFilters({
      keyword: draftKeyword.trim() || undefined,
      status,
    })
    crud.setPage(1)
  }

  const handleReset = () => {
    setDraftKeyword('')
    setDraftStatus('all')
    setFilters({})
    crud.setPage(1)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="用户管理"
        description="标准 CRUD 示例：页面只保留业务筛选、表格和表单，分页与增删改查流程由 useCrud 负责。"
        actions={
          <Button onClick={crud.create}>
            <IconLucidePlus className="size-4" />
            新增用户
          </Button>
        }
      />

      <Card className="overflow-hidden border-border/80">
        <CardHeader className="border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>用户列表</CardTitle>
            <CardDescription className="mt-1">
              筛选条件保留在当前页面状态，分页与增删改成功后的列表刷新由 useCrud 统一处理。
            </CardDescription>
          </div>
          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            {crud.isFetching && !crud.isLoading ? (
              <span className="text-xs text-muted-foreground">正在刷新…</span>
            ) : null}
            <Badge variant="secondary">共 {crud.total} 条</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-b border-border/70 bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative flex-1 xl:max-w-md">
                <IconLucideSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={draftKeyword}
                  onChange={(event) => setDraftKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSearch()
                  }}
                  className="bg-card pl-9"
                  placeholder="搜索用户名、姓名或邮箱"
                  aria-label="搜索用户"
                />
              </div>

              <Select
                items={userOptions.statusFilter}
                value={draftStatus}
                onValueChange={(value) => setDraftStatus(value ?? 'all')}
              >
                <SelectTrigger className="bg-card xl:w-40" aria-label="筛选用户状态">
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

              <div className="flex items-center gap-2 xl:ml-auto">
                {hasFilterInput ? (
                  <Button variant="ghost" onClick={handleReset}>
                    <IconLucideX className="size-4" />
                    重置
                  </Button>
                ) : null}
                <Button variant="secondary" onClick={handleSearch}>
                  <IconLucideSearch className="size-4" />
                  查询
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <UserTable
              data={crud.data}
              loading={crud.isLoading}
              error={crud.error ? '用户列表加载失败，请稍后重试。' : undefined}
              onRetry={() => void crud.refetch()}
              onEdit={crud.edit}
              onDelete={crud.remove}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-3.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              第 {crud.page} 页，共 {crud.totalPages} 页
              {hasActiveFilters ? <span className="ml-2">· 当前为筛选结果</span> : null}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={!crud.hasPrevPage} onClick={crud.prevPage}>
                上一页
              </Button>
              <div className="min-w-16 rounded-md bg-muted/60 px-3 py-1.5 text-center text-xs font-medium text-foreground">
                {crud.page} / {crud.totalPages}
              </div>
              <Button variant="outline" size="sm" disabled={!crud.hasNextPage} onClick={crud.nextPage}>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={crud.dialogOpen}
        user={crud.editingItem}
        submitting={crud.submitting}
        onOpenChange={crud.setDialogOpen}
        onSubmit={crud.submit}
      />
    </div>
  )
}
