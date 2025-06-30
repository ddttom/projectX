import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    host: true
  },
  build: {
    lib: {
      entry: 'spectrum-card.js',
      name: 'SpectrumCard',
      fileName: () => 'spectrum-card.js',
      formats: ['es'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    emptyOutDir: true,
  },
});
