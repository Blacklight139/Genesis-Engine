import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron', // 输出目录
            lib: {
              entry: 'electron/main.ts',
              formats: ['cjs'] // 输出 CommonJS 格式
            },
            rollupOptions: {
              output: {
                entryFileNames: 'main.js' // 强制输出为 main.js
              }
            }
          }
        }
      }
    }),
    renderer()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './'
})