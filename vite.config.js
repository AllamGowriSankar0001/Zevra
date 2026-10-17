import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js is already dynamically imported in Hero.jsx,
    // so this just silences the expected large-chunk advisory.
    chunkSizeWarningLimit: 800,
  },
})
