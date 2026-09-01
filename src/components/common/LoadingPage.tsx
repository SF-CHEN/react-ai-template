/**
 * [INPUT]: 依赖项目全局 Tailwind 主题样式
 * [OUTPUT]: 对外提供 LoadingPage 路由懒加载占位组件
 * [POS]: components/common 的跨页面加载反馈组件，被 App 路由 Suspense 作为 fallback 使用
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
export function LoadingPage() {
  return (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
      正在加载页面…
    </div>
  )
}
