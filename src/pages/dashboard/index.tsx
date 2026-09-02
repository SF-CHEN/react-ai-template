import { useNavigate } from 'react-router'

import type { EChartsCoreOption } from '@/components/charts/echarts'

import { EChart } from '@/components/charts/EChart'
import { PageHeader } from '@/components/common/PageHeader'

const trendOption: EChartsCoreOption = {
  color: ['#4f46e5'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 0,
    textStyle: { color: '#f8fafc' },
  },
  grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#94a3b8' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#94a3b8' },
    splitLine: { lineStyle: { color: '#eef2f7' } },
  },
  series: [
    {
      name: '请求量',
      type: 'line',
      smooth: true,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 3 },
      areaStyle: { opacity: 0.08 },
      emphasis: { focus: 'series' },
      data: [320, 420, 390, 560, 610, 720, 680],
    },
  ],
}

const metrics = [
  {
    title: '总用户',
    value: '1,284',
    change: '+12.5%',
    helper: '较上月增长',
    icon: IconLucideUsers,
  },
  {
    title: '今日请求',
    value: '8,642',
    change: '+8.2%',
    helper: '较昨日增长',
    icon: IconLucideActivity,
  },
  {
    title: '服务可用率',
    value: '99.9%',
    change: '稳定',
    helper: '过去 24 小时',
    icon: IconLucideShieldCheck,
  },
  {
    title: '数据集',
    value: '326',
    change: '+14',
    helper: '本周新增',
    icon: IconLucideDatabase,
  },
]

const capabilities = [
  {
    title: '页面优先架构',
    description: '业务代码默认就近组织，复杂后再拆层。',
    icon: IconLucideLayoutDashboard,
  },
  {
    title: '服务端状态管理',
    description: 'TanStack Query 负责缓存、请求与 Mutation。',
    icon: IconLucideActivity,
  },
  {
    title: '统一 UI 基线',
    description: 'shadcn/ui + Tailwind 作为页面和交互基础。',
    icon: IconLucideChartBar,
  },
  {
    title: '类型安全数据流',
    description: '表单、Schema、API 与页面保持明确边界。',
    icon: IconLucideShieldCheck,
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="工作台"
        description="一个用于展示模板默认信息层级、数据卡片和图表组合方式的基础后台页面。"
        actions={
          <Button variant="outline" onClick={() => navigate('/users')}>
            <IconLucideUsers className="size-4" />
            用户管理
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value, change, helper, icon: Icon }) => (
          <Card key={title} className="overflow-hidden border-border/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-3 text-xs">
                <span className="font-medium text-emerald-600">{change}</span>
                <span className="text-muted-foreground">{helper}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="min-w-0 border-border/80">
          <CardHeader className="border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>请求趋势</CardTitle>
              <CardDescription className="mt-1">最近 7 天请求量变化，用于演示 ECharts 页面接入方式。</CardDescription>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground sm:mt-0">
              <span className="size-2 rounded-full bg-primary" />
              请求量
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <EChart option={trendOption} height={360} />
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle>模板能力</CardTitle>
            <CardDescription>这些模式会作为 AI 生成新页面时的默认参考。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 pt-3">
            {capabilities.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{title}</div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 bg-muted/20">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">架构策略</p>
            <p className="mt-2 text-sm font-medium">先页面内聚，再按复杂度渐进拆分</p>
          </div>
          <div className="border-border sm:border-l sm:pl-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">状态归属</p>
            <p className="mt-2 text-sm font-medium">Query / Zustand / React / URL 各司其职</p>
          </div>
          <div className="border-border sm:border-l sm:pl-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">生成目标</p>
            <p className="mt-2 text-sm font-medium">让 AI 代码默认可读、可找、可维护</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
