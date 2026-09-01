import { tableFeatures, useTable, type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'

import type { User } from '@/api/user'
import { formatDateTime } from '@/utils/format'

interface UserTableProps {
  data: User[]
  loading?: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const features = tableFeatures({})

const roleLabels: Record<User['role'], string> = {
  admin: '管理员',
  user: '普通用户',
  auditor: '审核员',
}

export function UserTable({ data, loading = false, onEdit, onDelete }: UserTableProps) {
  const columns: Array<ColumnDef<typeof features, User>> = [
    {
      accessorKey: 'username',
      header: '用户名',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.displayName}</div>
          <div className="text-xs text-muted-foreground">@{row.original.username}</div>
        </div>
      ),
    },
    { accessorKey: 'email', header: '邮箱' },
    {
      accessorKey: 'role',
      header: '角色',
      cell: ({ row }) => roleLabels[row.original.role],
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'enabled' ? 'success' : 'secondary'}>
          {row.original.status === 'enabled' ? '启用' : '禁用'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">操作</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
            <Pencil className="size-3.5" />
            编辑
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(row.original)}>
            <Trash2 className="size-3.5" />
            删除
          </Button>
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
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
                正在加载用户…
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
