import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserDefaultWeightsForm from './UserDefaultWeightsForm.vue';

import { wrapperFactory } from '@/common/test';
import { USER_FIXTURE, USER_FIXTURE_2 } from '@/user/fixtures';
import { EXERCISES_FIXTURE, EXERCISE_FIXTURE_2, EXERCISE_FIXTURE_3 } from '@/exercise/fixtures';
import { getExercisesToChooseDefaultWeight } from '@/exercise/helpers';

const availableEquipment = getExercisesToChooseDefaultWeight(EXERCISES_FIXTURE, USER_FIXTURE.equipments);

const weights = dataTest('user-default-weights');
const weight = dataTest('user-default-weight');
const title = dataTest('user-default-weight-title');
const select = dataTest('user-default-weight-select');
const weightsEmpty = dataTest('user-default-weights-empty');

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

  it('hides form if no exercises', async () => {
    await wrapper.setProps({ userEquipments: USER_FIXTURE_2.equipments, exercises: EXERCISES_FIXTURE });

    expect(wrapper.find(weightsEmpty).exists()).toBe(true);
    expect(wrapper.find(weights).exists()).toBe(false);
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

  it('handles empty exercises array', async () => {
    await wrapper.setProps({ userEquipments: USER_FIXTURE.equipments, exercises: [] });

    expect(wrapper.find(weightsEmpty).exists()).toBe(true);
  });

  it('handles empty user equipments array', async () => {
    await wrapper.setProps({ userEquipments: [], exercises: EXERCISES_FIXTURE });

    expect(wrapper.find(weightsEmpty).exists()).toBe(true);
  });

  it('handles exercise without weights', async () => {
    const exercisesWithoutWeights = [EXERCISE_FIXTURE_2];

    await wrapper.setProps({ userEquipments: USER_FIXTURE.equipments, exercises: exercisesWithoutWeights });

    expect(wrapper.find(weightsEmpty).exists()).toBe(true);
  });

  it('handles exercise with no available equipment for weight', async () => {
    const exercisesWithEquipment = [EXERCISE_FIXTURE_3];

    await wrapper.setProps({ userEquipments: [], exercises: exercisesWithEquipment });

    expect(wrapper.find(weightsEmpty).exists()).toBe(true);
  });
});
