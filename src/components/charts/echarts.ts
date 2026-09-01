import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { init, use, type EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 只注册模板示例实际使用的图表能力，避免把整个 ECharts 都打进 Bundle
use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

export { init }
export type { EChartsCoreOption }
