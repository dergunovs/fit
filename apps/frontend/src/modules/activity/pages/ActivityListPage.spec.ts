import { ref } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiPagination } from 'mhz-ui';

import ActivityListPage from './ActivityListPage.vue';
import ActivityAdminList from './ActivityAdminList.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { ACTIVITIES_FIXTURE } from '@/activity/fixtures';
import { spyGetActivities, getActivitiesData } from '@/activity/mocks';
import { mockPageNumber, spySetPage, spyUsePageNumber, spyUsePagination } from '@/common/mocks';

const list = dataTest('activities-list');
const pagination = dataTest('activities-pagination');

let wrapper: VueWrapper<InstanceType<typeof ActivityListPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityListPage);
});

enableAutoUnmount(afterEach);

describe('ActivityListPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityListPage)).toBeTruthy();
  });

  it('gets activity and sets props to list', async () => {
    expect(spyUsePageNumber).toBeCalledTimes(1);

    expect(spyGetActivities).toBeCalledTimes(1);
    expect(spyGetActivities).toBeCalledWith(mockPageNumber);

    expect(spyUsePagination).toBeCalledTimes(1);
    expect(spyUsePagination).toBeCalledWith(ref(getActivitiesData));

    expect(wrapper.findComponent<typeof ActivityAdminList>(list).vm.$props.activities).toStrictEqual(
      ACTIVITIES_FIXTURE
    );
  });

  it('sets data to pagination', async () => {
    expect(wrapper.find(pagination).attributes('page')).toBe(mockPageNumber.value.toString());
    expect(wrapper.find(pagination).attributes('total')).toBe(ACTIVITIES_FIXTURE.length.toString());
  });

  it('updates pagination', async () => {
    wrapper.findComponent<typeof UiPagination>(pagination).vm.$emit('update', 2);

    expect(spySetPage).toBeCalledTimes(1);
  });
});
