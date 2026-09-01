/**
 * [INPUT]: 依赖 React 懒加载、React Router、LoadingPage、AppLayout 与业务页面入口
 * [OUTPUT]: 对外提供 App 根路由组件
 * [POS]: app 层的路由入口，连接应用布局、页面级懒加载和兜底路由
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { LoadingPage } from '@/components/common/LoadingPage'
import { AppLayout } from '@/layouts/AppLayout'

const DashboardPage = lazy(() => import('@/pages/dashboard'))
const UserListPage = lazy(() => import('@/pages/user'))

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
