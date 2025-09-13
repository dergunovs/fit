import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import PromoBlocks from './PromoBlocks.vue';
import ScienceInfo from '@/common/components/ScienceInfo.vue';

import { wrapperFactory } from '@/common/test';

const scienceInfo = dataTest('promo-blocks-science-info');

let wrapper: VueWrapper<InstanceType<typeof PromoBlocks>>;

beforeEach(() => {
  wrapper = wrapperFactory(PromoBlocks);
});

enableAutoUnmount(afterEach);

describe('PromoBlocks', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(PromoBlocks)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emites register by science info event', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('register');

    wrapper.findComponent<typeof ScienceInfo>(scienceInfo).vm.$emit('register');

    expect(wrapper.emitted('register')).toHaveLength(1);
    expect(wrapper.emitted()['register'][0]).toStrictEqual([]);
  });
});
