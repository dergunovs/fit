/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';

function removeDataTest(node) {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop) => (prop.type === 6 ? prop.name !== 'data-test' : true));
  }
}

export default defineConfig({
  server: { port: 8080 },

  build: { target: 'esnext' },

  resolve: { alias: { '@': resolve(__dirname, './src/modules') } },

  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },

  plugins: [
    vue({
      template: {
        compilerOptions: { nodeTransforms: process.env.NODE_ENV === 'production' ? [removeDataTest] : [] },
      },
    }),
    svgLoader(),
    VitePWA({
      manifest: {
        name: 'FiT',
        short_name: 'FiT',
        description: 'Фитнес трекер',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'ru',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
    { name: 'vitest-setup', config: () => ({ test: { setupFiles: ['./vitest.setup.ts'] } }) },
  ],

  test: {
    alias: { '@': resolve(__dirname, './src/modules') },
    cache: false,
    clearMocks: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    coverage: { provider: 'v8', reporter: ['text'], include: ['**/*.vue'], all: true },
    css: false,
    deps: { inline: true },
  },
});
