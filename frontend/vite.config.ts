import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,  // Verifique se está configurado corretamente
    host: '0.0.0.0',  // Certifique-se de que o Vite está ouvindo em todas as interfaces
  }
})
