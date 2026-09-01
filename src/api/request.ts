/**
 * [INPUT]: 依赖 Axios、Vite 环境变量和浏览器 localStorage 中的访问令牌
 * [OUTPUT]: 对外提供统一配置的 request Axios 实例及请求/响应拦截器
 * [POS]: api 层的 HTTP 基础设施，为各业务 API 文件提供统一请求入口
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import axios from 'axios'

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
