import { describe, expect, test } from 'vitest';

import { filterEquipmentByWeights, getWeightsForUserEquipment } from '.';
import { EQUIPMENTS_FIXTURE, EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';

describe('equipment helpers', () => {
  test('filters equipment by weights', async () => {
    expect(filterEquipmentByWeights()).toStrictEqual([]);
    expect(filterEquipmentByWeights([])).toStrictEqual([]);
    expect(filterEquipmentByWeights(EQUIPMENTS_FIXTURE, true)).toStrictEqual([EQUIPMENT_FIXTURE]);
    expect(filterEquipmentByWeights(EQUIPMENTS_FIXTURE)).toStrictEqual([EQUIPMENT_FIXTURE_2]);
  });

  test('get weights for user equipment', async () => {
    expect(getWeightsForUserEquipment()).toStrictEqual([]);
    expect(getWeightsForUserEquipment([])).toStrictEqual([]);
    expect(getWeightsForUserEquipment(USER_FIXTURE.equipments)).toStrictEqual([1, 2, 3]);
  });
});
