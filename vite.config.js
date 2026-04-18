import { defineConfig } from 'vite';

export default defineConfig({
  // ── Dev server ──────────────────────────────────────────────────────────
  server: {
    port: 5173,
    open: true,
  },

  // ── Production build ────────────────────────────────────────────────────
  build: {
    outDir:        'dist',
    emptyOutDir:   true,
    sourcemap:     true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          chartjs: ['chart.js'],
        },
      },
    },
  },

  // ── Path aliases  ────────────────────────
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
