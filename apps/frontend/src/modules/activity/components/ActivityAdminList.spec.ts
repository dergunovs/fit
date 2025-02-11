import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDate, dataTest } from 'mhz-helpers';

import ActivityAdminList from './ActivityAdminList.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_FIXTURE } from '@/activity/fixtures';
import { URL_ACTIVITY_ADMIN_EDIT } from '@/activity/constants';
import { URL_USER_EDIT } from '@/user/constants';

const activityTableRow = dataTest('activity-table-row');
const activityTableDateLink = dataTest('activity-table-date-link');
const activityTableUserLink = dataTest('activity-table-user-link');

let wrapper: VueWrapper<InstanceType<typeof ActivityAdminList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityAdminList, { activities: ACTIVITIES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ActivityAdminList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityAdminList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows activities in table', async () => {
    expect(wrapper.findAll(activityTableRow).length).toBe(ACTIVITIES_FIXTURE.length);

    expect(wrapper.find(activityTableDateLink).text()).toBe(formatDate(ACTIVITIES_FIXTURE[0].dateCreated, 'ru'));
    expect(wrapper.find(activityTableUserLink).text()).toBe(ACTIVITIES_FIXTURE[0].createdBy?.email);
  });

  it('sets activity links', async () => {
    expect(wrapper.find(activityTableDateLink).attributes('to')).toBe(
      `${URL_ACTIVITY_ADMIN_EDIT}/${ACTIVITIES_FIXTURE[0]._id}`
    );

    expect(wrapper.find(activityTableUserLink).attributes('to')).toBe(
      `${URL_USER_EDIT}/${ACTIVITIES_FIXTURE[0].createdBy?._id}`
    );
  });
});
