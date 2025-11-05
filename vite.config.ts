import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    outDir: 'public/assets',
    manifest: true,
    rollupOptions: {
      input: ['resources/js/app.ts', 'resources/css/app.css'],
    },
    chunkSizeWarningLimit: 1600,
  },
  plugins: [
    tailwindcss(),
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/css/app.css', 'resources/js/app.ts'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'lythraceous-stevie-unethnologic.ngrok-free.dev',
      'bisikin.rwa.my.id',
    ],
  },
})
