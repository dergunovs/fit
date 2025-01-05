import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatDate, dataTest } from 'mhz-helpers';

import ActivityAdminList from './ActivityAdminList.vue';

import { wrapperFactory } from '@/common/test';
import { ACTIVITIES_FIXTURE } from '@/activity/fixtures';
import { URL_ACTIVITY_ADMIN_EDIT } from '@/activity/constants';

const activityTableRow = dataTest('activity-table-row');
const activityTableEmailLink = dataTest('activity-table-email-link');

let wrapper: VueWrapper<InstanceType<typeof ActivityAdminList>>;

beforeEach(() => {
  wrapper = wrapperFactory(ActivityAdminList, { activities: ACTIVITIES_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('ActivityAdminList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ActivityAdminList)).toBeTruthy();
  });

  it('shows activities in table', async () => {
    expect(wrapper.findAll(activityTableRow).length).toBe(ACTIVITIES_FIXTURE.length);
    expect(wrapper.find(activityTableEmailLink).text()).toBe(formatDate(ACTIVITIES_FIXTURE[0].dateCreated, 'ru'));
  });

  it('sets activity page link', async () => {
    expect(wrapper.find(activityTableEmailLink).attributes('to')).toBe(
      `${URL_ACTIVITY_ADMIN_EDIT}/${ACTIVITIES_FIXTURE[0]._id}`
    );
  });
});
