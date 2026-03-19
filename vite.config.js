import { defineConfig } from 'vite';
import { getPackageInfo, kebabToPascalCase } from './src/utils';

// 从 package.json 动态获取包名
const { packageName } = getPackageInfo();

// 将 kebab-case 转换为 PascalCase
const libName = kebabToPascalCase(packageName);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './src/index.js',
        'vite-plugin': './src/vite-plugin.js'
      },
      name: libName,
      fileName: (format, entryName) => {
        if (entryName === 'vite-plugin') {
          return `vite-plugin.${format === 'es' ? 'es' : 'js'}`;
        }
        return `index.${format === 'es' ? 'es' : 'js'}`;
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['webpack', 'adm-zip', 'child_process', 'fs', 'path'],
      output: {
        globals: {
          webpack: 'webpack',
          'adm-zip': 'AdmZip',
          'child_process': 'child_process',
          fs: 'fs',
          path: 'path'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: []
});