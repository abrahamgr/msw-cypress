
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react'

const serverConfig: ServerOptions = {
  port: 3000,
  host: true,
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    ...serverConfig,
  },
  preview: {
    ...serverConfig,
  },
  test: {
    globals: true,
    setupFiles: 'src/setupTests.ts', 
    environment: 'jsdom',
    coverage: {
      provider: "v8",
      reporter: ["json", "html"]
    },
  }
})
