import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,                                   // tools/postbuild.mjs reads it to preload each route's chunks
    rollupOptions: { output: { manualChunks: { vendor: ['react', 'react-dom'] } } },   // React in its own long-cached chunk
  },
})
