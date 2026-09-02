import { lazy } from 'react'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UserListPage = lazy(() => import('@/pages/user'))

export const appRoutes = [
  {
    path: '/',
    label: '工作台',
    icon: IconLucideLayoutDashboard,
    element: <DashboardPage />,
  },
  {
    path: '/users',
    label: '用户管理',
    icon: IconLucideUsers,
    element: <UserListPage />,
  },
] as const

export const navItems = appRoutes.map(({ path, label, icon }) => ({
  to: path,
  label,
  icon,
  end: path === '/',
}))
