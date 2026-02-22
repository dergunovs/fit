import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import EquipmentEditPage from './EquipmentEditPage.vue';
import EquipmentForm from '@/equipment/components/EquipmentForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetEquipment } from '@/equipment/mocks';
import { EQUIPMENT_FIXTURE } from '@/equipment/fixtures';
import { spyUseRouteId, mockRouteId } from '@/common/mocks';

const equipmentForm = dataTest('equipment-form');

let wrapper: VueWrapper<InstanceType<typeof EquipmentEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(EquipmentEditPage);
});

enableAutoUnmount(afterEach);

describe('EquipmentEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(EquipmentEditPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets equipment to form', async () => {
    expect(spyUseRouteId).toHaveBeenCalledTimes(1);
    expect(spyUseRouteId).toHaveBeenCalledWith('equipment');

    expect(spyGetEquipment).toHaveBeenCalledTimes(1);
    expect(spyGetEquipment).toHaveBeenCalledWith({ enabled: true }, mockRouteId);

    expect(wrapper.findComponent<typeof EquipmentForm>(equipmentForm).props('equipment')).toStrictEqual(
      EQUIPMENT_FIXTURE
    );
  });
});
