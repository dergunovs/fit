import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import EquipmentList from './EquipmentList.vue';

import { wrapperFactory } from '@/common/test';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { URL_EQUIPMENT_EDIT } from '@/equipment/constants';

const equipmentTableRow = dataTest('equipment-table-row');
const equipmentTableTitleLink = dataTest('equipment-table-title-link');

let wrapper: VueWrapper<InstanceType<typeof EquipmentList>>;

beforeEach(() => {
  wrapper = wrapperFactory(EquipmentList, { equipments: EQUIPMENTS_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('EquipmentList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(EquipmentList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows equipments in table', async () => {
    expect(wrapper.findAll(equipmentTableRow).length).toBe(EQUIPMENTS_FIXTURE.length);
    expect(wrapper.find(equipmentTableTitleLink).text()).toBe(EQUIPMENTS_FIXTURE[0].title);
  });

  it('sets equipment page link', async () => {
    expect(wrapper.find(equipmentTableTitleLink).attributes('to')).toBe(
      `${URL_EQUIPMENT_EDIT}/${EQUIPMENTS_FIXTURE[0]._id}`
    );
  });
});
