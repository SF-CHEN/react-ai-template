import { useSearchParams } from 'react-router'

import { userService, type UserStatus } from '@/api/user'
import { PageHeader } from '@/components/common/PageHeader'

import { UserFormDialog } from './UserFormDialog'
import { UserTable } from './UserTable'
import { userOptions } from './user.options'

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

  useEffect(() => {
    // 浏览器前进/后退会改变 URL，需要同步筛选草稿，避免界面显示与真实查询条件不一致
    setDraftKeyword(keyword)
    setDraftStatus(status ?? 'all')
  }, [keyword, status])

  const crud = useCrud(userService, {
    page,
    pageSize: PAGE_SIZE,
    keyword,
    status,
  })

  const totalPages = Math.max(1, Math.ceil(crud.total / PAGE_SIZE))
  const hasActiveFilters = Boolean(keyword || status)

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
    updateSearch({ page: 1, keyword: draftKeyword.trim(), status: draftStatus })
  }

  const handleReset = () => {
    setDraftKeyword('')
    setDraftStatus('all')

    const params = new URLSearchParams(searchParams)
    params.delete('page')
    params.delete('keyword')
    params.delete('status')
    setSearchParams(params)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="用户管理"
        description="标准 CRUD 示例：页面只保留查询条件、表格和表单，通用增删改查流程由 useCrud 负责。"
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
              查询条件写入 URL，增删改成功后 useCrud 自动刷新列表缓存。
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
                {hasActiveFilters ? (
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
              第 {page} 页，共 {totalPages} 页
              {hasActiveFilters ? <span className="ml-2">· 当前为筛选结果</span> : null}
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
              <div className="min-w-16 rounded-md bg-muted/60 px-3 py-1.5 text-center text-xs font-medium text-foreground">
                {page} / {totalPages}
              </div>
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
        open={crud.dialogOpen}
        user={crud.editingItem}
        submitting={crud.submitting}
        onOpenChange={crud.setDialogOpen}
        onSubmit={crud.submit}
      />
    </div>
  )
}
