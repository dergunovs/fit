import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ScienceInfo from './ScienceInfo.vue';

import { wrapperFactory } from '@/common/test';

const register = dataTest('science-info-register');

let wrapper: VueWrapper<InstanceType<typeof ScienceInfo>>;

beforeEach(() => {
  wrapper = wrapperFactory(ScienceInfo);
});

enableAutoUnmount(afterEach);

describe('ScienceInfo', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(ScienceInfo)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('emites register by button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('register');

    await wrapper.find(register).trigger('click');

    expect(wrapper.emitted('register')).toHaveLength(1);
    expect(wrapper.emitted()['register'][0]).toStrictEqual([]);
  });
});
