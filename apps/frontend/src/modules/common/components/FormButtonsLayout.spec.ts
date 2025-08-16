import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import FormButtonsLayout from './FormButtonsLayout.vue';

import { wrapperFactory } from '@/common/test';

const margin = dataTest('form-buttons-layout-margin');
const buttons = dataTest('form-buttons-layout-buttons');

let wrapper: VueWrapper<InstanceType<typeof FormButtonsLayout>>;

beforeEach(() => {
  wrapper = wrapperFactory(FormButtonsLayout, { isFixed: true });
});

enableAutoUnmount(afterEach);

describe('FormButtonsLayout', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(FormButtonsLayout)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows margin if props isFixed', async () => {
    expect(wrapper.find(margin).exists()).toBe(true);

    await wrapper.setProps({ isFixed: false });

    expect(wrapper.find(margin).exists()).toBe(false);
  });

  it('sets fixed attribute to buttons styles', async () => {
    expect(wrapper.find(buttons).attributes('data-fixed')).toBe('true');

    await wrapper.setProps({ isFixed: false });

    expect(wrapper.find(buttons).attributes('data-fixed')).toBe('false');
  });
});
