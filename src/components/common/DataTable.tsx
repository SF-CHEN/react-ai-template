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
import { cn } from '@/utils/cn'

export interface DataTableColumn<TData> {
  label: ReactNode
  prop?: keyof TData
  key?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  render?: (row: TData, index: number) => ReactNode
}

interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  rowKey: keyof TData | ((row: TData, index: number) => string | number)
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

function renderValue(value: unknown) {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}

function getColumnKey<TData>(column: DataTableColumn<TData>, index: number) {
  return column.key ?? String(column.prop ?? index)
}

function getRowKey<TData>(
  row: TData,
  index: number,
  rowKey: DataTableProps<TData>['rowKey'],
) {
  const value = typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey]
  return typeof value === 'string' || typeof value === 'number' ? value : String(value)
}

export function DataTable<TData>({
  columns,
  data,
  rowKey,
  loading = false,
  error,
  onRetry,
  emptyTitle = '暂无数据',
  emptyDescription = '当前没有可展示的数据。',
  emptyIcon = <DatabaseIcon />,
}: DataTableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => {
              const align = column.align ?? 'left'

              return (
                <TableHead
                  key={getColumnKey(column, index)}
                  className={cn(
                    'h-10 text-xs font-semibold uppercase tracking-wide',
                    alignClass[align],
                    column.headerClassName,
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }, (_, rowIndex) => (
              <TableRow key={`loading-${rowIndex}`} className="hover:bg-transparent">
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={`${getColumnKey(column, columnIndex)}-${rowIndex}`}
                    className={cn(alignClass[column.align ?? 'left'], column.className)}
                  >
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
          ) : data.length ? (
            data.map((row, rowIndex) => (
              <TableRow key={getRowKey(row, rowIndex, rowKey)} className="hover:bg-muted/30">
                {columns.map((column, columnIndex) => {
                  const content = column.render
                    ? column.render(row, rowIndex)
                    : column.prop
                      ? renderValue(row[column.prop])
                      : null

                  return (
                    <TableCell
                      key={getColumnKey(column, columnIndex)}
                      className={cn(alignClass[column.align ?? 'left'], column.className)}
                    >
                      {content}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-52 p-0 text-center">
                <Empty className="min-h-52">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">{emptyIcon}</EmptyMedia>
                    <EmptyTitle>{emptyTitle}</EmptyTitle>
                    <EmptyDescription>{emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
