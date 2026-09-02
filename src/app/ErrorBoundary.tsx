import { isRouteErrorResponse, useRouteError } from 'react-router'

export function AppErrorBoundary() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText || '页面错误'}`
    : '页面加载失败'
  const description =
    error instanceof Error ? error.message : '页面发生了未预期的错误，请返回首页后重试。'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <IconLucideTriangleAlert className="size-5" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Button className="mt-6" onClick={() => window.location.assign('/')}>
          返回首页
        </Button>
      </div>
    </main>
  )
}
