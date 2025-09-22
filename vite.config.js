import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your framework

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all addresses
    port: 5173,
    strictPort: true,
    // allow ngrok host
    allowedHosts: [
      'all'
    ]
  }
})
