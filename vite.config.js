import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/',
  server: {
    proxy : {
      '/api' : {
        // target: 'http://localhost:5134/',
        target: 'https://ime-oa.inventec.com:471/',
        changeOrigin : true,
        secure: false
      }
    }
  },
})
