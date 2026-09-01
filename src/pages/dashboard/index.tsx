import type { EChartsCoreOption } from '@/components/charts/echarts'
import { Activity, Database, ShieldCheck, Users } from 'lucide-react'

import { EChart } from '@/components/charts/EChart'
import { PageHeader } from '@/components/common/PageHeader'

const trendOption: EChartsCoreOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 12, right: 12, top: 24, bottom: 8, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#eef0f4' } } },
  series: [
    {
      name: '请求量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      areaStyle: { opacity: 0.08 },
      data: [320, 420, 390, 560, 610, 720, 680],
    },
  ],
}

const metrics = [
  { title: '用户数', value: '1,284', change: '+12.5%', icon: Users },
  { title: '今日请求', value: '8,642', change: '+8.2%', icon: Activity },
  { title: '数据集', value: '326', change: '+4.1%', icon: Database },
  { title: '安全状态', value: '正常', change: '99.9%', icon: ShieldCheck },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="工作台"
        description="这里放模板的基础 Dashboard Demo，业务项目可直接替换。"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value, change, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs text-emerald-600">{change}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>请求趋势</CardTitle>
          <CardDescription>ECharts 封装示例：页面只传 option，不直接管理实例。</CardDescription>
        </CardHeader>
        <CardContent>
          <EChart option={trendOption} height={340} />
        </CardContent>
      </Card>
    </div>
  )
}
