import type { User } from '@/api/user'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { formatDateTime } from '@/utils/format'

interface UserTableProps {
  data: User[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void | Promise<void>
}

const roleLabels: Record<User['role'], string> = {
  admin: '管理员',
  user: '普通用户',
  auditor: '审核员',
}

function userInitial(user: User) {
  return (user.displayName || user.username).trim().slice(0, 1).toUpperCase()
}

export function UserTable({
  data,
  loading = false,
  error,
  onRetry,
  onEdit,
  onDelete,
}: UserTableProps) {
  const columns: DataTableColumn<User>[] = [
    {
      label: '用户',
      prop: 'username',
      render: (user) => (
        <div className="flex min-w-44 items-center gap-3">
          <Avatar className="size-9 bg-primary/10 text-primary">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {userInitial(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{user.displayName}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      label: '邮箱',
      prop: 'email',
      className: 'text-muted-foreground',
    },
    {
      label: '角色',
      prop: 'role',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {roleLabels[user.role]}
        </Badge>
      ),
    },
    {
      label: '状态',
      prop: 'status',
      render: (user) => (
        <Badge variant={user.status === 'enabled' ? 'success' : 'secondary'}>
          <span className="mr-1.5 size-1.5 rounded-full bg-current opacity-70" />
          {user.status === 'enabled' ? '启用' : '禁用'}
        </Badge>
      ),
    },
    {
      label: '创建时间',
      prop: 'createdAt',
      className: 'whitespace-nowrap text-muted-foreground',
      render: (user) => formatDateTime(user.createdAt),
    },
    {
      label: '操作',
      key: 'actions',
      align: 'right',
      render: (user) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
            <IconLucidePencil className="size-3.5" />
            编辑
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
              <IconLucideTrash2 className="size-3.5" />
              删除
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认删除用户？</AlertDialogTitle>
                <AlertDialogDescription>
                  将删除用户「{user.displayName}」，此操作无法撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => void onDelete(user)}>
                  确认删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey="id"
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle="暂无匹配用户"
      emptyDescription="可以调整搜索关键词或状态筛选条件后重新查询。"
      emptyIcon={<IconLucideUsers />}
    />
  )
}
