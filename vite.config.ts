import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE_PUBLICA } from './src/rutas-publicas.ts'

export default defineConfig({
  base: BASE_PUBLICA,
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})
