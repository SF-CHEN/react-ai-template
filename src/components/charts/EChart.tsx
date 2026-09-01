/**
 * [INPUT]: 依赖 React effect/ref、echarts.ts 提供的 init 与 EChartsCoreOption 类型
 * [OUTPUT]: 对外提供 EChart 通用图表渲染组件
 * [POS]: components/charts 的 React 封装层，把 ECharts 命令式实例生命周期隔离在共享组件中
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { useEffect, useRef } from 'react'

import { init, type EChartsCoreOption } from './echarts'

interface EChartProps {
  option: EChartsCoreOption
  height?: number
}

export function EChart({ option, height = 320 }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // ECharts 自己维护命令式 Canvas 实例，因此这里使用 useEffect 负责与 React 生命周期同步
    const chart = init(containerRef.current)
    chart.setOption(option)

    // ResizeObserver 只观察当前图表容器，避免把窗口 resize 监听散落到每个业务页面
    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [option])

  return <div ref={containerRef} style={{ height }} className="w-full" />
}
