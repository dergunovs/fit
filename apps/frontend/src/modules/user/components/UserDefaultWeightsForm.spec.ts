import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserDefaultWeightsForm from './UserDefaultWeightsForm.vue';

import { wrapperFactory } from '@/common/test';
import { USER_FIXTURE } from '@/user/fixtures';
import { EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { getExercisesToChooseDefaultWeight } from '@/exercise/helpers';

const availableEquipment = getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, USER_FIXTURE.equipments);

const weight = dataTest('user-default-weight');
const title = dataTest('user-default-weight-title');
const select = dataTest('user-default-weight-select');

let wrapper: VueWrapper<InstanceType<typeof UserDefaultWeightsForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserDefaultWeightsForm, {
    userEquipments: USER_FIXTURE.equipments,
    exercises: EXERCISES_FIXTURE,
  });
});

enableAutoUnmount(afterEach);

describe('UserDefaultWeightsForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserDefaultWeightsForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows exercises to choose default weight', async () => {
    expect(wrapper.findAll(weight).length).toBe(availableEquipment.length);
    expect(wrapper.find(title).text()).toBe(availableEquipment[0].title);
  });

  it('sets weight select options', async () => {
    expect(wrapper.find(select).attributes('options')).toBe(availableEquipment[0].options.join(','));
  });

  it('emits updated default weights', async () => {
    const defaultWeight = availableEquipment[0].options[0];
    const id = availableEquipment[0]?._id || '';

    await wrapper.findComponent(select).setValue(defaultWeight);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([{ [id]: defaultWeight }]);
  });
});
