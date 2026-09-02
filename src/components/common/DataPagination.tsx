import type { HTMLAttributes, MouseEvent } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utils/cn'

interface DataPaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  className,
  ...props
}: DataPaginationProps) {
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const goTo = (event: MouseEvent<HTMLAnchorElement>, nextPage: number) => {
    event.preventDefault()
    onPageChange(nextPage)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <span>
        第 {page} 页，共 {totalPages} 页
      </span>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!hasPrevPage}
              onClick={(event) => {
                if (hasPrevPage) goTo(event, page - 1)
                else event.preventDefault()
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!hasNextPage}
              onClick={(event) => {
                if (hasNextPage) goTo(event, page + 1)
                else event.preventDefault()
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
