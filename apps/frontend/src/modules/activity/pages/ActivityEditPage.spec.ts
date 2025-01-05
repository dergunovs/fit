import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_ACTIVITY } from 'fitness-tracker-contracts';
import { UiModal } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import ActivityEditPage from './ActivityEditPage.vue';
import ActivityInfo from './ActivityInfo.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITY_FIXTURE } from '@/activity/fixtures';
import { mockOnSuccess, spyDeleteActivity, spyGetActivity } from '@/activity/mocks';
import {
  mockRouteId,
  spyRefetchQueries,
  spyRemoveQueries,
  spyRouterGo,
  spyRouterPush,
  spyToastSuccess,
  spyUseRouteId,
} from '@/common/mocks';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';

const info = dataTest('activity-info');
const modal = dataTest('activity-modal');
const goBackButton = dataTest('activity-go-back-button');
const deleteButton = dataTest('activity-delete-button');

let wrapper: VueWrapper<InstanceType<typeof ActivityEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityEditPage);
});

enableAutoUnmount(afterEach);

describe('ActivityEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityEditPage)).toBeTruthy();
  });

  it('gets activity and sets props to info', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('activity');

    expect(spyGetActivity).toBeCalledTimes(1);
    expect(spyGetActivity).toBeCalledWith({}, mockRouteId);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).vm.$props.id).toStrictEqual(ACTIVITY_FIXTURE._id);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).vm.$props.start).toStrictEqual(
      ACTIVITY_FIXTURE.dateCreated
    );
    expect(wrapper.findComponent<typeof ActivityInfo>(info).vm.$props.end).toStrictEqual(ACTIVITY_FIXTURE.dateUpdated);

    expect(wrapper.findComponent<typeof ActivityInfo>(info).vm.$props.exercises).toStrictEqual(
      ACTIVITY_FIXTURE.exercises
    );
  });

  it('deletes activity', async () => {
    expect(spyDeleteActivity).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');

    await wrapper.find(deleteButton).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof UiModal>(modal).vm.$emit('confirm');

    expect(spyDeleteActivity).toBeCalledTimes(1);
    expect(spyDeleteActivity).toBeCalledWith(ACTIVITY_FIXTURE._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_ACTIVITY] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_ACTIVITY_ADMIN);
  });

  it('handle go back button click', async () => {
    await wrapper.find(goBackButton).trigger('click');

    expect(spyRouterGo).toBeCalledTimes(1);
    expect(spyRouterGo).toBeCalledWith(-1);
  });
});
