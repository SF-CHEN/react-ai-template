/**
 * [INPUT]: 依赖 TanStack Query 的 QueryClient、React 状态能力与 React Query Devtools
 * [OUTPUT]: 对外提供 AppProviders 应用级 Provider 组合组件
 * [POS]: app 层的全局上下文入口，为应用注入服务端状态缓存和开发调试能力
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type PropsWithChildren } from 'react'

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
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
