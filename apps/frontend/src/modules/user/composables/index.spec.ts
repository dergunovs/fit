import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { withSetup } from 'mhz-helpers';

import { useUserFormTabs } from '.';

vi.mock('@/common/composables', () => ({
  useTI18n: () => ({
    t: (key: string) => key,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useUserFormTabs composables', () => {
  it('should return only general tab when isEdit is false', async () => {
    await withSetup(async () => {
      const isAdmin = ref(false);
      const { TABS } = useUserFormTabs(false, isAdmin);

      expect(TABS.value).toHaveLength(1);
      expect(TABS.value[0].value).toBe('general');
    });
  });

  it('returns all but exercises to admin', async () => {
    await withSetup(async () => {
      const isAdmin = ref(true);
      const { TABS } = useUserFormTabs(true, isAdmin);

      expect(TABS.value).toHaveLength(4);
      expect(TABS.value[0].value).toBe('general');
      expect(TABS.value[1].value).toBe('goals');
      expect(TABS.value[2].value).toBe('weight');
      expect(TABS.value[3].value).toBe('templates');
    });
  });

  it('returns all to user', async () => {
    await withSetup(async () => {
      const isAdmin = ref(false);
      const { TABS } = useUserFormTabs(true, isAdmin);

      expect(TABS.value).toHaveLength(5);
      expect(TABS.value[0].value).toBe('general');
      expect(TABS.value[1].value).toBe('goals');
      expect(TABS.value[2].value).toBe('weight');
      expect(TABS.value[3].value).toBe('templates');
      expect(TABS.value[4].value).toBe('exercises');
    });
  });
});
