import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ 
      insertTypesEntry: true, // 自动在 package.json 的 types 字段生成入口
      cleanVueFileName: true, // 清理文件名中的 .vue 后缀
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts'],
      entryRoot: 'src',
      outDir: 'dist/types',
      copyDtsFiles: true,
    })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ETable',
      fileName: 'index',
      formats: ['es', 'umd'],
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
