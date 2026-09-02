import { NavLink, Outlet, useLocation } from 'react-router'

import { appRoutes, navItems } from '@/app/routes'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/utils/cn'

export function AppLayout() {
  const location = useLocation()
  const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const currentRoute = appRoutes.find(({ path }) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path),
  )

  return (
    <div className="min-h-dvh bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-border/80 bg-card transition-[width] duration-200 lg:flex lg:flex-col',
          sidebarCollapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/70 px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <IconLucideChartBar className="size-5" />
          </div>
          {sidebarCollapsed ? null : (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight">React AI Template</div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">AI-first admin starter</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {sidebarCollapsed ? null : (
            <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
              工作区
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={sidebarCollapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-0',
                  )
                }
              >
                <Icon className="size-[18px] shrink-0" />
                {sidebarCollapsed ? null : <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {sidebarCollapsed ? null : (
          <div className="m-3 rounded-xl border border-border/80 bg-muted/35 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-500" />
              模板基础能力已就绪
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
              React 19 · Query · shadcn/ui · ECharts
            </p>
          </div>
        )}
      </aside>

      <div
        className={cn(
          'min-h-dvh transition-[padding] duration-200',
          sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconLucideChartBar className="size-4" />
                </div>
                <span className="hidden text-sm font-semibold sm:inline">React AI Template</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="切换侧边栏"
                className="hidden lg:inline-flex"
              >
                {sidebarCollapsed ? (
                  <IconLucideChevronRight className="size-4" />
                ) : (
                  <IconLucideChevronLeft className="size-4" />
                )}
              </Button>

              <div className="hidden h-5 w-px bg-border lg:block" />
              <div className="truncate text-sm font-medium text-foreground">
                {currentRoute?.label ?? 'React AI Template'}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Development</span>
              <span className="sm:hidden">Dev</span>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 lg:hidden">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
