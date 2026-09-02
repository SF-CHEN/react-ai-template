/**
 * [INPUT]: 依赖 Axios、Vite 环境变量和浏览器 localStorage 中的访问令牌
 * [OUTPUT]: 对外提供 request Axios 实例、requestData 数据请求函数及请求/响应拦截器
 * [POS]: api 层的 HTTP 基础设施，为手写 API 与 Swagger 自动生成 API 提供统一请求入口
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-02 08:40:00
 */
import axios, { type AxiosRequestConfig } from 'axios'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

/**
 * 返回接口响应体，供 TanStack Query 和自动生成 API 直接消费业务数据。
 */
export async function requestData<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await request.request<T>(config)
  return response.data
}
