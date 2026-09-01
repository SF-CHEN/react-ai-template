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

    // ECharts owns an imperative canvas instance, so useEffect is the correct boundary for syncing it.
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
