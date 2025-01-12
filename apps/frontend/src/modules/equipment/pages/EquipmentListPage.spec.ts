import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import EquipmentListPage from './EquipmentListPage.vue';
import EquipmentList from '@/equipment/components/EquipmentList.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetEquipments } from '@/equipment/mocks';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { URL_EQUIPMENT_CREATE } from '@/equipment/constants';

const equipmentList = dataTest('equipment-list');
const addEquipment = dataTest('add-equipment');

let wrapper: VueWrapper<InstanceType<typeof EquipmentListPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(EquipmentListPage);
});

enableAutoUnmount(afterEach);

describe('EquipmentListPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(EquipmentListPage)).toBeTruthy();
  });

  it('sets create equipment link', async () => {
    expect(wrapper.find(addEquipment).attributes('to')).toBe(URL_EQUIPMENT_CREATE);
  });

  it('gets and sets equipments to list', async () => {
    expect(spyGetEquipments).toBeCalledTimes(1);
    expect(wrapper.findComponent<typeof EquipmentList>(equipmentList).vm.$props.equipments).toStrictEqual(
      EQUIPMENTS_FIXTURE
    );
  });
});
