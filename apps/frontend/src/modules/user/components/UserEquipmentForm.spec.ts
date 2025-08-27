import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { IEquipment } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import UserEquipmentForm from './UserEquipmentForm.vue';

import { wrapperFactory } from '@/common/test';
import { EQUIPMENTS_FIXTURE } from '@/equipment/fixtures';
import { USER_FIXTURE } from '@/user/fixtures';
import { excludeChoosenUserEquipment } from '@/user/helpers';

const weightsCount = USER_FIXTURE.equipments?.[0].weights?.length || 0;

const options = dataTest('user-equipment-options');
const edit = dataTest('user-equipment-edit');
const weight = dataTest('user-weight');
const addWeight = dataTest('user-add-weight');
const addedWeights = dataTest('user-added-weights');
const addedWeight = dataTest('user-added-weight');
const deleteWeight = dataTest('user-delete-weight');
const equipment = dataTest('user-equipment');
const equipmentTitle = dataTest('user-equipment-title');
const equipmentWeights = dataTest('user-equipment-weights');
const equipmentWeight = dataTest('user-equipment-weight');
const save = dataTest('user-save-equipment');
const reset = dataTest('user-reset-equipment');
const addEquipment = dataTest('user-add-equipment');
const deleteEquipment = dataTest('user-delete-equipment');

let wrapper: VueWrapper<InstanceType<typeof UserEquipmentForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserEquipmentForm, { equipments: EQUIPMENTS_FIXTURE, modelValue: USER_FIXTURE.equipments });
});

enableAutoUnmount(afterEach);

describe('UserEquipmentForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserEquipmentForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets filtered equipment options', async () => {
    expect(wrapper.find(options).attributes('options')).toStrictEqual(
      excludeChoosenUserEquipment(EQUIPMENTS_FIXTURE, USER_FIXTURE.equipments).join('')
    );
  });

  it('disables equipment select when edit', async () => {
    expect(wrapper.find(options).attributes('isdisabled')).toStrictEqual('false');
    expect(wrapper.find(options).attributes('modelvalue')).toStrictEqual(undefined);
    expect((wrapper.vm as unknown as { choosenEquipment: IEquipment }).choosenEquipment).toStrictEqual(undefined);

    await wrapper.find(edit).trigger('click');

    expect(wrapper.find(options).attributes('isdisabled')).toStrictEqual('true');
    expect(wrapper.find(options).attributes('modelvalue')).not.toStrictEqual(undefined);
    expect((wrapper.vm as unknown as { choosenEquipment: IEquipment }).choosenEquipment).toStrictEqual(
      USER_FIXTURE.equipments?.[0].equipment
    );

    await wrapper.find(reset).trigger('click');

    expect(wrapper.find(options).attributes('isdisabled')).toStrictEqual('false');
    expect(wrapper.find(options).attributes('modelvalue')).toStrictEqual(undefined);
  });

  it('shows weight input when equipment can have a weight', async () => {
    expect(wrapper.find(weight).exists()).toBe(false);

    await wrapper.find(edit).trigger('click');

    expect(wrapper.find(weight).exists()).toBe(true);
  });

  it('adds new weight to equipment with validation', async () => {
    const OLD_WEIGHT = USER_FIXTURE.equipments?.[0].weights?.[0];
    const NEW_WEIGHT = 7;

    await wrapper.find(edit).trigger('click');

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('true');

    await wrapper.findComponent(weight).setValue(OLD_WEIGHT);

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('true');

    await wrapper.findComponent(weight).setValue(NEW_WEIGHT);

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('false');

    expect(wrapper.findAll(addedWeights).length).toBe(weightsCount);

    await wrapper.find(addWeight).trigger('click');

    expect(wrapper.findAll(addedWeights).length).toBe(weightsCount + 1);
    expect(wrapper.findAll(addedWeight)[weightsCount].text()).toBe(NEW_WEIGHT.toString());

    await wrapper.find(save).trigger('click');

    if (!USER_FIXTURE.equipments || !USER_FIXTURE.equipments[0].weights) return;

    const updatedWeights = [...USER_FIXTURE.equipments[0].weights, NEW_WEIGHT];

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([
      [{ equipment: USER_FIXTURE.equipments[0].equipment, weights: updatedWeights }, USER_FIXTURE.equipments[1]],
    ]);
  });

  it('deletes weight', async () => {
    await wrapper.find(edit).trigger('click');

    expect(wrapper.findAll(addedWeights).length).toBe(weightsCount);

    await wrapper.findAll(deleteWeight)[weightsCount - 1].trigger('click');

    expect(wrapper.findAll(addedWeights).length).toBe(weightsCount - 1);

    await wrapper.find(save).trigger('click');

    if (!USER_FIXTURE.equipments || !USER_FIXTURE.equipments[0].weights) return;

    const updatedWeights = USER_FIXTURE.equipments[0].weights.slice(0, -1);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([
      [{ equipment: USER_FIXTURE.equipments[0].equipment, weights: updatedWeights }, USER_FIXTURE.equipments[1]],
    ]);
  });

  it('deletes and adds equipment', async () => {
    if (!USER_FIXTURE.equipments) return;

    await wrapper.findAll(deleteEquipment)[USER_FIXTURE.equipments?.length - 1].trigger('click');

    const updatedEquipments = USER_FIXTURE.equipments.slice(0, -1);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([updatedEquipments]);

    (wrapper.vm as unknown as { choosenEquipment?: IEquipment }).choosenEquipment =
      USER_FIXTURE.equipments[1].equipment;

    await wrapper.findComponent(options).setValue(USER_FIXTURE.equipments[1].equipment);
    await wrapper.setProps({ modelValue: updatedEquipments });

    await wrapper.find(addEquipment).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    expect(wrapper.emitted()['update:modelValue'][1]).toStrictEqual([USER_FIXTURE.equipments]);
  });

  it('hides equipment when modelValue is empty', async () => {
    expect(wrapper.findAll(equipment).length).toBe(USER_FIXTURE.equipments?.length);
    expect(wrapper.find(equipmentTitle).text()).toBe(USER_FIXTURE.equipments?.[0].equipment?.title);
    expect(wrapper.findAll(equipmentWeights).length).toBe(USER_FIXTURE.equipments?.[0].weights?.length);
    expect(wrapper.find(equipmentWeight).text()).toBe(USER_FIXTURE.equipments?.[0].weights?.[0].toString());

    await wrapper.setProps({ modelValue: [] });

    expect(wrapper.find(equipment).exists()).toBe(false);
    expect(wrapper.find(equipmentTitle).exists()).toBe(false);
    expect(wrapper.find(equipmentWeights).exists()).toBe(false);
    expect(wrapper.find(equipmentWeight).exists()).toBe(false);
  });

  it('disables add weight button when weight is invalid (less than 1)', async () => {
    await wrapper.find(edit).trigger('click');

    await wrapper.findComponent(weight).setValue(-1);

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('true');
  });

  it('disables add weight button when weight is invalid (greater than 500)', async () => {
    await wrapper.find(edit).trigger('click');

    await wrapper.findComponent(weight).setValue(501);

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('true');
  });

  it('disables add weight button when weight is not a number', async () => {
    await wrapper.find(edit).trigger('click');

    await wrapper.findComponent(weight).setValue('abc');

    expect(wrapper.find(addWeight).attributes('isdisabled')).toStrictEqual('true');
  });
});
