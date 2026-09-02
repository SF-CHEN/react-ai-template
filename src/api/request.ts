/**
 * [INPUT]: 依赖 Axios、Vite 环境变量和浏览器 localStorage 中的访问令牌
 * [OUTPUT]: 对外提供 request Axios 实例和直接返回响应 data 的 requestData<T>
 * [POS]: api 层 HTTP 基础设施，为手写 API 与 OpenAPI 生成 API 提供统一请求入口
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

/** 自动生成 API 统一通过这里剥离 AxiosResponse，页面和 Query 直接获得响应数据。 */
export async function requestData<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await request.request<T>(config)
  return response.data
}
