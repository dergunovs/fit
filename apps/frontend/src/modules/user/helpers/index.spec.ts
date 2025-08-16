import { describe, expect, test } from 'vitest';
import { IUserEquipment } from 'fitness-tracker-contracts';

import { excludeChoosenUserEquipment } from '.';
import { EQUIPMENT_FIXTURE_2, EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { USER_FIXTURE, USER_FIXTURE_2 } from '@/user/fixtures';

describe('user helpers', () => {
  test('excludes choosen user equipment', async () => {
    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, USER_FIXTURE.equipments)).toStrictEqual([]);
  });

  test('returns all equipments when user has no equipments', async () => {
    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, USER_FIXTURE_2.equipments)).toStrictEqual(
      EQUIPMENTS_FIXTURE
    );
  });

  test('returns only non-selected equipment when some equipments are selected', async () => {
    const userEquipments = [USER_FIXTURE.equipments?.[0]] as IUserEquipment[];
    const expected = [EQUIPMENT_FIXTURE_2];

    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, userEquipments)).toStrictEqual(expected);
  });

  test('returns empty array when all equipments are selected', async () => {
    const userEquipments = USER_FIXTURE.equipments;

    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, userEquipments)).toStrictEqual([]);
  });

  test('handles undefined user equipments gracefully', async () => {
    expect(excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, undefined)).toStrictEqual(EQUIPMENTS_FIXTURE);
  });
});
