import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import NavList from './NavList.vue';
import NavItem from './NavItem.vue';

import IconExercise from '@/common/icons/exercise.svg?component';
import IconActivity from '@/common/icons/activity.svg?component';

import { wrapperFactory } from '@/common/test';
import { URL_EXERCISE } from '@/exercise/constants';
import { URL_ACTIVITY_ADMIN } from '@/activity/constants';

const item = dataTest('nav-list-item');

const NAV_ITEMS = [
  { url: URL_EXERCISE, title: 'Упражнения', icon: IconExercise },
  { url: URL_ACTIVITY_ADMIN, title: 'Занятия', icon: IconActivity },
];

let wrapper: VueWrapper<InstanceType<typeof NavList>>;

beforeEach(() => {
  wrapper = wrapperFactory(NavList, { navItems: NAV_ITEMS });
});

enableAutoUnmount(afterEach);

describe('NavList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(NavList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows and set data to nav items', async () => {
    expect(wrapper.findAll(item).length).toBe(NAV_ITEMS.length);
    expect(wrapper.findComponent<typeof NavItem>(item).vm.$props.navItem).toStrictEqual(NAV_ITEMS[0]);
  });
});
