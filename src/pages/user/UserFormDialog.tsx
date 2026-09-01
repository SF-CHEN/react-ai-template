/**
 * [INPUT]: 依赖 React Hook Form、Zod Resolver、User 模型、userFormSchema 及自动导入的 Dialog/Form UI
 * [OUTPUT]: 对外提供 UserFormDialog 用户新增/编辑表单弹窗组件
 * [POS]: pages/user 的页面专用表单组件，由 index.tsx 控制打开状态并提交用户表单数据
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { User } from '@/api/user'

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

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

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
              <Select id="role" {...form.register('role')}>
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
                <option value="auditor">审核员</option>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">状态</Label>
              <Select id="status" {...form.register('status')}>
                <option value="enabled">启用</option>
                <option value="disabled">禁用</option>
              </Select>
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
