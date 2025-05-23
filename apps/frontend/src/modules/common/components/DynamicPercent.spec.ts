import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { formatPercent, dataTest } from 'mhz-helpers';

import DynamicPercent from './DynamicPercent.vue';

import { wrapperFactory } from '@/common/test';

const dynamicPercent = dataTest('dynamic-percent');
const percent = 0;

let wrapper: VueWrapper<InstanceType<typeof DynamicPercent>>;

beforeEach(() => {
  wrapper = wrapperFactory(DynamicPercent, { percent });
});

enableAutoUnmount(afterEach);

describe('DynamicPercent', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(DynamicPercent)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows formatted percent', async () => {
    expect(wrapper.find(dynamicPercent).text()).toBe(formatPercent(percent));
  });

  it('adds styling if percent is positive or negative', async () => {
    expect(wrapper.find(dynamicPercent).attributes('data-positive')).toBe('false');
    expect(wrapper.find(dynamicPercent).attributes('data-negative')).toBe('false');

    await wrapper.setProps({ percent: -2 });

    expect(wrapper.find(dynamicPercent).attributes('data-positive')).toBe('false');
    expect(wrapper.find(dynamicPercent).attributes('data-negative')).toBe('true');

    await wrapper.setProps({ percent: 2 });

    expect(wrapper.find(dynamicPercent).attributes('data-positive')).toBe('true');
    expect(wrapper.find(dynamicPercent).attributes('data-negative')).toBe('false');
  });
});
