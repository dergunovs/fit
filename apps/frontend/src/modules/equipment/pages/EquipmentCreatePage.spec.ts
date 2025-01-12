import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import EquipmentCreatePage from './EquipmentCreatePage.vue';

import { wrapperFactory } from '@/common/test';

const equipmentForm = dataTest('equipment-form');

let wrapper: VueWrapper<InstanceType<typeof EquipmentCreatePage>>;

beforeEach(() => {
  wrapper = wrapperFactory(EquipmentCreatePage);
});

enableAutoUnmount(afterEach);

describe('EquipmentCreatePage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(EquipmentCreatePage)).toBeTruthy();
  });

  it('shows equipment form', async () => {
    expect(wrapper.find(equipmentForm).exists()).toBe(true);
  });
});
