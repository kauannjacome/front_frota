import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false
  },
  preview: {
    host: '0.0.0.0',  // escuta em todas as interfaces
    port: parseInt(process.env.PORT) || 4173,
    allowedHosts: [
      'front-frota-simplificada-991de2926ab5.herokuapp.com'
    ]
  }
})
