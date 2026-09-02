import {
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'
import { DatabaseIcon, TriangleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const features = tableFeatures({})

export type DataTableFeatures = typeof features
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyState?: ReactNode
  getRowId?: (row: TData, index: number) => string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  loading = false,
  error,
  onRetry,
  emptyState,
  getRowId,
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    columns,
    data,
    getRowId,
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
                    <Skeleton className={columnIndex === 0 ? 'h-9 w-36' : 'h-4 w-20'} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-52 p-0 text-center">
                <Empty className="min-h-52">
                  <EmptyHeader>
                    <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                      <TriangleAlertIcon />
                    </EmptyMedia>
                    <EmptyTitle>加载失败</EmptyTitle>
                    <EmptyDescription>{error}</EmptyDescription>
                  </EmptyHeader>
                  {onRetry ? (
                    <EmptyContent>
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        重新加载
                      </Button>
                    </EmptyContent>
                  ) : null}
                </Empty>
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
              <TableCell colSpan={columns.length} className="h-52 p-0 text-center">
                {emptyState ?? (
                  <Empty className="min-h-52">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <DatabaseIcon />
                      </EmptyMedia>
                      <EmptyTitle>暂无数据</EmptyTitle>
                      <EmptyDescription>当前没有可展示的数据。</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
