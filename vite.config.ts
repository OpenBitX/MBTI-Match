import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2'
import { createHtmlPlugin } from 'vite-plugin-html'
import sitemap from 'vite-plugin-sitemap'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // HTML 模板压缩 + SEO meta 注入
    createHtmlPlugin({ minify: true }),

    // SEO：自动生成 sitemap.xml（替换为真实域名）
    sitemap({ hostname: 'https://your-domain.com' }),

    // 静态资源 Gzip 压缩（服务器开启 gzip 静态服务时生效）
    compression({ algorithms: ['gzip'] }),

    // 静态资源 Brotli 压缩（比 gzip 更小，现代浏览器优先使用）
    compression({ algorithms: ['brotliCompress'], filename: '[path][base].br' }),

    // Bundle 体积可视化分析，build 后生成 docs/stats.html
    visualizer({ open: false, filename: 'docs/stats.html', gzipSize: true, brotliSize: true }),
  ],

  build: {
    // 输出到 docs 目录（适合 GitHub Pages 部署）
    outDir: 'docs',
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // JS 拆分 chunk + contenthash，利用浏览器长效缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 手动拆分：将 React 核心库单独打包为 vendor chunk
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            return 'chunks'
          }
        },
      },
    },
  },
})
