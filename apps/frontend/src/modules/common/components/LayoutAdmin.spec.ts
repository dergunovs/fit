import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import LayoutAdmin from './LayoutAdmin.vue';

import { wrapperFactory } from '@/common/test';
import { spyInstallPWA } from '@/common/mocks';

const layout = dataTest('layout-admin');

let wrapper: VueWrapper<InstanceType<typeof LayoutAdmin>>;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutAdmin, { isAdmin: true, isShowInstallPWA: true, installPWA: spyInstallPWA });
});

enableAutoUnmount(afterEach);

describe('LayoutAdmin', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutAdmin)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows layout only to admin', async () => {
    expect(wrapper.find(layout).exists()).toBe(true);

    await wrapper.setProps({ isAdmin: false });

    expect(wrapper.find(layout).exists()).toBe(false);
  });
});
