import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no list is provided, adds all polyfills
      include: ['buffer', 'crypto', 'stream', 'util'],
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // This is needed to avoid the buffer error
      buffer: 'buffer/'
    }
  },
  define: {
    // This is needed to make the buffer module available
    'process.env': {},
    'global': {}
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
