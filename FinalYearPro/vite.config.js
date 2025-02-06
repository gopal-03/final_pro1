import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "67f6-120-60-42-195.ngrok-free.app", // Replace this with your Ngrok URL
    ],
  },
  plugins: [react()],
})
