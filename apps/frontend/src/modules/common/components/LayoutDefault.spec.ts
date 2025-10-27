import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import LayoutDefault from './LayoutDefault.vue';

import { wrapperFactory } from '@/common/test';

const page = dataTest('layout-default-page');

let wrapper: VueWrapper<InstanceType<typeof LayoutDefault>>;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutDefault, {});
});

enableAutoUnmount(afterEach);

describe('LayoutDefault', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutDefault)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows registration modal from page', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('register');

    wrapper.findComponent<DefineComponent>(page).vm.$emit('register');

    await nextTick();

    expect(wrapper.emitted('register')).toHaveLength(1);
    expect(wrapper.emitted()['register'][0]).toStrictEqual([]);
  });
});
