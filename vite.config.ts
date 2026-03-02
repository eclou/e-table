import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      name: 'ETable',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // externalize deps that shouldn’t be bundled
      external: ['vue', 'axios', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          axios: 'axios',
          'element-plus': 'ElementPlus',
        },
      },
    },
    outDir: 'dist',
  },
})
