import { BarChart3, ChevronLeft, ChevronRight, LayoutDashboard, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: '工作台', icon: LayoutDashboard, end: true },
  { to: '/users', label: '用户管理', icon: Users },
]

export function AppLayout() {
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 border-r border-border bg-card transition-[width] duration-200',
          sidebarCollapsed ? 'w-[72px]' : 'w-60',
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="size-5" />
          </div>
          {sidebarCollapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">React AI Template</div>
              <div className="truncate text-xs text-muted-foreground">Progressive Page Architecture</div>
            </div>
          )}
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {sidebarCollapsed ? null : <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={cn('transition-[padding] duration-200', sidebarCollapsed ? 'pl-[72px]' : 'pl-60')}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="切换侧边栏">
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
          <div className="text-sm text-muted-foreground">React + Vite + shadcn/ui</div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
