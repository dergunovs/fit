import { describe, expect, test } from 'vitest';

import { excludeChoosenUserEquipment } from '.';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';

describe('user helpers', () => {
  test('excludes choosen user equipment', async () => {
    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, USER_FIXTURE.equipments)).toStrictEqual([]);
  });
});
