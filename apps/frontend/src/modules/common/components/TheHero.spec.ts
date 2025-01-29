import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import TheHero from './TheHero.vue';

import { wrapperFactory } from '@/common/test';
import { HERO_BENEFITS } from '@/common/constants';

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

  it('shows benefits', async () => {
    expect(wrapper.findAll(benefit).length).toBe(HERO_BENEFITS.length);
    expect(wrapper.find(benefit).text()).toBe(HERO_BENEFITS[0]);
  });
});
