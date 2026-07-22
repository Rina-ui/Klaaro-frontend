import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // Permet de gérer les bibliothèques qui cherchent process.env dans le navigateur
    'process.env': {},
  },
})