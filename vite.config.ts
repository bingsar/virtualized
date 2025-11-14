import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  cacheDir: '.vite-cache',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/shared/styles/variables" as *;
          @use "@/shared/styles/mixins" as *;
        `,
      },
    },
  },
  server: {
    proxy: {
      '/wows': {
        target: 'https://vortex.worldofwarships.eu',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/wows/, '/api/encyclopedia/en'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
