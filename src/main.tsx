/**
 * [INPUT]: 依赖 React DOM、App 根组件、AppProviders 和全局样式
 * [OUTPUT]: 对外提供浏览器端 React 应用挂载入口
 * [POS]: 应用启动层的唯一 DOM 挂载点，连接 index.html 与 app 层
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App'
import { AppProviders } from '@/app/AppProviders'
import '@/styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
