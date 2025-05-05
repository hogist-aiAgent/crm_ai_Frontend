import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
  server: {
    proxy: {
      '/api': {
        target: 'https://6d05-49-204-118-99.ngrok-free.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
