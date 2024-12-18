// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 6510,
    open: true 
  },
  esbuild: {
    target: 'esnext'  //Permet de supporter le top-level await
  },
  build: {
    outDir: 'dist',  // Dossier de sortie
    rollupOptions: {
      input: './index.html',
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  }
})

