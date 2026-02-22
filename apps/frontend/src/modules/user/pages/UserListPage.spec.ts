import { ref } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { UiPagination } from 'mhz-ui';
import { dataTest } from 'mhz-helpers';

import UserListPage from './UserListPage.vue';
import UserList from '@/user/components/UserList.vue';

import { wrapperFactory } from '@/common/test';
import { mockGetUsersData, spyGetUsers } from '@/user/mocks';
import { USERS_FIXTURE } from '@/user/fixtures';
import { mockPageNumber, spyUsePageNumber, spyUsePagination, spySetPage } from '@/common/mocks';
import { URL_USER_CREATE } from '@/user/constants';

const userList = dataTest('user-list');
const userListPagination = dataTest('user-list-pagination');
const addUser = dataTest('add-user');

let wrapper: VueWrapper<InstanceType<typeof UserListPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserListPage);
});

enableAutoUnmount(afterEach);

describe('UserListPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserListPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets create user link', async () => {
    expect(wrapper.find(addUser).attributes('to')).toBe(URL_USER_CREATE);
  });

  it('gets and sets users to list', async () => {
    expect(spyUsePageNumber).toHaveBeenCalledTimes(1);

    expect(spyGetUsers).toHaveBeenCalledTimes(1);
    expect(spyGetUsers).toHaveBeenCalledWith(mockPageNumber);

    expect(spyUsePagination).toHaveBeenCalledTimes(1);
    expect(spyUsePagination).toHaveBeenCalledWith(ref(mockGetUsersData));

    expect(wrapper.findComponent<typeof UserList>(userList).props('users')).toStrictEqual(USERS_FIXTURE);
  });

  it('sets data to pagination', async () => {
    expect(wrapper.find(userListPagination).attributes('page')).toBe(mockPageNumber.value.toString());
    expect(wrapper.find(userListPagination).attributes('total')).toBe(USERS_FIXTURE.length.toString());
  });

  it('updates pagination', async () => {
    wrapper.findComponent<typeof UiPagination>(userListPagination).vm.$emit('update', 2);

    expect(spySetPage).toHaveBeenCalledTimes(1);
  });
});
