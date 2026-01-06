import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'frontend', // Le decimos que el frontend está en esa carpeta
  server: {
    port: 5173
  }
})