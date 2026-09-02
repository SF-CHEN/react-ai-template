import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/utils/cn'

export function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center',
        className,
      )}
      {...props}
    />
  )
}

export function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex max-w-sm flex-col items-center gap-1.5', className)} {...props} />
}

const emptyMediaVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: '',
      icon: 'size-10 rounded-full bg-muted text-muted-foreground [&_svg]:size-5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return <div className={cn(emptyMediaVariants({ variant }), className)} {...props} />
}

export function EmptyTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

export function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-xs leading-5 text-muted-foreground', className)}
      {...props}
    />
  )
}

export function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-center gap-2', className)} {...props} />
}
