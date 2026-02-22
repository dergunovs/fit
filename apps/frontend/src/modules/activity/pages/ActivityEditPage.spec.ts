import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ActivityEditPage from './ActivityEditPage.vue';
import ActivityInfo from '@/activity/components/ActivityInfo.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE } from '@/activity/fixtures';
import { spyGetActivity } from '@/activity/mocks';
import { mockRouteId, spyUseRouteId } from '@/common/mocks';

const info = dataTest('activity-info');

let wrapper: VueWrapper<InstanceType<typeof ActivityEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityEditPage);
});

enableAutoUnmount(afterEach);

describe('ActivityEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityEditPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets activity and sets props to info', async () => {
    expect(spyUseRouteId).toHaveBeenCalledTimes(1);
    expect(spyUseRouteId).toHaveBeenCalledWith('activity');

    expect(spyGetActivity).toHaveBeenCalledTimes(1);
    expect(spyGetActivity).toHaveBeenCalledWith({ enabled: true }, mockRouteId);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).props('id')).toStrictEqual(ACTIVITY_FIXTURE._id);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).props('start')).toStrictEqual(ACTIVITY_FIXTURE.dateCreated);
    expect(wrapper.findComponent<typeof ActivityInfo>(info).props('end')).toStrictEqual(ACTIVITY_FIXTURE.dateUpdated);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).props('exercises')).toStrictEqual(
      ACTIVITY_FIXTURE.exercises
    );
  });
});
