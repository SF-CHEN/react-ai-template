import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'

import { cn } from '@/utils/cn'

export function Avatar({
  className,
  size = 'default',
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: 'default' | 'sm' | 'lg'
}) {
  return (
    <AvatarPrimitive.Root
      data-size={size}
      className={cn(
        'group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full data-[size=sm]:size-7 data-[size=lg]:size-10',
        className,
      )}
      {...props}
    />
  )
}

export function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
