/**
 * [INPUT]: 依赖 Axios、Vite 环境变量和浏览器 localStorage 中的访问令牌
 * [OUTPUT]: 对外提供 request Axios 实例，以及直接返回响应 data 的 requestData<T> 请求函数
 * [POS]: api 层的 HTTP 基础设施，为手写业务 API 与 script 自动生成 API 提供统一请求入口
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md、react-data 与 code-comments Skill
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
 * 自动生成 API 只关心后端响应数据，因此在请求层统一剥离 AxiosResponse。
 * 页面 Query 和业务 API 可以直接获得 T，避免每个生成函数重复读取 response.data。
 */
export async function requestData<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await request.request<T>(config)
  return response.data
}
