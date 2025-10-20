import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityTimeline from './ActivityTimeline.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE, EXERCISE_DONE_FIXTURE } from '@/exercise/fixtures';
import { generateTimeline } from '@/exercise/helpers';

const step = dataTest('activity-timeline-step');

const start = new Date('01-01-2025');
const exercises = EXERCISES_DONE_FIXTURE;

let wrapper: VueWrapper<InstanceType<typeof ActivityTimeline>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityTimeline, { start, exercises });
});

enableAutoUnmount(afterEach);

describe('ActivityTimeline', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityTimeline)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows steps', async () => {
    const generatedSteps = generateTimeline(exercises, start, 10);

    expect(wrapper.findAll(step).length).toBe(generatedSteps.length);

    generatedSteps.forEach((stepData, index) => {
      const stepElement = wrapper.findAll(step)[index];

      expect(stepElement.attributes('data-type')).toBe(stepData.type);
    });
  });

  it('handles empty exercises array', async () => {
    await wrapper.setProps({ exercises: [] });

    expect(wrapper.findAll(step).length).toBe(0);
  });

  it('handles null start date', async () => {
    await wrapper.setProps({ start: null });

    expect(wrapper.findAll(step).length).toBe(0);
  });

  it('handles exercises without duration correctly', async () => {
    await wrapper.setProps({ exercises: [{ ...EXERCISE_DONE_FIXTURE, duration: undefined }] });

    expect(wrapper.findAll(step).length).toBe(0);
  });

  it('calculates ratio correctly when both lastStepDate and start exist', async () => {
    const testExercises = [
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: '01-01-2025' },
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: '01-03-2025' },
    ];

    await wrapper.setProps({ exercises: testExercises });

    const expectedRatio = 86400000 / 308;

    const generatedSteps = generateTimeline(testExercises, start, expectedRatio);

    expect(generatedSteps.length).toBe(2);
  });

  it('handles exercises with missing dateUpdated in last element', async () => {
    const testExercises = [
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: new Date('2024-11-30T07:34:57.304Z') },
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: undefined },
    ];

    await wrapper.setProps({ exercises: testExercises });

    const generatedSteps = generateTimeline(testExercises, start, 0);

    expect(generatedSteps.length).toBe(1);
  });

  it('sets ratio to 0 when lastStepDate is missing', async () => {
    const testExercises = [
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: undefined },
      { ...EXERCISE_DONE_FIXTURE, dateUpdated: undefined },
    ];

    await wrapper.setProps({ exercises: testExercises, start: null });

    const generatedSteps = generateTimeline(testExercises, null, 0);

    expect(generatedSteps.length).toBe(0);
  });

  it('sets ratio to 0 when start is missing', async () => {
    await wrapper.setProps({ start: null });

    const generatedSteps = generateTimeline(exercises, null, 0);

    expect(generatedSteps.length).toBe(0);
  });
});
