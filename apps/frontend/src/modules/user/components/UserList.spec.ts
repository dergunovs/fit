import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserList from './UserList.vue';

import { wrapperFactory } from '@/common/test';
import { USERS_FIXTURE } from '@/user/fixtures';
import { URL_USER_EDIT } from '@/user/constants';

const userTableRow = dataTest('user-table-row');
const userTableEmailLink = dataTest('user-table-email-link');

let wrapper: VueWrapper<InstanceType<typeof UserList>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserList, { users: USERS_FIXTURE });
});

enableAutoUnmount(afterEach);

describe('UserList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserList)).toBeTruthy();
  });

  it('shows users in table', async () => {
    expect(wrapper.findAll(userTableRow).length).toBe(USERS_FIXTURE.length);
    expect(wrapper.find(userTableEmailLink).text()).toBe(USERS_FIXTURE[0].email);
  });

  it('sets user page link', async () => {
    expect(wrapper.find(userTableEmailLink).attributes('to')).toBe(`${URL_USER_EDIT}/${USERS_FIXTURE[0]._id}`);
  });
});
