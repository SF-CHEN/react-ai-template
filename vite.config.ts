/**
 * [INPUT]: 依赖 Vite、React、Tailwind CSS、unplugin-auto-import 与 unplugin-icons 的构建插件能力
 * [OUTPUT]: 对外提供 Vite 构建、路径别名、React/UI/Hook/Lucide 自动导入配置
 * [POS]: 工程配置层的 Vite 入口，连接源码自动导入、图标解析和构建流程
 * [PROTOCOL]: 变更时同步更新此头部，并检查 AGENTS.md 与相关 Skill
 * [TIME]: 2026-09-01 17:41:04
 */
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    AutoImport({
      imports: ['react'],
      dirs: ['./src/components/ui', './src/hooks'],
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'jsx',
          enabledCollections: ['lucide'],
        }),
      ],
      dts: './src/auto-imports.d.ts',
    }),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
