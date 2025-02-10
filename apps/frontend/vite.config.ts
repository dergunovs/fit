/// <reference types="vitest/config" />

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
  server: {
    port: 8080,
    headers: {
      'Content-Security-Policy': `default-src 'self';img-src 'self' data: localhost:5000 https://app-fit.ru;script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline';connect-src 'self' localhost:5000 https://app-fit.ru https://registry.npmjs.org;frame-src 'self';`,
    },
  },

  build: { target: 'es2022' },

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
      registerType: 'prompt',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
      manifest: {
        name: 'FiT',
        start_url: '/',
        scope: '/',
        short_name: 'FiT',
        description: 'Фитнес трекер домашних тренировок FiT',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'ru',
        orientation: 'natural',
        categories: ['fitness', 'sports'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],

  test: {
    clearMocks: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text'],
      include: ['src/modules/**/*.vue', 'src/modules/**/helpers/*.ts'],
      all: true,
    },
    css: false,
    deps: { inline: true },
  },
});
