/**
 * [INPUT]: 依赖 React effect/ref、echarts.ts 提供的 init 与 EChartsCoreOption
 * [OUTPUT]: 对外提供 EChart 通用图表渲染组件
 * [POS]: charts 层的 React 封装，把 ECharts 命令式实例生命周期隔离在共享组件中
 */
import { useEffect, useRef } from 'react'

import { init, type EChartsCoreOption } from './echarts'

interface EChartProps {
  option: EChartsCoreOption
  height?: number
}

export function EChart({ option, height = 320 }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof init> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ECharts 实例只初始化一次；option 更新由独立 effect 处理，避免每次更新都 dispose + init
    const chart = init(container)
    chartRef.current = chart

    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true })
  }, [option])

  return <div ref={containerRef} style={{ height }} className="w-full" />
}
