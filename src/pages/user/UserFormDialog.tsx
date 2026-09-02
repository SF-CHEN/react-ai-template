import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import type { User } from '@/api/user'

import { userOptions } from './user.options'
import { userFormSchema, type UserFormData } from './user.schema'

interface UserFormDialogProps {
  open: boolean
  user?: User | null
  submitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: UserFormData) => Promise<void>
}

function getDefaultValues(user?: User | null): UserFormData {
  return {
    username: user?.username ?? '',
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'user',
    status: user?.status ?? 'enabled',
  }
}

export function UserFormDialog({
  open,
  user,
  submitting = false,
  onOpenChange,
  onSubmit,
}: UserFormDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: getDefaultValues(user),
  })

  useEffect(() => {
    if (!open) return

    // React Hook Form 只在首次初始化 defaultValues，切换新增/编辑对象时需要主动重置表单
    form.reset(getDefaultValues(user))
  }, [form, open, user])

  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{user ? '编辑用户' : '新增用户'}</DialogTitle>
          <DialogDescription>
            填写用户基础信息并设置角色与状态，保存成功后列表会自动刷新。
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                disabled={submitting}
                aria-invalid={Boolean(form.formState.errors.username)}
                {...form.register('username')}
              />
              {form.formState.errors.username ? (
                <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="displayName">姓名</Label>
              <Input
                id="displayName"
                placeholder="请输入姓名"
                disabled={submitting}
                aria-invalid={Boolean(form.formState.errors.displayName)}
                {...form.register('displayName')}
              />
              {form.formState.errors.displayName ? (
                <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={submitting}
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            ) : null}
          </div>

          <div className="border-t border-border/70 pt-5">
            <div className="mb-3">
              <div className="text-sm font-medium">权限与状态</div>
              <p className="mt-1 text-xs text-muted-foreground">角色决定用户职责，状态控制是否可以正常使用系统。</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="role">角色</Label>
                <Controller
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      items={userOptions.role}
                      value={field.value}
                      inputRef={field.ref}
                      disabled={submitting}
                      onValueChange={(value) => {
                        if (value) field.onChange(value)
                      }}
                    >
                      <SelectTrigger id="role" onBlur={field.onBlur}>
                        <SelectValue placeholder="请选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        {userOptions.role.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">状态</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      items={userOptions.status}
                      value={field.value}
                      inputRef={field.ref}
                      disabled={submitting}
                      onValueChange={(value) => {
                        if (value) field.onChange(value)
                      }}
                    >
                      <SelectTrigger id="status" onBlur={field.onBlur}>
                        <SelectValue placeholder="请选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        {userOptions.status.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-border/70 pt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            取消
          </Button>
          <Button form="user-form" type="submit" disabled={submitting}>
            {submitting ? '保存中…' : user ? '保存修改' : '创建用户'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
