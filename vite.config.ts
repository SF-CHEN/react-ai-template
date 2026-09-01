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
