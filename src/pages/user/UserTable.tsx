import { tableFeatures, useTable, type ColumnDef } from '@tanstack/react-table'

import type { User } from '@/api/user'
import { formatDateTime } from '@/utils/format'

interface UserTableProps {
  data: User[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void | Promise<void>
}

const features = tableFeatures({})

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
  const columns: Array<ColumnDef<typeof features, User>> = [
    {
      accessorKey: 'username',
      header: '用户',
      cell: ({ row }) => (
        <div className="flex min-w-44 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {userInitial(row.original)}
          </div>
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

  const table = useTable({
    features,
    columns,
    data,
  })

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-10 text-xs font-semibold uppercase tracking-wide">
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <TableRow key={`loading-${rowIndex}`} className="hover:bg-transparent">
                {columns.map((_, columnIndex) => (
                  <TableCell key={`loading-${rowIndex}-${columnIndex}`}>
                    <div
                      className={
                        columnIndex === 0
                          ? 'h-9 w-36 animate-pulse rounded-md bg-muted'
                          : 'h-4 w-20 animate-pulse rounded bg-muted'
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <IconLucideActivity className="size-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-foreground">加载失败</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{error}</p>
                  {onRetry ? (
                    <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                      重新加载
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-52 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <IconLucideUsers className="size-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-foreground">暂无匹配用户</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    可以调整搜索关键词或状态筛选条件后重新查询。
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
