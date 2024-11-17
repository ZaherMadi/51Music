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
    outDir: 'dist'  // Dossier de sortie
  }
})

