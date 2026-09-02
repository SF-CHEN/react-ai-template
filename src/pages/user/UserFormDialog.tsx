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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? '编辑用户' : '新增用户'}</DialogTitle>
          <DialogDescription>
            React Hook Form 管理表单状态，Zod 负责 Schema 与校验。
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input id="username" placeholder="请输入用户名" {...form.register('username')} />
            {form.formState.errors.username ? (
              <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="displayName">姓名</Label>
            <Input id="displayName" placeholder="请输入姓名" {...form.register('displayName')} />
            {form.formState.errors.displayName ? (
              <p className="text-xs text-destructive">{form.formState.errors.displayName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="name@example.com" {...form.register('email')} />
            {form.formState.errors.email ? (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            ) : null}
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
                    onValueChange={(value) => {
                      if (value) field.onChange(value)
                    }}
                  >
                    <SelectTrigger id="role">
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
                    onValueChange={(value) => {
                      if (value) field.onChange(value)
                    }}
                  >
                    <SelectTrigger id="status">
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
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            取消
          </Button>
          <Button form="user-form" type="submit" disabled={submitting}>
            {submitting ? '提交中…' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
