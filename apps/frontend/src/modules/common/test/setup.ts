import { afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';

afterEach(async () => {
  await flushPromises();
});
