import type { User } from '@/api/user'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
      accessorKey: 'username',
      header: '用户',
      cell: ({ row }) => (
        <div className="flex min-w-44 items-center gap-3">
          <Avatar className="size-9 bg-primary/10 text-primary">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {userInitial(row.original)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{row.original.displayName}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">@{row.original.username}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: '邮箱',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: 'role',
      header: '角色',
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
          {roleLabels[row.original.role]}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'enabled' ? 'success' : 'secondary'}>
          <span className="mr-1.5 size-1.5 rounded-full bg-current opacity-70" />
          {row.original.status === 'enabled' ? '启用' : '禁用'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
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
                  将删除用户「{row.original.displayName}」，此操作无法撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => void onDelete(row.original)}
                >
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
      loading={loading}
      error={error}
      onRetry={onRetry}
      getRowId={(user) => String(user.id)}
      emptyState={
        <Empty className="min-h-52">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconLucideUsers />
            </EmptyMedia>
            <EmptyTitle>暂无匹配用户</EmptyTitle>
            <EmptyDescription>可以调整搜索关键词或状态筛选条件后重新查询。</EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  )
}
