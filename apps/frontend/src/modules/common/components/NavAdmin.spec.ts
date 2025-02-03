import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import NavAdmin from './NavAdmin.vue';
import NavItem from './NavItem.vue';

import { wrapperFactory } from '@/common/test';
import { NAV_ITEMS } from '@/common/constants';

const item = dataTest('nav-list-item');

let wrapper: VueWrapper<InstanceType<typeof NavAdmin>>;

beforeEach(() => {
  wrapper = wrapperFactory(NavAdmin);
});

enableAutoUnmount(afterEach);

describe('NavAdmin', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(NavAdmin)).toBeTruthy();
  });

  it('shows and set data to nav items', async () => {
    expect(wrapper.findAll(item).length).toBe(NAV_ITEMS.length);
    expect(wrapper.findComponent<typeof NavItem>(item).vm.$props.navItem).toStrictEqual(NAV_ITEMS[0]);
  });
});
