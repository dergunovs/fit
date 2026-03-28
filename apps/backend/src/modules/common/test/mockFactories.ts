import { vi, type Mock } from 'vitest';

export function createMockRepository<T>(methods: (keyof T)[]): { [K in keyof T]: Mock } {
  const mock = {} as { [K in keyof T]: Mock };

  for (const method of methods) {
    mock[method] = vi.fn();
  }

  return mock;
}
