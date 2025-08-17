import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserEditPage from './UserEditPage.vue';
import UserForm from '@/user/components/UserForm.vue';

import { wrapperFactory } from '@/common/test';
import { mockRouteId, spyUseRouteId } from '@/common/mocks';
import { spyGetUser } from '@/user/mocks';
import { USER_FIXTURE } from '@/user/fixtures';

const userForm = dataTest('user-form');

let wrapper: VueWrapper<InstanceType<typeof UserEditPage>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserEditPage);
});

enableAutoUnmount(afterEach);

describe('UserEditPage', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserEditPage)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets and sets user to form', async () => {
    expect(spyUseRouteId).toBeCalledTimes(1);
    expect(spyUseRouteId).toBeCalledWith('user');

    expect(spyGetUser).toBeCalledTimes(1);
    expect(spyGetUser).toBeCalledWith({ enabled: true }, mockRouteId);

    expect(wrapper.findComponent<typeof UserForm>(userForm).props('user')).toStrictEqual(USER_FIXTURE);
  });
});
