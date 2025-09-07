import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTab from './UserFormTab.vue';

import { wrapperFactory } from '@/common/test';

const tabTitle = dataTest('user-form-tab-title');
const tabDescription = dataTest('user-form-tab-description');

let wrapper: VueWrapper<InstanceType<typeof UserFormTab>>;

const TITLE = 'заголовок';
const DESCRIPTION = 'описание';

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTab, { title: TITLE, description: DESCRIPTION });
});

enableAutoUnmount(afterEach);

describe('UserFormTab', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTab)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title and description', async () => {
    expect(wrapper.find(tabTitle).text()).toStrictEqual(TITLE);
    expect(wrapper.find(tabDescription).text()).toStrictEqual(DESCRIPTION);
  });
});
