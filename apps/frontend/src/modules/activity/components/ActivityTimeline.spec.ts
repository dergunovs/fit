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
});
