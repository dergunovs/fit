import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityTimeline from './ActivityTimeline.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISES_DONE_FIXTURE } from '@/exercise/fixtures';
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
    expect(wrapper.findAll(step).length).toBe(generateTimeline(exercises, start, 10).length);
  });
});
