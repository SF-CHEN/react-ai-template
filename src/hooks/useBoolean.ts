/**
 * [INPUT]: 依赖 React useState 管理布尔状态
 * [OUTPUT]: 对外提供 useBoolean 通用 Hook 及 setTrue/setFalse/toggle/setValue 操作
 * [POS]: hooks 层的跨页面通用布尔状态工具，通过自动导入供简单开关状态复用
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { useState } from 'react'

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    toggle: () => setValue((current) => !current),
    setValue,
  }
}
