import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityPassingPage from './ActivityPassingPage.vue';
import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE } from '@/activity/fixtures';
import { spyGetActivity } from '@/activity/mocks';
import { mockRouteId, spyUseRouteId } from '@/common/mocks';

const form = dataTest('activity-exercise-form');

let wrapper: VueWrapper<InstanceType<typeof ActivityPassingPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityPassingPage);
});

enableAutoUnmount(afterEach);

describe('ActivityPassingPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityPassingPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets activity and sets props to form', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('activity');

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({}, mockRouteId);

    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).vm.$props.activity).toStrictEqual(ACTIVITY_FIXTURE);
  });
});
