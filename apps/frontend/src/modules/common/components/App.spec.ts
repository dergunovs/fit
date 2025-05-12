import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import App from './App.vue';

import { wrapperFactory } from '@/common/test';
import { spyUseLayout, mockIsLoaded, mockLayoutDefaultName } from '@/common/mocks';
import { spyUseAuthCheck } from '@/auth/mocks';

const layout = dataTest('app-layout');

let wrapper: VueWrapper<InstanceType<typeof App>>;

beforeEach(() => {
  wrapper = wrapperFactory(App);
});

enableAutoUnmount(afterEach);

describe('App', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(App)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows layout component', async () => {
    expect(wrapper.find(layout).exists()).toBe(false);

    expect(spyUseLayout).toBeCalledTimes(1);
    mockIsLoaded.value = true;

    await nextTick();

    expect(wrapper.find(layout).exists()).toBe(true);
    expect(wrapper.find(layout).attributes('data-layout')).toBe(mockLayoutDefaultName);
  });

  it('checks auth', async () => {
    expect(spyUseAuthCheck).toBeCalledTimes(1);
  });
});
