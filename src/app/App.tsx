import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import { LoadingPage } from '@/components/common/LoadingPage'
import { AppLayout } from '@/layouts/AppLayout'

const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'))
const UserListPage = lazy(() => import('@/modules/user/pages/UserListPage'))

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
