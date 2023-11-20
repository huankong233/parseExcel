import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     // 生产环境时移除console
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js', // 产生的 chunk 自定义命名
        entryFileNames: 'assets/js/[name]-[hash].js', // 指定 chunks 的入口文件匹配模式
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]', // 自定义构建结果中的静态资源名称，资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('lodash-es')) return 'lodash'
          if (id.includes('xlsx')) return 'xlsx'
          if (id.includes('jszip')) return 'jszip'
          if (id.includes('file-saver')) return 'fileSaver'
          if (id.includes('element-plus/es')) return 'elementPlusEs'
          if (id.includes('element-plus/theme')) return 'elementPlusTheme'
          if (id.includes('node_modules')) return 'vendor'
        }
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: 'stats.html'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
