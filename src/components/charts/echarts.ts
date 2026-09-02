/**
 * [INPUT]: 依赖 ECharts Core、LineChart、Grid/Tooltip 组件和 CanvasRenderer
 * [OUTPUT]: 对外提供已注册必要能力的 init 函数与 EChartsCoreOption 类型
 * [POS]: charts 层的 ECharts 按需注册入口，用于控制公共图表能力和 Bundle 范围
 */
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { init, use, type EChartsCoreOption } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 只注册模板示例实际使用的图表能力，避免把整个 ECharts 都打进 Bundle
use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

export { init }
export type { EChartsCoreOption }
