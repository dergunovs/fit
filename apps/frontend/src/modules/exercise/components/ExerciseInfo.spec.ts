import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, setAuth } from 'mhz-helpers';

import ExerciseInfo from './ExerciseInfo.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_STATISTICS_FIXTURE } from '@/exercise/fixtures';

const exercise = EXERCISES_STATISTICS_FIXTURE[0];
const exerciseWithoutEquipment = EXERCISES_STATISTICS_FIXTURE[1];

const title = dataTest('exercise-info-title');
const matches = dataTest('exercise-info-matches');
const matchesText = dataTest('exercise-info-matches-text');
const muscles = dataTest('exercise-info-muscles');
const equipment = dataTest('exercise-info-equipment');
const equipmentTitle = dataTest('exercise-info-equipment-title');
const isWeights = dataTest('exercise-info-is-weights');
const isWeightsRequired = dataTest('exercise-info-is-weights-required');
const equipmentForWeight = dataTest('exercise-info-equipment-for-weight');
const description = dataTest('exercise-info-description');

let wrapper: VueWrapper<InstanceType<typeof ExerciseInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(ExerciseInfo, { exercise });
});

enableAutoUnmount(afterEach);

describe('ExerciseInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ExerciseInfo)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows statistics title', async () => {
    expect(wrapper.find(title).text()).toBe(exercise.exercise.title);
  });

  it('checks if equipment matches', async () => {
    expect(wrapper.find(matches).exists()).toBe(false);

    setAuth(true);

    await nextTick();

    expect(wrapper.find(matches).exists()).toBe(true);
    expect(wrapper.find(matches).attributes('data-matches')).toBe(exercise.isUserEquipmentMatches.toString());
  });

  it('shows equipment matches text', async () => {
    expect(wrapper.find(matchesText).text()).toBe('нет');
  });

  it('shows muscle groups', async () => {
    expect(wrapper.findAll(muscles).length).toBe(exercise.exercise.muscles?.length);
    expect(wrapper.find(muscles).text()).toBe(exercise.exercise.muscles?.[0].title);
  });

  it('shows equipment', async () => {
    expect(wrapper.find(equipment).exists()).toBe(!!exercise.exercise.equipment?._id);
    expect(wrapper.find(equipmentTitle).text()).toBe(exercise.exercise.equipment?.title);

    await wrapper.setProps({ exercise: exerciseWithoutEquipment });

    expect(wrapper.find(equipment).exists()).toBe(exerciseWithoutEquipment.exercise.isWeights);
    expect(wrapper.find(equipmentTitle).exists()).toBe(false);
  });

  it('shows equipment for weight', async () => {
    expect(wrapper.find(isWeights).exists()).toBe(exercise.exercise.isWeights);
    expect(wrapper.findAll(equipmentForWeight).length).toBe(exercise.exercise.equipmentForWeight?.length);
    expect(wrapper.find(equipmentForWeight).text()).toBe(exercise.exercise.equipmentForWeight?.[0].title);
    expect(wrapper.find(isWeightsRequired).exists()).toBe(exercise.exercise.isWeightsRequired);

    await wrapper.setProps({ exercise: exerciseWithoutEquipment });

    expect(wrapper.find(isWeights).exists()).toBe(exerciseWithoutEquipment.exercise.isWeights);
    expect(wrapper.find(equipmentForWeight).exists()).toBe(exerciseWithoutEquipment.exercise.isWeights);
    expect(wrapper.find(isWeightsRequired).exists()).toBe(exerciseWithoutEquipment.exercise.isWeightsRequired);
  });

  it('shows statistics description', async () => {
    expect(wrapper.find(description).text()).toBe(exercise.exercise.description);
  });
});
