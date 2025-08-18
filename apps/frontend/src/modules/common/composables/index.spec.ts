import { describe, it, expect, vi, afterEach } from 'vitest';
import { withSetup } from 'mhz-helpers';

import { useLayout } from '.';
import { spyRouterIsReady } from '@/common/mocks';

describe('useLayout composables', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles isLoaded', () => {
    withSetup(() => {
      expect(spyRouterIsReady).toBeCalledTimes(0);

      const { isLoaded, layoutComponent } = useLayout();

      expect(isLoaded.value).toBe(false);

      expect(layoutComponent.value.name).toBe('LayoutDefault');
    });
  });
});
