import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://bannerstudio.pages.dev',
  base: '/',
  outDir: 'dist',
  publicDir: 'public',

  integrations: [
    react(),
    tailwind({ configFile: './tailwind.config.mjs', applyBaseStyles: false }),
  ],

  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@data': '/src/data',
        '@styles': '/src/styles',
      },
    },
  },

  build: { inlineStylesheets: 'auto' },
  server: { port: 4321, host: true },
  devToolbar: { enabled: false },
})
