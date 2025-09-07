import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import TheHero from './TheHero.vue';

import { wrapperFactory } from '@/common/test';

const benefit = dataTest('hero-benefit');

let wrapper: VueWrapper<InstanceType<typeof TheHero>>;

beforeEach(() => {
  wrapper = wrapperFactory(TheHero);
});

enableAutoUnmount(afterEach);

describe('TheHero', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(TheHero)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows benefits', async () => {
    expect(wrapper.findAll(benefit).length).toBe(4);
    expect(wrapper.find(benefit).text()).toBe('Календарь с планированием и визуализацией занятий');
  });
});
