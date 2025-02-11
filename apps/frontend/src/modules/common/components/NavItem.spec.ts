import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import NavItem from './NavItem.vue';

import { wrapperFactory } from '@/common/test';
import { NAV_ITEMS } from '@/common/constants';

const item = dataTest('nav-item');
const itemIcon = dataTest('nav-item-icon');
const itemTitle = dataTest('nav-item-title');

const navItem = NAV_ITEMS[0];

let wrapper: VueWrapper<InstanceType<typeof NavItem>>;

beforeEach(() => {
  wrapper = wrapperFactory(NavItem, { navItem });
});

enableAutoUnmount(afterEach);

describe('NavItem', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(NavItem)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets link', async () => {
    expect(wrapper.find(item).attributes('to')).toBe(navItem.url);
  });

  it('shows icon', async () => {
    expect(wrapper.find(itemIcon).exists()).toBe(true);
  });

  it('shows title', async () => {
    expect(wrapper.find(itemTitle).text()).toBe(navItem.title);
  });
});
