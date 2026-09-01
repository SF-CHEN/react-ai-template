import dayjs from 'dayjs'

export function formatDateTime(value?: string | number | Date | null) {
  if (!value) return '-'
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}
