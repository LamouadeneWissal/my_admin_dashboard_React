import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-is': path.resolve(__dirname, 'node_modules/react-is'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime')
    }
  },
  optimizeDeps: {
    include: ['react-is']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
