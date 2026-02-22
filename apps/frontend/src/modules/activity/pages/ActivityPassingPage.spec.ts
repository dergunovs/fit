import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityPassingPage from './ActivityPassingPage.vue';
import ActivityPassingForm from '@/activity/components/ActivityPassingForm.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetActivity } from '@/activity/mocks';
import { mockRouteId, spyUseRouteId, spyUsePageLock } from '@/common/mocks';
import { ACTIVITY_FIXTURE } from '@/activity/fixtures';

const form = dataTest('activity-passing-form');

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

  it('gets activity', async () => {
    expect(spyUseRouteId).toHaveBeenCalledTimes(1);
    expect(spyUseRouteId).toHaveBeenCalledWith('activity');

    expect(spyGetActivity).toHaveBeenCalledTimes(1);
    expect(spyGetActivity).toHaveBeenCalledWith({ enabled: true }, mockRouteId);
  });

  it('passes activity to form props', async () => {
    expect(wrapper.findComponent<typeof ActivityPassingForm>(form).props('activity')).toStrictEqual(ACTIVITY_FIXTURE);
  });

  it('locks page from blocking', async () => {
    expect(spyUsePageLock).toHaveBeenCalledTimes(1);
  });
});
