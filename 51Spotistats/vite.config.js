// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 6510 
  },
  esbuild: {
    target: 'esnext'  // Permet de supporter le top-level await
  }
})

