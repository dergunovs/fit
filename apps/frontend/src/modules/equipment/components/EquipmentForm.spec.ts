import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_EQUIPMENT } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import EquipmentForm from './EquipmentForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { EQUIPMENT_FIXTURE } from '@/equipment/fixtures';
import { mockOnSuccess, spyCreateEquipment, spyUpdateEquipment, spyDeleteEquipment } from '@/equipment/mocks';
import { spyRefetchQueries, spyRemoveQueries, spyRouterPush, spyToastSuccess, mockIsValid } from '@/common/mocks';
import { URL_EQUIPMENT } from '@/equipment/constants';

const TITLE = 'Гантели';
const TITLE_EN = 'Dumbbells';
const IS_WEIGHTS = true;

const form = dataTest('equipment-form');
const formTitle = dataTest('equipment-form-title');
const formTitleEn = dataTest('equipment-form-title-en');
const formIsWeights = dataTest('equipment-form-is-weights');
const formButtons = dataTest('equipment-form-buttons');

const wrapperWithEquipment: VueWrapper<InstanceType<typeof EquipmentForm>> = wrapperFactory(EquipmentForm, {
  equipment: EQUIPMENT_FIXTURE,
});

let wrapper: VueWrapper<InstanceType<typeof EquipmentForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(EquipmentForm);
});

enableAutoUnmount(afterEach);

describe('EquipmentForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(EquipmentForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyCreateEquipment).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('creates equipment', async () => {
    expect(spyCreateEquipment).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formTitle).setValue(TITLE);
    await wrapper.findComponent(formTitleEn).setValue(TITLE_EN);
    await wrapper.findComponent(formIsWeights).setValue(IS_WEIGHTS);

    await wrapper.find(form).trigger('submit');

    expect(spyCreateEquipment).toBeCalledTimes(1);
    expect(spyCreateEquipment).toBeCalledWith({ title: TITLE, title_en: TITLE_EN, isWeights: IS_WEIGHTS });

    await mockOnSuccess.create?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EQUIPMENT] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EQUIPMENT);
  });

  it('updates equipment', async () => {
    expect(spyUpdateEquipment).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    const NEW_TITLE = 'Штанга';

    await wrapperWithEquipment.findComponent(formTitle).setValue(NEW_TITLE);

    await wrapperWithEquipment.find(form).trigger('submit');

    expect(spyUpdateEquipment).toBeCalledTimes(1);
    expect(spyUpdateEquipment).toBeCalledWith({
      _id: EQUIPMENT_FIXTURE._id,
      dateCreated: EQUIPMENT_FIXTURE.dateCreated,
      dateUpdated: EQUIPMENT_FIXTURE.dateUpdated,
      isWeights: EQUIPMENT_FIXTURE.isWeights,
      title: NEW_TITLE,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EQUIPMENT] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('deletes equipment', async () => {
    expect(spyDeleteEquipment).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    wrapperWithEquipment.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', EQUIPMENT_FIXTURE._id);

    expect(spyDeleteEquipment).toBeCalledTimes(1);
    expect(spyDeleteEquipment).toBeCalledWith(EQUIPMENT_FIXTURE._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_EQUIPMENT] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_EQUIPMENT] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_EQUIPMENT);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithEquipment.find(formButtons).attributes('id')).toBe(EQUIPMENT_FIXTURE._id);
  });
});
