import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // equivale a host: '0.0.0.0'
    port: 5173,       // você pode mudar a porta, se quiser
    strictPort: false // tenta próxima porta caso a 5173 já esteja em uso
  }
})
