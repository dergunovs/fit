import { describe, expect, test } from 'vitest';

import { filterEquipmentByWeights, getWeightsForUserEquipment } from '.';
import { EQUIPMENTS_FIXTURE, EQUIPMENT_FIXTURE, EQUIPMENT_FIXTURE_2 } from '@/equipment/fixtures';
import { USER_FIXTURE, USER_FIXTURE_2 } from '@/user/fixtures';

describe('equipment helpers', () => {
  test('filters equipment by weights', async () => {
    expect(filterEquipmentByWeights()).toStrictEqual([]);
    expect(filterEquipmentByWeights([])).toStrictEqual([]);
    expect(filterEquipmentByWeights(EQUIPMENTS_FIXTURE, true)).toStrictEqual([EQUIPMENT_FIXTURE]);
    expect(filterEquipmentByWeights(EQUIPMENTS_FIXTURE)).toStrictEqual([EQUIPMENT_FIXTURE_2]);
    expect(filterEquipmentByWeights(EQUIPMENTS_FIXTURE, false)).toStrictEqual([EQUIPMENT_FIXTURE_2]);
    expect(filterEquipmentByWeights([EQUIPMENT_FIXTURE], true)).toStrictEqual([EQUIPMENT_FIXTURE]);
    expect(filterEquipmentByWeights([EQUIPMENT_FIXTURE_2], false)).toStrictEqual([EQUIPMENT_FIXTURE_2]);
  });

  test('get weights for user equipment', async () => {
    expect(getWeightsForUserEquipment()).toStrictEqual([]);
    expect(getWeightsForUserEquipment([])).toStrictEqual([]);
    expect(getWeightsForUserEquipment(USER_FIXTURE.equipments)).toStrictEqual([1, 2, 3]);
    expect(getWeightsForUserEquipment(USER_FIXTURE_2.equipments)).toStrictEqual([]);
    expect(getWeightsForUserEquipment([{ equipment: EQUIPMENT_FIXTURE, weights: [] }])).toStrictEqual([]);
    expect(
      getWeightsForUserEquipment([
        { equipment: EQUIPMENT_FIXTURE, weights: [1, 2] },
        { equipment: EQUIPMENT_FIXTURE_2, weights: [3, 4] },
      ])
    ).toStrictEqual([1, 2, 3, 4]);
    expect(
      getWeightsForUserEquipment([
        { equipment: EQUIPMENT_FIXTURE, weights: [1, 2, 2] },
        { equipment: EQUIPMENT_FIXTURE_2, weights: [3, 3, 4] },
      ])
    ).toStrictEqual([1, 2, 3, 4]);
  });
});
