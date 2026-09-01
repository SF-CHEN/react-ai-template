import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { init, use, type EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// Register only the chart capabilities used by the template demo to avoid bundling all of ECharts.
use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

export { init }
export type { EChartsCoreOption }
