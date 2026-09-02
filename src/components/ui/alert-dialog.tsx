import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import type { ComponentProps } from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn('fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]', className)}
      {...props}
    />
  )
}

export function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <AlertDialogPrimitive.Popup
          className={cn(
            'w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl outline-none',
            className,
          )}
          {...props}
        />
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPortal>
  )
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />
}

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function AlertDialogAction({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<ButtonProps, 'variant' | 'size'>) {
  return (
    <AlertDialogPrimitive.Close
      className={className}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

export function AlertDialogCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<ButtonProps, 'variant' | 'size'>) {
  return (
    <AlertDialogPrimitive.Close
      className={className}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}
