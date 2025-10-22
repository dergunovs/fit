/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { removeDataTest } from 'mhz-helpers';

export default defineConfig({
  clearScreen: false,

  server: {
    port: 8080,
    strictPort: true,
    headers: {
      'Content-Security-Policy': `default-src 'self';img-src 'self' data: localhost:5000 https://app-fit.ru;script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline';connect-src 'self' localhost:5000 https://app-fit.ru 'self';`,
    },
  },

  build: { target: 'es2022' },

  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src/modules') } },

  plugins: [
    vue({
      template: {
        compilerOptions: { nodeTransforms: process.env.NODE_ENV === 'production' ? [removeDataTest] : [] },
      },
    }),
    svgLoader(),
    VueI18nPlugin({
      include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/modules/common/locales/**'),
    }),
    VitePWA({
      registerType: 'prompt',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
      manifest: {
        name: 'FiT',
        short_name: 'FiT',
        description: 'FiT',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'ru',
        orientation: 'natural',
        categories: ['fitness', 'sports', 'health'],
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
      provider: 'v8',
      reporter: ['text'],
      include: [
        'src/modules/**/*.vue',
        'src/modules/**/helpers/*.ts',
        'src/modules/**/composables/*.ts',
        'src/modules/**/services/*.ts',
      ],
    },
    css: false,
    server: {
      deps: { inline: [/^(?!.*vitest).*$/] },
    },
    env: { TZ: 'UTC' },
  },
});
