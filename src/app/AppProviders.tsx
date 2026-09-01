/**
 * [INPUT]: 依赖 TanStack Query 的 QueryClient、React 状态能力与 BrowserRouter
 * [OUTPUT]: 对外提供 AppProviders 应用级 Provider 组合组件
 * [POS]: app 层的上下文入口，为 App 注入查询缓存和浏览器路由环境
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router'

export function AppProviders({ children }: PropsWithChildren) {
  // QueryClient 必须在多次渲染之间保持稳定，否则每次渲染都会重新创建整套查询缓存
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}
