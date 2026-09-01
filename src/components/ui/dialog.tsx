/**
 * [INPUT]: 依赖 Base UI Dialog primitive、React 组件属性类型、cn 工具及自动导入的 IconLucideX
 * [OUTPUT]: 对外提供 Dialog 根节点、触发/关闭能力及 Content/Header/Title/Description/Footer 组合组件
 * [POS]: components/ui 的对话框基础封装，为业务弹窗统一 Portal、遮罩、布局和关闭交互
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

type DialogContentProps = Omit<ComponentProps<typeof DialogPrimitive.Popup>, 'className' | 'children'> & {
  className?: string
  children: ReactNode
  showCloseButton?: boolean
}

type DialogTitleProps = Omit<ComponentProps<typeof DialogPrimitive.Title>, 'className'> & {
  className?: string
}

type DialogDescriptionProps = Omit<
  ComponentProps<typeof DialogPrimitive.Description>,
  'className'
> & {
  className?: string
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]" />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <DialogPrimitive.Popup
          className={cn(
            'relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl outline-none',
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close
              aria-label="关闭"
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconLucideX className="size-4" />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex flex-col gap-1.5', className)} {...props} />
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <DialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />
}
