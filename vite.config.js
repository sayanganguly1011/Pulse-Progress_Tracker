import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    open: true,
  },
});
