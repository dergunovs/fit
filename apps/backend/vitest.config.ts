import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    environment: 'node',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/modules/**/helpers/*.ts', 'src/modules/**/service.ts'],
    },
    env: { TZ: 'UTC' },
  },
});
