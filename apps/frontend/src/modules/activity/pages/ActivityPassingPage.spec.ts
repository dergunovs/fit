import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import ActivityPassingPage from './ActivityPassingPage.vue';

import { wrapperFactory } from '@/common/test';
import { spyGetActivity } from '@/activity/mocks';
import { mockRouteId, spyUseRouteId } from '@/common/mocks';

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
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('activity');

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({}, mockRouteId);
  });
});
