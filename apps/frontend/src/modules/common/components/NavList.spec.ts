import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import NavList from './NavList.vue';
import NavItem from './NavItem.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { NAV_ITEMS } from '@/common/constants';

const item = dataTest('nav-list-item');

let wrapper: VueWrapper<InstanceType<typeof NavList>>;

beforeEach(() => {
  wrapper = wrapperFactory(NavList);
});

enableAutoUnmount(afterEach);

describe('NavList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(NavList)).toBeTruthy();
  });

  it('shows and set data to nav items', async () => {
    expect(wrapper.findAll(item).length).toBe(NAV_ITEMS.length);
    expect(wrapper.findComponent<typeof NavItem>(item).vm.$props.navItem).toStrictEqual(NAV_ITEMS[0]);
  });
});
