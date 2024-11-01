import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Altere a porta aqui
  },
  define: {
    global: 'window', // Isso define o global como window
  },
});
