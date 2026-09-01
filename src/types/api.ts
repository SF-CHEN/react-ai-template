/**
 * [INPUT]: 依赖 TypeScript 泛型表达统一接口响应与分页数据结构
 * [OUTPUT]: 对外提供 ApiResponse<T> 与 PageResponse<T> 公共类型
 * [POS]: types 层的跨业务 API 公共类型，仅承载多个接口共享的数据包装结构
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageResponse<T> {
  list: T[]
  total: number
}
