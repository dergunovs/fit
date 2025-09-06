import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTab from './UserFormTab.vue';

import { wrapperFactory } from '@/common/test';

const tabTitle = dataTest('user-form-tab-title');

let wrapper: VueWrapper<InstanceType<typeof UserFormTab>>;

const title = 'заголовок';
const description = 'описание';

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTab, { title, description });
});

enableAutoUnmount(afterEach);

describe('UserFormTab', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTab)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(tabTitle).text()).toStrictEqual(title);
  });
});
