/**
 * [INPUT]: 依赖 React Router、AppLayout、业务路由配置、LoadingPage 与路由错误页
 * [OUTPUT]: 对外提供应用 browser router 实例
 * [POS]: app 层的路由装配入口，把单一业务路由配置连接到布局、懒加载和错误边界
 */
import { Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

import { LoadingPage } from '@/components/common/LoadingPage'
import { AppLayout } from '@/layouts/AppLayout'

import { AppErrorBoundary } from './ErrorBoundary'
import { appRoutes } from './routes'

const childRoutes: RouteObject[] = appRoutes.map(({ path, element }) => {
  const routeElement = <Suspense fallback={<LoadingPage />}>{element}</Suspense>

  if (path === '/') {
    return { index: true, element: routeElement }
  }

  return { path: path.replace(/^\//, ''), element: routeElement }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <AppErrorBoundary />,
    children: [...childRoutes, { path: '*', element: <Navigate to="/" replace /> }],
  },
])
