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

    const resizeObserver = new ResizeObserver(() => chart.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
    }
  }, [option])

  return <div ref={containerRef} style={{ height }} className="w-full" />
}
