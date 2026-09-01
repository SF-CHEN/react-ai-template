/**
 * [INPUT]: 依赖 Zustand create 与 persist 中间件管理和持久化全局客户端状态
 * [OUTPUT]: 对外提供 useAppStore 及侧边栏折叠状态/操作
 * [POS]: store 层的应用级客户端状态，只保存跨页面共享且需要持久化的布局偏好
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: 'react-ai-template:app',
      // 只持久化真正需要跨会话保留的布局偏好，避免把临时客户端状态一并写入 localStorage
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
)
