import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'copy-content-css',
      closeBundle() {
        fs.mkdirSync('dist/content', { recursive: true });
        if (fs.existsSync('src/content/content.css')) {
          fs.copyFileSync('src/content/content.css', 'dist/content/content.css');
          console.log('[build] content.css copied to dist/content/');
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content/content.ts'),
      name: 'BlindfeedContent',
      formats: ['iife'],
      fileName: () => 'content/content.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
