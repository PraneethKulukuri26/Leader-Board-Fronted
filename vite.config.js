import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  proxy: {
    '/api': {
      target: 'http://180.188.227.250:7070',
      changeOrigin: true,
      secure: false,
    },
  }
})
